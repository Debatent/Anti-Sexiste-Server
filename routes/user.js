// Express
const express = require('express');
const router = express.Router();

// Dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Model
const User = require('../models/User');

// Validation
const {registerValidation, loginValidation, emailValidation} = require('../validation/user');


/** USER (CR--) **/

/* CREATE an user (REGISTER) */
router.post('/register', async function(req, res, next) {
    // Validating body fields
    try{
        await registerValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking with DB for unique fields
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    const pseudoExist = await User.findOne({pseudo: req.body.pseudo});
    if (pseudoExist) return res.status(400).send('Pseudo already exists');

    // Hashing password
    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating the user
    const user = new User({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hashedPassword,
    });

    // Saving
    user.save()
        .then(data => {res.status(201).json({
            _id: data._id,
            pseudo: data.pseudo,
            email: data.email,
        })})
        .catch(err => {res.status(400).json({message: err})});
});

/* READ an user (LOGIN) */
router.post('/login', async function(req, res, next) {
    // Validating body fields
    try{
        await loginValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking with DB for unique fields
    var user = null;
    try {
        await emailValidation({user: req.body.user});
        // This is an email
        user = await User.findOne({email: req.body.user});
        if (!user) return res.status(400).send('Email or pseudo incorrect');
    }
    catch (err) {
        user = await User.findOne({pseudo: req.body.user});
        if (!user) return res.status(400).send('Email or pseudo incorrect');
    }

    // Checking password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Incorrect password');

    // Assigning a token
    const token = jwt.sign({_id: user.id},process.env.TOKEN_SECRET);
    res.header('auth-token', token).status(200).json({
        _id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        isAdmin: user.isAdmin,
        postReaction: user.postReaction,
        commentReaction: user.commentReaction,
    });
});


module.exports = router;