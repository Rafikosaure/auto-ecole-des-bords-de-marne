const sharp = require("sharp");

// used to keep sharp image processing consistent across multiple functions

/**
 * @async Handles the processing of an image using `Sharp`.
 * @param {object} image - Image to be processed.
 * @returns {Buffer} The processed image.
 */
const processImage = async (image) => {
    return await sharp(image).resize(500, 500, { fit: 'inside', gravity: "center"}).toBuffer()
}

exports.processImage = processImage;