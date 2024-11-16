const path = require('path')
const { deleteFile } = require('../sharedFunctions/deleteFile')


const downloadOneDocument = async (req, res) => {
    try {
        // Définir le nom du fichier
        const filename = defineFileName(req.body.fileData, req.params.fileName)

        // Définir le chemin vers le fichier
        const filepath = path.join(process.cwd(),'emailAttachments', `${filename}.pdf`);

        // Télécharger le fichier
        res.sendFile(filepath, { headers: { 'Content-Disposition': `attachment; filename=${filename}.pdf` } })

    } catch(error) {

        // Définir le nom du fichier
        const filename = defineFileName(req.body.fileData, req.params.fileName)
        
        // Supprimer le fichier en cas d'erreur
        deleteFile(filename, './emailAttachments/', '.pdf')

        // Message d'erreur dans la console
        console.error('Erreur dans le contrôleur de téléchargement:', error);

        // Réponse au client
        res.status(500).json({ message: "Une erreur est survenue lors du téléchargement du fichier" });
    }
}


// Fonction pour définir le nom du fichier
const defineFileName = (fileData, nameParams) => {
    let filename;
    if (fileData) {
        filename = fileData.documentType
    } else {
        filename = nameParams
    }
    return filename
}


const deleteDocumentsAfterContractGeneration = async (req, res) => {
    try {
        // Constitution des données
        const file1 = {
            filename: "Contrat_Stagiaire",
            extention: ".pdf",
            path: "./emailAttachments/"
        }
        const file2 = {
            filename: "studentInitials",
            extention: ".png",
            path: "./assets/contractImages/"
        }
        const file3 = {
            filename: "studentSignature",
            extention: ".png",
            path: "./assets/contractImages/"
        }
        const file4 = {
            filename: "legalRepresentSignature",
            extention: ".png",
            path: "./assets/contractImages/"
        }
        const filesToDelete = [file1, file2, file3, file4]
        
        // Suppression des fichiers en itérant sur le tableau
        filesToDelete.map(file => deleteFile(file.filename, file.path, file.extention))

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

const getAllDocuments = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const getDocument = async (req, res, next) => {
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
exports.getAllDocuments = getAllDocuments;
exports.getDocument = getDocument;
exports.updateAllDocuments = updateAllDocuments;
exports.updateDocument = updateDocument;
exports.deleteAllDocuments = deleteAllDocuments;
exports.deleteDocument = deleteDocument;
exports.downloadOneDocument = downloadOneDocument;
exports.deleteDocumentsAfterContractGeneration = deleteDocumentsAfterContractGeneration;