const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {    
    const statusCode = res.statusCode ? res.statusCode : 500;
    var statusText = "";
    switch (statusCode) {   
        case constants.VALIDATION_ERROR:
            statusText = "Validation Error";
            break; 
        case constants.NOT_FOUND:
            statusText = "Not Found";
            break;
        case constants.UNAUTHORIZED:
            statusText = "Unauthorized";
            break;
        case constants.FORBIDDEN:
            statusText = "Forbidden";
            break;
        case constants.SERVER_ERROR:
            statusText = "Server Error";
            break;
        default:
            statusText = "Error";
            break;
    }
    res.json({
        title: statusText,
        message: err.message,
        stackTrace: err.stack
    });
};

module.exports = errorHandler;