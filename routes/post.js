// Express
const express = require('express');
const router = express.Router();

// Middlewares
const wrap = require('async-middleware').wrap
const {hardAuth, softAuth} = require('./middlewares/authentication');
const {softAdmin} = require('./middlewares/admin');

// Routes
const commentRouter = require('./comment');

// Model
const Post = require('../models/Post');
const Label = require('../models/Label');
const User = require('../models/User');

// Validation
const postValidation = require('../validation/post');
const pageValidation = require('../validation/query');


/** POST (CRUD) **/

/* READ all posts */
router.get('/', async function(req, res, next) {
    // Validating query fields
    try{
        await pageValidation(req.query);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Getting the posts
    Post.find()
        .sort({'createdAt': -1})
        .select({comments:0})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* CREATE a post */
router.post('/', softAuth, async function(req, res, next) {
    // Looking for the author
    let author;
    if (req.user) {
        const user = await User.findById(req.user._id)
            .select({pseudo:1})
            .exec()
            .catch(err => {res.status(400).json({message: err})});
        author = user.pseudo;
    }
    else {
        author = null;
    }

    // Validating body fields
    try{
        await postValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking with DB for existing locations
    const labelExist = await Label.findOne({of: 'posts', name: req.body.location});
    if (!labelExist) return res.status(400).send("Location doesn't exist");

    // Creating the post
    const post = new Post({
        title: req.body.title,
        message: req.body.message,
        location: req.body.location,
        author: author,
    });

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* READ a specific post */
router.get('/:idPost', function(req, res, next) {
    Post.findById(req.params.idPost)
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a post */
router.patch('/:idPost', hardAuth, async function(req, res, next) {
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
    if (user.pseudo !== post.author) {
        res.status(403).send('Access Denied');
    }

    // Validating body fields
    try{
        await postValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking with DB for existing locations
    const labelExist = await Label.findOne({of: 'posts', name: req.body.location});
    if (!labelExist) return res.status(400).send("Location doesn't exist");

    // Updating the post
    post.title = req.body.title;
    post.message = req.body.message;
    post.location = req.body.location;

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a post */
router.delete('/:idPost', wrap(softAdmin));
router.delete('/:idPost', hardAuth, async function(req, res, next) {
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
    if (user.pseudo !== post.author || ! req.admin) {
        res.status(403).send('Access Denied');
    }

    // Deleting the post
    Post.findByIdAndDelete(req.params.idPost)
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


/** REACTION (C--D) **/

/* CREATE a reaction for a post*/
router.post('/:idPost/like', hardAuth, async function(req, res, next) {
    // Looking for the user
    const user = await User.findById(req.user._id)
        .select({postReaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({reaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking with DB for unique like
    if (user.postReaction.find(post._id)) {
        res.status(403).send('Access Denied');
    }

    // Incrementing the reaction
    post.reaction += 1 ;
    user.postReaction.push(post._id);

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a reaction from a post */
router.delete('/:idPost/unlike', hardAuth, async function(req, res, next) {
    // Looking for the user
    const user = await User.findById(req.user._id)
        .select({postReaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({reaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking with DB for unique like
    if (!user.postReaction.find(post._id)) {
        res.status(403).send('Access Denied');
    }

    // Incrementing the reaction
    post.reaction -= 1 ;
    user.postReaction.remove(post._id);

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


/** REPORT (C---) **/

/* CREATE a report for a post*/
router.post('/:idPost/report', hardAuth, async function(req, res, next) {
    // Looking for the user
    const user = await User.findById(req.user._id)
        .select({postReported:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({report:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Checking with DB for unique report
    if (user.postReported.find(post._id)) {
        res.status(403).send('Access Denied');
    }

    // Incrementing the reaction
    post.report += 1 ;
    user.postReported.push(post._id);

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


router.use('/', commentRouter);

module.exports = router;
