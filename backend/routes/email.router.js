const express = require('express')
const router = express.Router()
const mailCtrl = require('../controllers/email.controller')
const { generatePDFfromHTML } = require('../middlewares/generatePDF')


// Route pour envoyer des emails
router.post('/send-mail/:studentId', generatePDFfromHTML, mailCtrl.sendMail)

module.exports = router
