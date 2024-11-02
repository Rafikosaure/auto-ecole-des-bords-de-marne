const express = require('express')
const router = express.Router()
const mailCtrl = require('../controllers/email.controller')
const { generatePDFfromHTML } = require('../middlewares/generatePDF')



// Route pour envoyer des emails
router.post('/send-tracked-email', generatePDFfromHTML, mailCtrl.sendMailWithTracking)

module.exports = router