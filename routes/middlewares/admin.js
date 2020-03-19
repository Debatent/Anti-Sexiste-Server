// Dependencies
const jwt = require('jsonwebtoken');

// Models
const User = require('../../models/User');

/** ADMIN AUTHENTICATION **/

/* Logged in as an admin or nothing */
const hardAdmin = async function (req, res, next) {
    // Does the token exist?
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    // Valid token ?
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
    }
    catch (err) {
        res.status(400).send('Invalid Token');
    }

    // isAdmin ?
    const user = await User.findById(req.user._id)
        .select({isAdmin:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});
    if (user && user.isAdmin) {
        next();
    }
    else {
        res.status(403).send('Access Denied');
    }
};


/* Get admin & log information */
const softAdmin = async function (req, res, next) {
    // Default
    req.admin = false;
    req.user = null;

    // Does the token exist?
    const token = req.header('auth-token');
    if (token) {
        // Valid token ?
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
        }
        catch (err) { /*already set in default*/}

        // isUser?
        if (req.user) {
            const user = await User.findById(req.user._id)
                .select({isAdmin: 1})
                .exec()
                .catch(err => {
                    res.status(400).json({message: err})
                });

            // isAdmin?
            if (user) {
                req.admin = user.isAdmin;
            }
        }
    }
    next();
};


module.exports.hardAdmin = hardAdmin;
module.exports.softAdmin = softAdmin;
