const express = require('express')
const router = express.Router()
const mailCtrl = require('../controllers/email.controller')
const { generatePDFfromHTML } = require('../middlewares/generatePDF')
const { verifyToken } = require('../middlewares/verifyToken.js')


// Route pour envoyer des emails
router.post('/send-mail/:studentId', verifyToken, generatePDFfromHTML, mailCtrl.sendMail)

module.exports = router
