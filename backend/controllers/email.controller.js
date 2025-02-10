const ENV = require('../config/env').ENV
const { deleteFile } = require('../sharedFunctions/deleteFile')
const { emailConvocFormation } = require('../models/emails/convoc_formation_email')
const { emailRelaunch } = require('../models/emails/relaunch_email')
const { emailConvocPermis } = require('../models/emails/convoc_permis_email')
const { sendMail } = require("nodemailer-mail-tracking")
const { mailTrackingOptions } = require('../sharedFunctions/mailTrackingOptions')
const { transporter } = require('../sharedFunctions/transporter')


exports.sendMailWithTracking = async (req, res) => {
    try {
        // Define the student ID
        const studentId = req.params.studentId
        
        // Email data for driven-school student tracking
        let trackingToastMessage;

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
            trackingToastMessage = `${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName} a bien reçu l'email de convocation à la formation !`
            emailTypeToSend = {
                subject: `Convocation Formation - ${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName}`,
                html: emailConvocFormation(req.body, datetime)
            }
        } else if (req.body.emailType === "relaunch") {
            trackingToastMessage = `${req.body.studentData.studentFirstName} ${req.body.studentData.studentLastName} a bien reçu l'email de relance !`
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

        const isArrived = await sendingProcess(req.body, studentId, sendMailOptions)
        console.log('Email arrivé à bon port :', isArrived)
        
        res.status(200).json({
            message: 'Email sending is success!',
            emailIsArrived: isArrived,
            toastNotification: trackingToastMessage,
            datetime: datetime
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

const sendingProcess = async (dataRequest, studentId, sendMailOptions) => {
    const data = await sendMail(mailTrackingOptions, transporter, sendMailOptions)
    if (dataRequest.fileData) {
        deleteFile(`${dataRequest.fileData.documentType}-${studentId}`, './emailAttachments/', '.pdf')
    }
    console.log('DATA :', data[0].result.accepted)
    if (data[0].result.accepted[0] === dataRequest.studentData.studentEmail) {
        return true
    }
    return false
}