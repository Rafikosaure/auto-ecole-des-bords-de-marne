const sharp = require("sharp");

// used to keep sharp image processing consistent across multiple functions

const processImage = async (image) => {
    return await sharp(image).resize(500, 500, { fit: 'inside', gravity: "center"}).toBuffer()
}

exports.processImage = processImage;