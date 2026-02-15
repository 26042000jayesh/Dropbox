const express = require('express');
const cors = require('cors');
const path = require('path');
const middlewares = require('./config/middlewares')
const authRoutes = require('./routes/authroutes')
const jwtService = require('./services/jwtservice')
const fileRoutes = require('./routes/fileroutes')
const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Serve frontend static files (before auth middleware)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.use('/dropbox/auth/api/v1', authRoutes)
app.use(jwtService.verifyJWT)
app.use('/dropbox/file/api/v1', fileRoutes);

// serve index.html for all non-API routes
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(middlewares.notFoundHandler)
app.use(middlewares.globalErrorHandler)
module.exports = app;
