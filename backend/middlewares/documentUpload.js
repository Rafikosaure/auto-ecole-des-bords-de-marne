const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { createError,
    contexts,
    errors, 
    errorHandler} = require('./errorHandler.js');

const { ENV } = require("../config/env.js");

// checks if assets/instructors exists
if(!fs.existsSync(ENV.INSTRUCTORSDOCUMENTSPATH)){
    // creates the directory if it doesn't exists
    fs.mkdirSync(ENV.INSTRUCTORSDOCUMENTSPATH, {recursive: true});
    console.log(`Path ${ENV.INSTRUCTORSDOCUMENTSPATH} has been created`);
};

const storage = multer.diskStorage({
    // sets the destination folder for the files
    destination: function (req, file, cb){
        cb(null, ENV.INSTRUCTORSDOCUMENTSPATH);
    },
    filename: function (req, file, cb) {
        // slices filename if it's too long
        if(file.originalname.length > 50) file.originalname = file.originalname.slice(0, 50);
        // formats the filename to make it "unique"
        const filename = file.originalname + '-' + Date.now();
        // creates a files.filenames array in the request to store the filenames if it doesn't exists
        req.files.filenames ??= new Array();
        req.files.filenames.push(filename);
        // creates a files.extensions array in the request to store the original extensions if it doesn't exists
        req.files.extensions ??= new Array();
        req.files.extensions.push(path.extname(file.originalname).substring(1));
        cb(null, filename);
    },
});

/**
 * Creates an upload object to handle multer files uploading.
 * @param {boolean} multiple - Used to dertermine the max number of documents accepted,`true` by default.
 * @returns {object} Multer upload object.
 */
const createUpload = (multiple=true) => {
    const upload = multer({
        // sets storage
        storage: storage,
        // sets files upload limit
        limits: {
            files: multiple ? 4 : 1
        },
        // sets the accepted extensions
        // any other extension will trigger a multer error
        fileFilter: function(req, file, cb) {
            const extension = path.extname(file.originalname);
            if(extension !== ".png"
                && extension !== ".jpg"
                && extension !== ".jpeg"
                && extension !== ".pdf"
            ) {
                return(cb(createError(req, errors.ErrorWrongFileFormat, contexts.instructorDocuments)));
            };
            cb(null, true);
        }
});
    return upload;
};

/**
 * Handles the uploading of multiple files.
 * @param {object} key - Sent `FormData` key associated with the files.
 * @returns {Function} `CreateUpload()` to filter and store the files.
 */
const documentUploadMany = (key) => {
    return createUpload().array(key);
};

/**
 * Handles the uploading of a single file.
 * @param {object} key - Sent `FormData` key associated with the files.
 * @returns {Function} `CreateUpload()` to filter and store the files.
 */
const documentUploadOne = (key) => {
    return createUpload(multiple=false).array(key);
};

exports.documentUploadMany = documentUploadMany;
exports.documentUploadOne = documentUploadOne;