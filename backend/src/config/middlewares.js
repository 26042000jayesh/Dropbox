function globalErrorHandler(err, req, res, next) {
    try {
        console.error("Unhandled Error:", err?.stack || err);
    } catch (loggingError) {
        console.error("Error while logging error:", loggingError);
    }
    const status_code = err.statusCode || 500;
    return res.status(status_code).json({
        status_code: status_code,
        message: err.message? err.message : "Something went wrong, please try again",
    });
}

function notFoundHandler(req, res, next) {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

module.exports = {
    globalErrorHandler,
    notFoundHandler
}