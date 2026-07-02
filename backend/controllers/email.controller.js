const { ENV } = require('../config/env')
const { deleteFile } = require('../utils/deleteFile')
const { emailConvocFormation } = require('../models/emails/convocFormationEmail')
const { emailRelaunch } = require('../models/emails/relaunchEmail')
const { emailConvocPermis } = require('../models/emails/convocPermisEmail')
const { transporter } = require('../utils/transporter')
const { datetimeConfig } = require('../utils/dateTimeConfig')
const { verifySignature, hashEmail, anonymizeIp } = require('../utils/tracking');
const crypto = require('crypto');
const { signParams } = require('../utils/tracking');
const { prisma } = require('../prisma/client.js');

const PIXEL = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c630001000101000018dddc0d0000000049454e44ae426082',
  'hex'
);


exports.sendMail = async (req, res) => {
    try {
        const to = req.body.studentData.studentEmail;
        const messageId = crypto.randomUUID();
        const sid = String(req.params.studentId);
        const base = `${ENV.BACKENDROUTE}/api/tracking/tracking`;
        const sig = signParams({ mid: messageId, sid });
        let emailSentToastMessage;
        const datetime = datetimeConfig();

        let emailTypeToSend;
        if (req.body.emailType === "convocationFormation") {
            emailSentToastMessage = `L'email de convocation a bien été envoyé à ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}.`
            emailTypeToSend = {
                subject: `Convocation Formation - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailConvocFormation(req.body, datetime)
            }
        } else if (req.body.emailType === "relaunch") {
            emailSentToastMessage = `L'email de relance a bien été envoyé à ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}.`
            emailTypeToSend = {
                subject: `Relance - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailRelaunch(req.body, datetime)
            }
        } else if (req.body.emailType === "convocationExam") {
            emailTypeToSend = {
                subject: `Convocation Permis - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailConvocPermis(req.body, datetime)
            }
        }

        let attachments = []
        if (req.body.emailType === "convocationFormation") {
            attachments.push(
                { filename: `1 - Plan de Formation Détaillé.pdf`, path: `./emailAttachments/permanent/1 - Plan de Formation Détaillé.pdf` },
                { filename: `2 - Déroulement des formations B,Conduite Accompagnée Supervisée.pdf`, path: `./emailAttachments/permanent/2 - Déroulement des formations B,Conduite Accompagnée Supervisée.pdf` },
                { filename: `3- Déroulement d'une seance de formation  pratique.pdf`, path: `./emailAttachments/permanent/3- Déroulement d'une seance de formation  pratique.pdf` },
                { filename: `4 - Réglement Intérieur.pdf`, path: `./emailAttachments/permanent/4 - Réglement Intérieur.pdf` },
                { filename: `5 - Programme de Formation B - REMC.pdf`, path: `./emailAttachments/permanent/5 - Programme de Formation B - REMC.pdf` },
                { filename: `6 - CGU CPF.pdf`, path: `./emailAttachments/permanent/6 - CGU CPF.pdf` }
            )
        }
        if (req.body.fileData && req.body.emailType === "convocationFormation") {
            const fileName = `${req.body.fileData.documentType}-${sid}.pdf`
            attachments.push({ filename: fileName, path: `./emailAttachments/${fileName}` })
        }

        const sendMailOptions = {
            data: req.body,
            from: ENV.EMAIL_SENDER_ADDRESS,
            to,
            attachments,
            subject: emailTypeToSend.subject,
            html: emailTypeToSend.html
        }

        const isArrived = await sendingProcess(req.body, sid, sendMailOptions)
        res.status(200).json({
            message: 'Email sending is success!',
            emailIsArrived: isArrived,
            toastNotification: emailSentToastMessage,
            datetime
        })

    } catch {
        const sid = String(req.params.studentId)
        if (req.body.fileData) {
            deleteFile(`${req.body.fileData.documentType}-${sid}`, './emailAttachments/', '.pdf')
        }
        res.status(500).json({ message: 'Email sending failed!' })
    }
}

const sendingProcess = async (dataRequest, sid, sendMailOptions) => {
    const data = await transporter.sendMail(sendMailOptions)
    if (dataRequest.fileData) {
        deleteFile(`${dataRequest.fileData.documentType}-${sid}`, './emailAttachments/', '.pdf')
    }
    return data.accepted.includes(dataRequest.studentData.studentEmail);
}


exports.getTrackingStats = async (req, res) => {
    try {
        const messages = await prisma.emailMessage.findMany({
            where: { studentId: String(req.params.studentId) },
            include: { open: true },
            orderBy: { sentAt: 'desc' },
        });
        res.status(200).json({ stats: messages });
    } catch (err) {
        console.error('[getTrackingStats] erreur:', err);
        res.status(500).json({ message: 'Impossible de récupérer les statistiques de tracking.' });
    }
};

exports.trackEmailOpen = async (req, res) => {
    const { mid, sid, e, sig } = req.query;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', PIXEL.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.end(PIXEL);

    if (!mid || !sid || !e || !verifySignature({ mid, sid, sig })) {
        const ipRaw = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
        console.warn('[trackEmailOpen] requête bloquée — signature invalide ou paramètres manquants', {
            mid: mid || '(absent)', sid: sid || '(absent)',
            hasEmail: !!e, hasSig: !!sig,
            ip: anonymizeIp(ipRaw), ua: req.get('user-agent') || 'unknown',
            at: new Date().toISOString(),
        });
        return;
    }

    const now = new Date();
    const ua = req.get('user-agent') || 'unknown';
    const ipRaw = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
    const ip = anonymizeIp(ipRaw);
    const emailHash = hashEmail(e);

    try {
        await prisma.$transaction(async (tx) => {
            const row = await tx.emailOpen.findUnique({ where: { messageId: mid } });

            if (!row) {
                await tx.emailOpen.create({
                    data: {
                        messageId: mid, studentId: sid, emailHash,
                        opensCount: 1, firstOpenedAt: now, lastOpenedAt: now,
                        userAgents: [ua], ips: [ip],
                    },
                });
            } else {
                const nextAgents = Array.isArray(row.userAgents) ? [...row.userAgents] : [];
                const nextIps = Array.isArray(row.ips) ? [...row.ips] : [];
                if (ua && !nextAgents.includes(ua)) nextAgents.push(ua);
                if (ip && !nextIps.includes(ip)) nextIps.push(ip);

                await tx.emailOpen.update({
                    where: { messageId: mid },
                    data: {
                        opensCount: row.opensCount + 1,
                        lastOpenedAt: now,
                        userAgents: nextAgents,
                        ips: nextIps,
                    },
                });
            }
        });
    } catch (err) {
        console.error('[trackEmailOpen] DB error:', err);
    }
};
