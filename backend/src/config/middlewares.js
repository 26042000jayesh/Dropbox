function globalErrorHandler(err, req, res, next) {
    try {
        console.error("Unhandled Error:", err?.stack || err);
    } catch (loggingError) {
        console.error("Error while logging error:", loggingError);
    }

    return res.status(500).json({
        success: false,
        status_code: 500,
        message: "Something went wrong, please try again",
    });
}

module.exports = {
    globalErrorHandler
}