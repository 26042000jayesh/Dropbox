const express = require('express');
const middlewares = require('./config/middlewares')
const app = express();

app.use('/', (req, res) => {
    res.status(200).json({
        status_code: 200,
        message: "Server is up and running 🚀"
    });
});


app.use(middlewares.globalErrorHandler)
module.exports = app;