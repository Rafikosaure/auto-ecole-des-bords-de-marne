const sharp = require("sharp");
const { createError, errors, contexts } = require("./errorHandler");

// used to keep sharp image processing consistent across multiple functions

/**
 * @async Handles the processing of an image using `Sharp`.
 * @param {object} file - File to be processed.
 * @param {string} extension - extension of the base file 
 * @returns {Buffer} The processed file.
 */
const processImage = async (file, extension) => {
    // raises an error if a pdf is larger than 1Mb
    if (extension == "pdf" && Buffer.byteLength(file) > 1000000) throw createError(null, errors.ErrorFileTooLarge, contexts.instructorDocuments);
    if (extension != "pdf") file = await sharp(file).resize(1920, 1080, { fit: 'inside', gravity: "center" }).toBuffer();
    return file;
}

exports.processImage = processImage;