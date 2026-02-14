const express = require('express');
const middlewares = require('./config/middlewares')
const authRoutes = require('./routes/authroutes')

const app = express();

app.use(express.json({ limit: '10kb' }));

// app.use('/', (req, res) => {
//     res.status(200).json({
//         status_code: 200,
//         message: "Server is up and running"
//     });
// });

app.use('/dropbox/auth/api/v1', authRoutes)
app.use(middlewares.notFoundHandler)
app.use(middlewares.globalErrorHandler)
module.exports = app;