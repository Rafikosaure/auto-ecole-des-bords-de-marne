const express = require('express')
const router = express.Router()
const mailCtrl = require('../controllers/email.controller')
const { generatePDFfromHTML } = require('../middlewares/generatePDF')


// Route pour envoyer / tracker des emails
router.post('/send-mail/:studentId', generatePDFfromHTML, mailCtrl.sendMail)
router.get('/tracking', mailCtrl.trackEmailOpen)
router.get('/stats/:studentId', mailCtrl.getTrackingStats)

module.exports = router