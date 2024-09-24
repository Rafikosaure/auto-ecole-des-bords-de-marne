const errors = {
    ErrorNotExist: "notExist",
    ErrorWrongCredentials: "wrongCredentials",
    ErrorWrongFileFormat: "wrongFileFormat",
    ErrorUndefinedKey: "undefinedKey"
}

const contexts = {
    remark: "Remark",
    admin: "Admin",
    instructor: "Instructor",
    student: "Student"
}

const errorHandler = (req, res, error, context) => {
    console.log({"Error":
        {
            "name" : error.name,
            "message" : error.message
        }}
    );
    const target = context == "Admin" && req.body.username
                    || (context == "Student" || context == "Instructor") && `${req.body.lastName} ${req.body.firstName}`
    switch (error.name) {
        case "SequelizeUniqueConstraintError":
            return res.status(404).json({error: error.message, message: `${context} ${target} already exists`});
        case "SequelizeValidationError":
            return res.status(404).json({error: error.message, message: `Invalid body`});
        case "DoesNotExistInDb":
            return res.status(404).json({error: error.name, message: error.message});
        case "WrongCredentials":
            return res.status(404).json({error: error.name, message: error.message});
        case "WrongFileFormat":
            return res.status(404).json({error: error.name, message: error.message});
        case "KeyNotProvided":
            return res.status(404).json({error: error.name, message: error.message});
        default:
            return res.status(404).json("An error has occured");
     }
}

const createError = (req, issue, context) => {
    context = context.charAt(0).toUpperCase() + context.slice(1);
    const error = new Error()
    switch (issue) {
        case errors.ErrorNotExist:
            error.name = "DoesNotExistInDb";
            error.message = `${context} with id={${req.params.id}} does not exsist`;
            break;
        case errors.ErrorWrongCredentials:
            error.name = "WrongCredentials";
            error.message = `Invalid credentials provided`;
            break;
        case errors.ErrorWrongFileFormat:
            error.name = "WrongFileFormat";
            error.message = `Supported file formats are : .png .jpg .jpeg .pdf`;
            break;
        case errors.ErrorWrongFileFormat:
            error.name = "WrongFileFormat";
            error.message = `Supported file formats are : .png .jpg .jpeg .pdf`;
            break;
        case errors.ErrorUndefinedKey:
            error.name = "KeyNotProvided";
            error.message = context == contexts.remark &&  `StudentId must be provided`;
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