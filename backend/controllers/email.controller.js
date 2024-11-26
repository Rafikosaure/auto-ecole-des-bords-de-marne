const ENV = require('../config/env').ENV
const { deleteFile } = require('../sharedFunctions/deleteFile')
const { emailConvocFormation } = require('../models/emails/convoc_formation_email')
const { emailRelaunch } = require('../models/emails/relaunch_email')
const { emailConvocPermis } = require('../models/emails/convoc_permis_email')
const { sendMail } = require("nodemailer-mail-tracking")
const { mailTrackingOptions } = require('../sharedFunctions/mailTrackingOptions')
const { transporter } = require('../sharedFunctions/transporter')


exports.sendMailWithTracking = (req, res) => {
    try {
        // Define the student ID
        const studentId = req.params.studentId
        
        // Configure the datetime
        const dateObject = new Date()
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: '2-digit', 
            minute: '2-digit'
        }
        const datetime = dateObject.toLocaleDateString("fr-FR", options).replace(':', 'h')

        console.log('Données récupérées :', req.body)

        // Manage type of email
        let emailTypeToSend;
        if (req.body.emailType === "convocation_formation") {
            emailTypeToSend = {
                subject: `Convocation Formation - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailConvocFormation(req.body, datetime)
            }
        } else if (req.body.emailType === "relaunch") {
            emailTypeToSend = {
                subject: `Relance - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailRelaunch(req.body, datetime)
            }
        } else if (req.body.emailType === "convocation_exam") {
            emailTypeToSend = {
                subject: `Convocation Permis - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailConvocPermis(req.body, datetime)
            }
        }

        // Define if attachments are needed
        let attachments = []
        if (req.body.emailType === "convocation_formation") {
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
        if (req.body.fileData && req.body.emailType === "convocation_formation") {
            const fileName = `${req.body.fileData.documentType}-${studentId}.pdf`
            attachments.push({
                filename: fileName,
                path: `./emailAttachments/${fileName}`
            })
        }

        // Define the mail options
        const sendMailOptions = {
            data: req.body,
            from: ENV.EMAIL_SENDER_ADDRESS,
            to: req.body.studentData.studentEmail,
            attachments: attachments,
            subject: emailTypeToSend.subject,
            html: emailTypeToSend.html
        }
        sendingProcess(req.body, studentId, sendMailOptions)

        res.status(200).json({
            message: 'Email sending is success!'
        })

    } catch {
        // Define the student ID
        const studentId = req.params.studentId

        // Delete the generated file
        if (req.body.fileData) {
            deleteFile(`${req.body.fileData.documentType}-${studentId}`, './emailAttachments/', '.pdf')
        }
        
        res.status(500).json({
            message: 'Email sending failed!'
        })
    }
}

const sendingProcess = (dataRequest, studentId, sendMailOptions) => {
    sendMail(mailTrackingOptions, transporter, sendMailOptions)
    .then(data => {
        if (dataRequest.fileData) {
            deleteFile(`${dataRequest.fileData.documentType}-${studentId}`, './emailAttachments/', '.pdf')
        }
    })
}