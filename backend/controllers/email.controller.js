const { ENV } = require('../config/env')
const { prisma } = require('../prisma/client.js')
const { isValidId } = require('../utils/validateId.js')
const { deleteFile } = require('../utils/deleteFile')
const { emailConvocFormation } = require('../models/emails/convocFormationEmail')
const { emailRelaunch } = require('../models/emails/relaunchEmail')
const { emailConvocPermis } = require('../models/emails/convocPermisEmail')
const { transporter } = require('../utils/transporter')
const { datetimeConfig } = require('../utils/dateTimeConfig')

exports.sendMail = async (req, res) => {
    try {
        const sid = String(req.params.studentId);
        if (!isValidId(sid)) {
            return res.status(400).json({ message: "Identifiant d'étudiant invalide." });
        }
        const student = await prisma.student.findUnique({ where: { id: parseInt(sid) } });
        if (!student) {
            return res.status(404).json({ message: "Étudiant introuvable." });
        }

        // Le destinataire et le nom affiché dans l'email proviennent de la
        // base de données pour l'étudiant réellement ciblé par l'URL, et non
        // du corps de la requête : un appelant authentifié ne peut donc pas
        // rediriger un email officiel vers une adresse arbitraire, ni en
        // usurper le contenu nominatif. Le reste des données du formulaire
        // (dates de convocation, etc.) reste inchangé.
        const body = {
            ...req.body,
            studentData: {
                ...req.body.studentData,
                studentEmail: student.email,
                studentFirstName: student.firstName,
                studentLastName: student.lastName,
            },
        };
        const to = body.studentData.studentEmail;
        let emailSentToastMessage;
        const datetime = datetimeConfig();

        let emailTypeToSend;
        if (body.emailType === "convocationFormation") {
            emailSentToastMessage = `L'email de convocation a bien été envoyé à ${body.studentData.studentFirstName} ${body.studentData.studentLastName}.`
            emailTypeToSend = {
                subject: `Convocation Formation - ${body.studentData.studentFirstName} ${body.studentData.studentLastName}`,
                html: emailConvocFormation(body, datetime)
            }
        } else if (body.emailType === "relaunch") {
            emailSentToastMessage = `L'email de relance a bien été envoyé à ${body.studentData.studentFirstName} ${body.studentData.studentLastName}.`
            emailTypeToSend = {
                subject: `Relance - ${body.studentData.studentFirstName} ${body.studentData.studentLastName}`,
                html: emailRelaunch(body, datetime)
            }
        } else if (body.emailType === "convocationExam") {
            emailTypeToSend = {
                subject: `Convocation Permis - ${body.studentData.studentFirstName} ${body.studentData.studentLastName}`,
                html: emailConvocPermis(body, datetime)
            }
        }

        let attachments = []
        if (body.emailType === "convocationFormation") {
            attachments.push(
                { filename: `1 - Plan de Formation Détaillé.pdf`, path: `./emailAttachments/permanent/1 - Plan de Formation Détaillé.pdf` },
                { filename: `2 - Déroulement des formations B,Conduite Accompagnée Supervisée.pdf`, path: `./emailAttachments/permanent/2 - Déroulement des formations B,Conduite Accompagnée Supervisée.pdf` },
                { filename: `3- Déroulement d'une seance de formation  pratique.pdf`, path: `./emailAttachments/permanent/3- Déroulement d'une seance de formation  pratique.pdf` },
                { filename: `4 - Réglement Intérieur.pdf`, path: `./emailAttachments/permanent/4 - Réglement Intérieur.pdf` },
                { filename: `5 - Programme de Formation B - REMC.pdf`, path: `./emailAttachments/permanent/5 - Programme de Formation B - REMC.pdf` },
                { filename: `6 - CGU CPF.pdf`, path: `./emailAttachments/permanent/6 - CGU CPF.pdf` }
            )
        }
        if (body.fileData && body.emailType === "convocationFormation") {
            const fileName = `${body.fileData.documentType}-${sid}.pdf`
            attachments.push({ filename: fileName, path: `./emailAttachments/${fileName}` })
        }

        const sendMailOptions = {
            data: body,
            from: ENV.EMAIL_SENDER_ADDRESS,
            to,
            attachments,
            subject: emailTypeToSend.subject,
            html: emailTypeToSend.html
        }

        const isArrived = await sendingProcess(body, sid, sendMailOptions)
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
