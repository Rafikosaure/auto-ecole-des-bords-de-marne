const fs = require('fs')

// Suprime un fichier temporaire
exports.deleteFile = (fileName, filePath, extention) => {
    // Définir le fichier et son adresse
    const file = `${filePath}${fileName}${extention}`
    
    // Vérifier l'existence du fichier
    const isExists = fs.existsSync(file);

    // Supprimer le fichier
    if (isExists) {
        fs.unlink(file, (error) => {
            if (error) throw error;
        });
    }
}