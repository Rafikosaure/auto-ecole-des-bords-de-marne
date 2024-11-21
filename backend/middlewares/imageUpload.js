// const multer = require('multer')
// const fs = require('fs');
// const { ENV } = require('../config/env.js')


// // Vérifie si le dossier existe, sinon le crée
// if (!fs.existsSync(ENV.STUDENTCONTRACTIMAGES)) {
//     fs.mkdirSync(ENV.STUDENTCONTRACTIMAGES, { recursive: true });
// }

// // Configuration de Multer pour gérer les fichiers en base64
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, ENV.STUDENTCONTRACTIMAGES);  // Enregistrement dans le dossier contractImages
//     },
//     filename: (req, file, cb) => {
//         const imageName = req.body.imageName
//         const studentId = req.params.id
//         cb(null, imageName + studentId + '.png');  // Ajoute l'extension .png
//     }
// });

// module.exports = multer({ storage: storage }).single('image')





// Middleware pour accepter des images en base64 dans le corps de la requête
exports.uploadImageMiddleware = (req, res, next) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
        return res.status(400).json({ error: 'Aucune image en base64 reçue' });
        }

        // Supprime le préfixe 'data:image/png;base64,' si présent
        const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
        
        // Convertit les données base64 en un buffer
        req.fileBuffer = Buffer.from(base64Data, 'base64');
        
        next(); // Passe au prochain middleware ou à la fonction de contrôleur
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors du traitement de l\'image', details: error.message });
    }
};