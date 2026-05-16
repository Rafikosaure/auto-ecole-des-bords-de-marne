const { ENV } = require('../config/env')
const { deleteFile } = require('../utils/deleteFile')
const { emailConvocFormation } = require('../models/emails/convocFormationEmail')
const { emailRelaunch } = require('../models/emails/relaunchEmail')
const { emailConvocPermis } = require('../models/emails/convocPermisEmail')
const { transporter } = require('../utils/transporter')
const { datetimeConfig } = require('../utils/dateTimeConfig')
const { EmailOpen, sequelize } = require('../models');
const { verifySignature, hashEmail, anonymizeIp } = require('../utils/tracking');
const crypto = require('crypto');
const { EmailMessage } = require('../models');
const { signParams } = require('../utils/tracking');
const PIXEL = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c630001000101000018dddc0d0000000049454e44ae426082',
  'hex'
);


exports.sendMail = async (req, res) => {
    try {
        // Define the student email
        const to = req.body.studentData.studentEmail;

        // Generate a unique message ID
        const messageId = crypto.randomUUID();

        // Define the student ID
        const sid = String(req.params.studentId)

        // Route for email tracking
        const base = `${ENV.BACKENDROUTE}/api/tracking/tracking`;

        // Generate the signature
        const sig  = signParams({ mid: messageId, sid });

        // Initialize email toast message
        let emailSentToastMessage;

        // Configure the datetime
        const datetime = datetimeConfig()

        // Manage type of email
        let emailTypeToSend;
        if (req.body.emailType === "convocationFormation") {
            // trackingToastMessage = `${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName} a bien reçu l'email de convocation à la formation !`
            emailSentToastMessage = `L'email de convocation a bien été envoyé à ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}.`
            emailTypeToSend = {
                subject: `Convocation Formation - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailConvocFormation(req.body, datetime)
            }
        } else if (req.body.emailType === "relaunch") {
            // trackingToastMessage = `${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName} a bien reçu l'email de relance !`
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

        // Define if attachments are needed
        let attachments = []
        if (req.body.emailType === "convocationFormation") {
            attachments.push(
                {
                    filename: `1 - Plan de Formation Détaillé.pdf`,
                    path: `./emailAttachments/permanent/1 - Plan de Formation Détaillé.pdf`
                },
                {
                    filename: `2 - Déroulement des formations B,Conduite Accompagnée Supervisée.pdf`,
                    path: `./emailAttachments/permanent/2 - Déroulement des formations B,Conduite Accompagnée Supervisée.pdf`
                },
                {
                    filename: `3- Déroulement d'une seance de formation  pratique.pdf`,
                    path: `./emailAttachments/permanent/3- Déroulement d'une seance de formation  pratique.pdf`
                },
                {
                    filename: `4 - Réglement Intérieur.pdf`,
                    path: `./emailAttachments/permanent/4 - Réglement Intérieur.pdf`
                },
                {
                    filename: `5 - Programme de Formation B - REMC.pdf`,
                    path: `./emailAttachments/permanent/5 - Programme de Formation B - REMC.pdf`
                },
                {
                    filename: `6 - CGU CPF.pdf`,
                    path: `./emailAttachments/permanent/6 - CGU CPF.pdf`
                }
            )
        }
        if (req.body.fileData && req.body.emailType === "convocationFormation") {
            const fileName = `${req.body.fileData.documentType}-${sid}.pdf`
            attachments.push({
                filename: fileName,
                path: `./emailAttachments/${fileName}`
            })
        }

        // Define the mail options
        const sendMailOptions = {
            data: req.body,
            from: ENV.EMAIL_SENDER_ADDRESS,
            to: to,
            attachments: attachments,
            subject: emailTypeToSend.subject,
            html: emailTypeToSend.html
        }

        const isArrived = await sendingProcess(req.body, sid, sendMailOptions)
        res.status(200).json({
            message: 'Email sending is success!',
            emailIsArrived: isArrived,
            toastNotification: emailSentToastMessage,
            datetime: datetime
        })

    } catch {
        // Define the student ID
        const sid = String(req.params.studentId)

        // Delete the generated file
        if (req.body.fileData) {
            deleteFile(`${req.body.fileData.documentType}-${sid}`, './emailAttachments/', '.pdf')
        }
        
        res.status(500).json({
            message: 'Email sending failed!'
        })
    }
}

const sendingProcess = async (dataRequest, sid, sendMailOptions) => {
    const data = await transporter.sendMail(sendMailOptions)

    if (dataRequest.fileData) {
        deleteFile(`${dataRequest.fileData.documentType}-${sid}`, './emailAttachments/', '.pdf')
    }
    if (data.accepted.includes(dataRequest.studentData.studentEmail)) {
        return true
    }
    return false
}


exports.getTrackingStats = async (req, res) => {
  try {
    const messages = await EmailMessage.findAll({
      where: { studentId: String(req.params.studentId) },
      include: [{ model: EmailOpen, as: 'open' }],
      order: [['sentAt', 'DESC']],
    });
    res.status(200).json({ stats: messages });
  } catch (err) {
    console.error('[getTrackingStats] erreur:', err);
    res.status(500).json({ message: 'Impossible de récupérer les statistiques de tracking.' });
  }
};

exports.trackEmailOpen = async (req, res) => {
  const { mid, sid, e, sig } = req.query;

  // Réponse immédiate (pixel) + anti-cache
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Length', PIXEL.length);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.end(PIXEL);

  // Après réponse : traitement non bloquant
  if (!mid || !sid || !e || !verifySignature({ mid, sid, sig })) {
    const ipRaw = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
    console.warn('[trackEmailOpen] requête bloquée — signature invalide ou paramètres manquants', {
      mid: mid || '(absent)',
      sid: sid || '(absent)',
      hasEmail: !!e,
      hasSig: !!sig,
      ip: anonymizeIp(ipRaw),
      ua: req.get('user-agent') || 'unknown',
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
    sequelize.transaction(async (t) => {
      const row = await EmailOpen.findOne({ where: { messageId: mid }, transaction: t, lock: t.LOCK.UPDATE });

      if (!row) {
        await EmailOpen.create({
          messageId: mid,
          studentId: sid,
          emailHash,
          opensCount: 1,
          firstOpenedAt: now,
          lastOpenedAt: now,
          userAgents: [ua],
          ips: [ip],
        }, { transaction: t });
      } else {
        const nextAgents = Array.isArray(row.userAgents) ? [...row.userAgents] : [];
        const nextIps = Array.isArray(row.ips) ? [...row.ips] : [];
        if (ua && !nextAgents.includes(ua)) nextAgents.push(ua);
        if (ip && !nextIps.includes(ip)) nextIps.push(ip);

        await row.update({
          opensCount: row.opensCount + 1,
          lastOpenedAt: now,
          userAgents: nextAgents,
          ips: nextIps,
        }, { transaction: t });
      }
    });
  } catch (err) {
    console.error('[trackEmailOpen] DB error:', err);
  }
};