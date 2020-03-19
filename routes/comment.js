// Express
const express = require('express');
const router = express.Router();

// Middlewares
const wrap = require('async-middleware').wrap
const {hardAuth, softAuth} = require('./middlewares/authentication');
const {softAdmin} = require('./middlewares/admin');

// Model
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Label = require('../models/Label');
const User = require('../models/User');

// Validation
const commentValidation = require('../validation/comment');


/** COMMENT (CRUD) **/

/* CREATE a comment */
router.post('/:idPost', softAuth, async function(req, res, next) {
    // Looking for the author
    if (req.user) {
        const user = await User.findById(req.user._id)
            .select({pseudo:1})
            .exec()
            .catch(err => {res.status(400).json({message: err})});
        const author = req.user.pseudo;
    }
    else {
        const author = null;
    }

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Validating body fields
    try{
        await commentValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking with DB for existing types
    const labelExist = await Label.findOne({of: 'comments', name: req.body.type});
    if (!labelExist) return res.status(400).send("Type doesn't exist");

    // Creating the comment
    const comment = new Comment({
        message: req.body.message,
        type: req.body.type,
        author: author,
    });

    // Adding the comment to the post
    post.comments.push(comment);

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a comment */
router.patch('/:idPost/:idComment', hardAuth, async function(req, res, next) {
    // Looking for the author
    const user = await User.findById(req.user._id)
        .select({pseudo:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking if the user is the author
    if (user.pseudo !== post.comments.id(req.params.idComment).author) {
        res.status(403).send('Access Denied');
    }

    // Validating body fields
    try{
        await commentValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking with DB for existing locations
    const labelExist = await Label.findOne({of: 'comments', name: req.body.type});
    if (!labelExist) return res.status(400).send("Type doesn't exist");

    // Updating the comment
    post.comments.id(req.params.idComment).message = req.body.message;
    post.comments.id(req.params.idComment).type = req.body.type;

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a comment */
router.delete('/:idPost/:idComment', hardAuth);
router.delete('/:idPost/:idComment', wrap(softAdmin));
router.delete('/:idPost/:idComment', async function(req, res, next) {
    // Looking for the author
    const user = await User.findById(req.user._id)
        .select({pseudo:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking if the user is the author or the admin
    if (user.pseudo !== post.comments.id(req.params.idComment).author || ! req.admin) {
        res.status(403).send('Access Denied');
    }

    // Removing the comment
    post.comments.id(req.params.idComment).remove();

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


/** REACTION (C--D) **/

/* CREATE a reaction for a comment */
router.post('/:idPost/:idComment/like', hardAuth, async function(req, res, next) {
    // Looking for the user
    const user = await User.findById(req.user._id)
        .select({commentReaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking with DB for unique like
    if (user.commentReaction.find(req.params.idComment)) {
        res.status(403).send('Access Denied');
    }

    // Incrementing the reaction
    post.comments.id(req.params.idComment).reaction += 1 ;
    user.commentReaction.push(req.params.idComment);

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a reaction from a comment */
router.delete('/:idPost/:idComment/unlike', hardAuth, async function(req, res, next) {
    // Looking for the user
    const user = await User.findById(req.user._id)
        .select({commentReaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking with DB for unique like
    if (!user.commentReaction.find(req.params.idComment)) {
        res.status(403).send('Access Denied');
    }

    // Incrementing the reaction
    post.comments.id(req.params.idComment).reaction -= 1 ;
    user.commentReaction.remove(req.params.idComment);

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


/** REPORT (C---) **/

/* CREATE a report for a comment */
router.post('/:idPost/:idComment/report', hardAuth, async function(req, res, next) {
    // Looking for the user
    const user = await User.findById(req.user._id)
        .select({commentReported:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking with DB for unique report
    if (user.commentReported.find(req.params.idComment)) {
        res.status(403).send('Access Denied');
    }

    // Incrementing the reaction
    post.comments.id(req.params.idComment).report += 1 ;
    user.commentReported.push(req.params.idComment);

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


module.exports = router;
