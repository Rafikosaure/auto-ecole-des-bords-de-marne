const ErrorNotExist = "notExist";
const ErrorWrongCredentials = "wrongCredentials";
const ErrorWrongFileFormat = "wrongFileFormat"

const errorHandler = (req, res, error, context) => {
    console.log({"Error":
        {
            "name" : error.name,
            "message" : error.message
        }}
    );
    context = context.charAt(0).toUpperCase() + context.slice(1);
    const target = context == "Admin" && req.body.username
                    || (context == "Student" || context == "Instructor") && `${req.body.lastName} ${req.body.firstName}`
    switch (error.name) {
        case "SequelizeUniqueConstraintError":
            return res.status(404).json({error: error.message, message: `${context} ${target} already exists`})
        case "DoesNotExistInDb":
            return res.status(404).json({error: error.name, message: error.message});
        case "WrongCredentials":
            return res.status(404).json({error: error.name, message: error.message});
        case "WrongFileFormat":
            return res.status(404).json({error: error.name, message: error.message});
        default:
            return res.status(404).json("An error has occured")
     }
}

const createError = (req, issue, context) => {
    context = context.charAt(0).toUpperCase() + context.slice(1);
    const error = new Error()
    switch (issue) {
        case ErrorNotExist:
            error.name = "DoesNotExistInDb";
            error.message = `${context} with id={${req.params.id}} does not exsist`;
            break;
        case ErrorWrongCredentials:
            error.name = "WrongCredentials";
            error.message = `Wrong credentials`;
        case ErrorWrongFileFormat:
            error.name = "WrongFileFormat";
            error.message = `Supported file formats are : .png .jpg .jpeg .pdf`;
        default:
            break;
    }
    return error;
}

exports.errorHandler = errorHandler;
exports.createError = createError;
exports.ErrorNotExist = ErrorNotExist;
exports.ErrorWrongCredentials = ErrorWrongCredentials;
exports.ErrorWrongFileFormat = ErrorWrongFileFormat;