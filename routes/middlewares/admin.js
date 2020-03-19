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

        // isAdmin ?
        const user = await User.findById(req.user._id)
            .select({isAdmin:1})
            .exec()
            .catch(err => {res.status(400).json({message: err})});
        if (user.isAdmin) {
            req.user = verified;
            next();
        }
        else {
            res.status(403).send('Access Denied');
        }
    }
    catch (err) {
        res.status(400).send('Invalid Token');
    }
};


/* Get admin & log information */
const softAdmin = async function (req, res, next) {
    // Does the token exist?
    const token = req.header('auth-token');
    if (!token) {
        req.user = null;
    }

    // Valid token ?
    else {
        try {
            // User
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;

            // Admin
            const user = await User.findById(req.user._id)
                .select({isAdmin:1})
                .exec()
                .catch(err => {res.status(400).json({message: err})});

            req.admin = user.isAdmin;
        }
        catch (err) {
            req.user = null;
        }
    }
    next();
};


module.exports.hardAdmin = hardAdmin();
module.exports.softAdmin = softAdmin();
