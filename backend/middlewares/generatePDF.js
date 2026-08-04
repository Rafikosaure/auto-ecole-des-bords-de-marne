const { chromium } = require('playwright');
const ejs = require('ejs')
const fs = require('fs');
const path = require('path');
const { ENV } = require('../config/env')
const { isValidId } = require('../utils/validateId.js')

// Liste blanche stricte : documentType pilote à la fois le nom du fichier
// EJS chargé sur le disque et son extension, il ne doit donc jamais provenir
// directement de l'utilisateur sans validation (risque de traversée de
// répertoire / injection de template).
const ALLOWED_DOCUMENT_TYPES = ['contratStagiaire', 'convocationFormation', 'convocationPermis']

exports.generatePDFfromHTML = async (req, res, next) => {
    try {
        if (req.body.fileData) {
            // Get the student ID
            const studentId = req.params.studentId
            const documentType = req.body.fileData.documentType

            if (!isValidId(studentId)) {
                return res.status(400).json({ message: "Identifiant d'étudiant invalide." })
            }
            if (!ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
                return res.status(400).json({ message: "Type de document invalide." })
            }

            // Create the file name
            const fileName = `${documentType}-${studentId}`

            // Compile EJS template
            const templateContent = fs.readFileSync(path.resolve(__dirname, `../models/files/${documentType}.ejs`), "utf-8");
            const compiledTemplate = ejs.compile(templateContent);

            // Render HTML content using the template
            const htmlContent = compiledTemplate({ ...req.body, ...ENV });

            // Launch browser
            const browser = await chromium.launch({ headless: true });

            // Create a new browser context
            const context = await browser.newContext();

            // Create a new page
            const page = await context.newPage();

            // Set HTML content directly using setContent
            await page.setContent(htmlContent);

            // Generate PDF from HTML
            await page.pdf({
                path: `./emailAttachments/${fileName}.pdf`,
                format: "A4",
            });

            // Close the browser
            await browser.close();
        }
        next()

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error
        })
    }

}
