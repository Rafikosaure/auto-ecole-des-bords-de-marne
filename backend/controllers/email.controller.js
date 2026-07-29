const { ENV } = require('../config/env')
const { deleteFile } = require('../utils/deleteFile')
const { emailConvocFormation } = require('../models/emails/convocFormationEmail')
const { emailRelaunch } = require('../models/emails/relaunchEmail')
const { emailConvocPermis } = require('../models/emails/convocPermisEmail')
const { transporter } = require('../utils/transporter')
const { datetimeConfig } = require('../utils/dateTimeConfig')

exports.sendMail = async (req, res) => {
    try {
        const to = req.body.studentData.studentEmail;
        const sid = String(req.params.studentId);
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
