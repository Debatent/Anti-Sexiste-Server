var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Post');
const Label = require('../../models/Label');


/** HOME **/

/* GET home page = GET latest posts */
router.get('/', function(req, res, next) {
    Post.find()
        .limit(15)
        .sort({'createdAt': -1})
        .select({comments:0})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});



/** POST (CRUD) **/

/* READ all posts */
router.get('/posts', function(req, res, next) {
    Post.find()
        .sort({'createdAt': -1})
        //.select({comments:0})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* CREATE a post */
router.post('/posts', function(req, res, next) {
    const post = new Post({
       title: req.body.title,
       message: req.body.message,
       location: req.body.location,
    });

    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* READ a specific post */
router.get('/posts/:idPost', function(req, res, next) {
    Post.findById(req.params.idPost)
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a post */
router.patch('/posts/:idPost', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.idPost,{
        title: req.body.title,
        message: req.body.message,
        location: req.body.location,
    })
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a post */
router.delete('/posts/:idPost', function(req, res, next) {
    Post.findByIdAndDelete(req.body.idPost)
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});



/** COMMENT **/

/* CREATE a comment */
router.post('/posts/:idPost', function(req, res, next) {
    // Retrieving the post
    const post = Post.findById(req.params.idPost).select({comments:1}).exec()

    // Creating the comment
    const comment = new Comment({
        message: req.body.message,
        type: req.body.type,
    });

    // Adding the comment to the post
    post.comments.push(comment);

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a comment */
router.patch('/posts/:idPost/:idComment', function(req, res, next) {
    // Retrieving the post
    const post = Post.findById(req.params.idPost).select({comments:1}).exec()

    // Updating the comment
    post.comments.id(req.params.idComment).update({
        message: req.body.message,
        type: req.body.type,
    });

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a comment */
router.delete('/posts/:idPost/:idComment', function(req, res, next) {
    // Retrieving the post
    const post = Post.findById(req.params.idPost).select({comments:1}).exec()

    // Removing the comment
    post.comments.id(req.params.idComment).remove();

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});



/** REACTION **/

/* CREATE a reaction for a post*/
router.post('/posts/:idPost/:reaction', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.idPost,{}, {$inc : {reaction : 1}, timestamp:false})
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a reaction from a post */
router.delete('/posts/:idPost/:reaction', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.idPost,{}, {$inc : {reaction : -1}, timestamp:false})
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});



/* CREATE a reaction for a comment */
router.post('/posts/:idPost/:answer/:reaction', function(req, res, next) {
    // Retrieving the post
    const post = Post.findById(req.params.idPost).select({comments:1}).exec()

    // Updating the comment reaction counter
    post.comments.id(req.params.idComment).update({}, {$inc : {reaction : 1}, timestamp:false});

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a reaction from a comment */
router.delete('/posts/:idPost/:answer/:reaction', function(req, res, next) {
    // Retrieving the post
    const post = Post.findById(req.params.idPost).select({comments:1}).exec()

    // Updating the comment reaction counter
    post.comments.id(req.params.idComment).update({}, {$inc : {reaction : -1}, timestamp:false});

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});



/** LABEL **/

/* CREATE a post label */
router.post('/post/label', function(req, res, next) {
    const label = new Label({
        type: "location",
        name: req.body.name,
    });

    Label.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a post label */
router.put('/posts/label/:label', function(req, res, next) {
    Label.findOneAndUpdate({type:"location" , name:req.params.label},{
        name: req.body.name,
    })
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a post label */
router.delete('/posts/label/:label', function(req, res, next) {
    Label.findOneAndDelete({type:"location" , name:req.params.label})
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});



/* CREATE a comment label */
router.post('/comment/label', function(req, res, next) {
    const label = new Label({
        type: "type",
        name: req.body.name,
    });

    Label.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a comment label */
router.put('/comment/label/:label', function(req, res, next) {
    Label.findOneAndUpdate({type:"type" , name:req.params.label},{
        name: req.body.name,
    })
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a comment label */
router.delete('/comment/label/:label', function(req, res, next) {
    Label.findOneAndDelete({type:"type" , name:req.params.label})
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

module.exports = router;
