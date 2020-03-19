// Dependencies
const jwt = require('jsonwebtoken');

/** AUTHENTICATION **/

/* Logged in or nothing */
const hardAuth = function (req, res, next) {
    // Does the token exist?
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    // Valid token ?
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(400).send('Invalid Token');
    }
};


/* Get log information */
const softAuth = function (req, res, next) {
    // Does the token exist?
    const token = req.header('auth-token');
    if (!token) {
        req.user = null;
    }

    // Valid token ?
    else {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
        }
        catch (err) {
            req.user = null;
        }
    }
    next();
};


module.exports.hardAuth = hardAuth;
module.exports.softAuth = softAuth;