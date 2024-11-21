const path = require('path')
const { deleteFile } = require('../sharedFunctions/deleteFile.js')
const sharp = require('sharp');
const fs = require('fs');



const uploadOneImage = async (req, res) => {
    try {
        // Définir l'identifiant de l'étudiant
        const studentId = req.params.studentId

        // Définir le nom du fichier
        const { fileName } = req.body;
        if (!fileName) {
            return res.status(400).json({ error: 'Le nom du fichier est requis' });
        }

        const imageName = `${fileName}-${studentId}`
        
        // Dossier de destination des images
        const uploadPath = `./assets/contractImages/`
        
        // Vérifier l'existence du dossier
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
    
        // Utilise Sharp pour redimensionner l'image
        sharp(req.fileBuffer)
        .resize(250) // Redimensionne l'image à 500x500px (tu peux ajuster)
        .toFormat('png')  // Convertit en PNG
        .toFile(path.join(uploadPath, `${imageName}.png`), (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Erreur lors du traitement de l\'image', details: error.message });
            }
            res.status(200).json({
                message: 'Image traitée et sauvegardée avec succès!',
                filePath: `/contract-signatures/${imageName}.png`
            });
        });
        

    } catch(error) {
        res.status(500).json({ error: 'Erreur lors du traitement de l\'image', details: error.message });
    }
}


const downloadOneDocument = async (req, res) => {
    try {
        // Définir l'identifiant de l'étudiant
        const studentId = req.params.studentId

        // Définir le nom du fichier
        const filename = `${req.body.fileData.documentType}-${studentId}`

        // Définir le chemin vers le fichier
        const filepath = path.join(process.cwd(),'emailAttachments', `${filename}.pdf`);

        // Télécharger le fichier
        res.sendFile(filepath, { headers: { 'Content-Disposition': `attachment; filename=${filename}.pdf` } })

    } catch(error) {

        // Définir le nom du fichier
        const filename = `${req.body.fileData.documentType}-${req.params.studentId}`
        
        console.log('ERREUR !')
        // Supprimer le fichier en cas d'erreur
        deleteFile(filename, './emailAttachments/', '.pdf')

        // Message d'erreur dans la console
        console.error('Erreur dans le contrôleur de téléchargement:', error);

        // Réponse au client
        res.status(500).json({ message: "Une erreur est survenue lors du téléchargement du fichier" });
    }
}


const deleteDocumentsAfterContractGeneration = async (req, res) => {
    try {
        // Récupérer l'identifiant de l'étudiant
        const studentId = req.params.studentId

        // Constitution des données
        const file1 = {
            filename: `Contrat_Stagiaire-${studentId}`,
            extention: ".pdf",
            path: "./emailAttachments/"
        }
        const file2 = {
            filename: `studentInitials-${studentId}`,
            extention: ".png",
            path: "./assets/contractImages/"
        }
        const file3 = {
            filename: `studentSignature-${studentId}`,
            extention: ".png",
            path: "./assets/contractImages/"
        }
        const file4 = {
            filename: `legalRepresentSignature-${studentId}`,
            extention: ".png",
            path: "./assets/contractImages/"
        }
        const filesToDelete = [file1, file2, file3, file4]
        
        // Suppression des fichiers en itérant sur le tableau
        filesToDelete.map(file => {
            deleteFile(file.filename, file.path, file.extention)
        })

        res.status(200).json({
            message: "Suppression des fichiers réussie !"
        })

    } catch(error) {

        console.log('Erreur lors de la suppression des fichiers :', error)
        res.status(400).json({
            message: "La suppression des fichiers a échouée !"
        })
    }
}




const addAllDocuments = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const addDocument = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const getDocument = async (req, res, next) => {
    try {
    } catch (e) {

    }
}

const getAllDocuments = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const updateAllDocuments = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const updateDocument = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const deleteAllDocuments = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const deleteDocument = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}


// exports
exports.addAllDocuments = addAllDocuments;
exports.addDocument = addDocument;
exports.getDocument = getDocument;
exports.getAllDocuments = getAllDocuments;
exports.uploadOneImage = uploadOneImage;
exports.updateAllDocuments = updateAllDocuments;
exports.updateDocument = updateDocument;
exports.deleteAllDocuments = deleteAllDocuments;
exports.deleteDocument = deleteDocument;
exports.downloadOneDocument = downloadOneDocument;
exports.deleteDocumentsAfterContractGeneration = deleteDocumentsAfterContractGeneration;