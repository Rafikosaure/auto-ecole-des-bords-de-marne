// errors references for createError switch case
const errors = {
    ErrorNotExist: "notExist",
    ErrorWrongCredentials: "wrongCredentials",
    ErrorWrongFileFormat: "wrongFileFormat",
    ErrorUndefinedKey: "undefinedKey",
    ErrorNoToken: "noToken",
    ErrorInvalidToken: "invalidToken",
    ErrorNoFileProvided: "noFileProvided"
}

// errors contexts for error handler messages (where error happens)
const contexts = {
    remark: "Remark",
    admin: "Admin",
    instructor: "Instructor",
    student: "Student",
    Token: "Token",
    instructorDocuments: "Instructors documents"
}

// logs and sents an appropriate response given an error
const errorHandler = (req, res, error, context) => {
    // log
    console.log({Error:
        {
            "name" : error.name,
            "message" : error.message
        }}
    );
    // proper string formatting for more accurate description
    const target = context == "Admin" && req.body.username
                    || (context == "Student" || context == "Instructor") && `${req.body.lastName} ${req.body.firstName}`
    // responses
    switch (error.name) {
        case "SequelizeUniqueConstraintError":
            return res.status(404).json({error: error.message, message: `${context} ${target} already exists`});
        case "SequelizeValidationError":
        case "noFileProvided":
        case "SequelizeForeignKeyConstraintError":
            return res.status(404).json({error: error.message, message: `Invalid body provided`});
        case "DoesNotExistInDb":
        case "WrongCredentials":
        case "WrongFileFormat":
        case "KeyNotProvided":
        case "NoToken":
        case "InvalidToken":
            // if error has no status (undefined) it will be 404 by default
            error.status ??= 404;
            return res.status(error.status).json({error: error.name, message: error.message});
        default:
            return res.status(500).json({error: error.name, message: "An error has occured"});
     }
}

// creates an error to be thrown given an issue
const createError = (req, issue, context) => {
    const error = new Error()
    switch (issue) {
        case errors.ErrorNotExist:
            error.name = "DoesNotExistInDb";
            req.params.id && (error.message = `${context} with id={${req.params.id}} does not exsist`);
            req.body.instructorId && (error.message = `${context} with id={${req.body.instructorId}} does not exsist`);
            break;
        case errors.ErrorWrongCredentials:
            error.name = "WrongCredentials";
            error.message = `Invalid credentials provided`;
            break;
        case errors.ErrorWrongFileFormat:
            // unsupported media type
            error.status = 415;
            error.name = "WrongFileFormat";
            error.message = `Supported file formats are : .png .jpg .jpeg .pdf`;
            break;
        case errors.ErrorUndefinedKey:
            error.name = "KeyNotProvided";
            error.message = context == contexts.remark &&  `StudentId must be provided`;
            break;
        case errors.ErrorNoToken:
            // if no token unauthorized => 401
            error.status = 401;
            error.name = "NoToken";
            error.message = "Admin must be logged in";
            break;
        case errors.ErrorInvalidToken:
            // if token but wrong token forbidden => 403
            error.status = 403;
            error.name = "InvalidToken";
            error.message = "Connexion token is not valid";
            break;
        case errors.ErrorNoFileProvided:
            error.name = "noFileProvided";
            error.message = "No documents were sent with the request";
            break;
        default:
            break;
    }
    return error;
}

exports.errorHandler = errorHandler;
exports.createError = createError;
exports.contexts = contexts;
exports.errors = errors;