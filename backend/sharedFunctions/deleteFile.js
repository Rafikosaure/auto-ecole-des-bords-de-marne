const fs = require('fs')


exports.deleteFile = (fileName, filePath, extention) => {
    fs.unlink(`${filePath}${fileName}${extention}`, (error) => {
    if (error) throw error;
        console.log('File deleted!');
    });
}