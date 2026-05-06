const { chromium } = require('playwright');
const ejs = require('ejs')
const fs = require('fs');
const path = require('path');
const { ENV } = require('../config/env')


exports.generatePDFfromHTML = async (req, res, next) => {
    try {
        if (req.body.fileData) {
            // Get the student ID
            const studentId = req.params.studentId

            // Create the file name
            const fileName = `${req.body.fileData.documentType}-${studentId}`

            // Compile EJS template
            const templateContent = fs.readFileSync(path.resolve(__dirname, `../models/files/${req.body.fileData.documentType}.ejs`), "utf-8");
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
