const { chromium } = require('playwright');
const ejs = require('ejs')
const fs = require('fs');
const path = require('path');
const ENV = require('../config/env').ENV


exports.generatePDFfromHTML = async (req, res, next) => {
    try {
        // console.log('Données arrivant au serveur :', req.body)

        if (req.body.fileData) {
            // Compile EJS template
            const templateContent = fs.readFileSync(path.resolve(__dirname, `../models/files/${req.body.fileData.documentType}.ejs`), "utf-8");
            const compiledTemplate = ejs.compile(templateContent);

            // Render HTML content using the template
            const htmlContent = compiledTemplate({ ...req.body, ...ENV });

            // Launch browser
            const browser = await chromium.launch();

            // Create a new browser context
            const context = await browser.newContext();

            // Create a new page
            const page = await context.newPage();

            // Set HTML content directly using setContent
            await page.setContent(htmlContent);

            // Generate PDF from HTML
            await page.pdf({
                path: `./emailAttachments/${req.body.fileData.documentType}.pdf`, // Specify the path to save the PDF file
                format: "A4", // Specify the page format
                // Other options such as scale, margin, printBackground, etc., can be provided here
            });

            // Close the browser
            await browser.close();

            console.log("PDF file generated successfully.");
        }
        next()

    } catch {
        res.status(500).json({
            message: "PDF file generation failed!"
        })
    }
    
}