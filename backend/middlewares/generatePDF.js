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

            // Render HTML content using the template. On ne fournit que la
            // seule variable d'environnement réellement utilisée par les
            // templates (le chemin des images de signature), plutôt que
            // l'intégralité de ENV (secrets JWT, identifiants BDD/email...)
            // qui n'a aucune raison de transiter par le contexte de rendu.
            const htmlContent = compiledTemplate({
                ...req.body,
                COMPLETE_IMAGES_SIGNATURES_PATH: ENV.COMPLETE_IMAGES_SIGNATURES_PATH,
            });

            // Launch browser
            const browser = await chromium.launch({ headless: true });

            // Create a new browser context
            const context = await browser.newContext();

            // Create a new page
            const page = await context.newPage();

            // Le HTML rendu peut contenir des données fournies par
            // l'appelant (ex. noms de fichiers de signature) : on limite les
            // requêtes réseau que cette page peut effectuer à notre propre
            // serveur (pour charger les images de signature), afin d'écarter
            // tout risque de SSRF vers un hôte interne ou externe arbitraire.
            const allowedOrigin = new URL(ENV.BACKENDROUTE).origin;
            await page.route('**/*', (route) => {
                const requestUrl = route.request().url();
                if (requestUrl === 'about:blank' || new URL(requestUrl).origin === allowedOrigin) {
                    return route.continue();
                }
                return route.abort();
            });

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
