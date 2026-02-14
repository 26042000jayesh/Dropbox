const jwt = require('jsonwebtoken');
const { auth_config } = require('../config/env')

function signJwt(data, exipiry_time = 60 * 60 * 24) {
    try {
        const token = jwt.sign(data, auth_config.jwt_secret, { expiresIn: exipiry_time });
        return token;
    } catch {
        return null;
    }
}

function verifyJWT(req, res, next) {
    try {
        if (req.url == '/dropbox/') {
            return res.status(200).json({
                status: 200
            });
        }
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, auth_config.jwt_secret);
        req.user = user;
        next();
    } catch {
        return res.status(401).json({
            status_code: 401,
            message: "Unauthorized!"
        });
    }
}

module.exports ={
    signJwt,
    verifyJWT
}