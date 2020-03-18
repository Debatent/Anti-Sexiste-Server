var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
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
    Post.findByIdAndDelete(req.params.idPost)
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


/* CREATE a reaction for a post*/
router.post('/posts/:idPost/like', async function(req, res, next) {
    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({reaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Incrementing the reaction
    post.reaction += 1 ;

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a reaction from a post */
router.delete('/posts/:idPost/unlike', async function(req, res, next) {
    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({reaction:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Incrementing the reaction
    post.reaction -= 1 ;

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});



/** COMMENT (CRUD) **/

/* CREATE a comment */
router.post('/posts/:idPost', async function(req, res, next) {
    // Retrieving the post
     const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

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
router.patch('/posts/:idPost/:idComment', async function(req, res, next) {
    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Updating the comment
    post.comments.id(req.params.idComment).message = req.body.message;
    post.comments.id(req.params.idComment).type = req.body.type;

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a comment */
router.delete('/posts/:idPost/:idComment', async function(req, res, next) {
    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Removing the comment
    post.comments.id(req.params.idComment).remove();

    // Saving
    post.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


/* CREATE a reaction for a comment */
router.post('/posts/:idPost/:idComment/like', async function(req, res, next) {
    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Incrementing the reaction
    post.comments.id(req.params.idComment).reaction += 1 ;

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a reaction from a comment */
router.delete('/posts/:idPost/:idComment/unlike', async function(req, res, next) {
    // Retrieving the post
    const post = await Post.findById(req.params.idPost)
        .select({comments:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Incrementing the reaction
    post.comments.id(req.params.idComment).reaction -= 1 ;

    // Saving
    post.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});



/** LABEL (CRUD) **/

/* READ all post's labels */
router.get('/labels/posts', function(req, res, next) {
    Label.find({of:"posts"})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* CREATE a post label */
router.post('/labels/posts', function(req, res, next) {
    const label = new Label({
        of: "posts",
        name: req.body.name,
    });

    label.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a post label */
router.put('/labels/posts/:label', function(req, res, next) {
    Label.findOneAndUpdate({of:"posts" , name:req.params.label},{
        name: req.body.name,
    })
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a post label */
router.delete('/labels/posts/:label', function(req, res, next) {
    Label.findOneAndDelete({of:"posts" , name:req.params.label})
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});


/* READ all comments's labels */
router.get('/labels/comments', function(req, res, next) {
    Label.find({of:"comments"})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* CREATE a comment label */
router.post('/labels/comments', function(req, res, next) {
    const label = new Label({
        of: "comments",
        name: req.body.name,
    });

    label.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a comment label */
router.put('/labels/comments/:label', function(req, res, next) {
    Label.findOneAndUpdate({of:"comments" , name:req.params.label},{
        name: req.body.name,
    })
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a comment label */
router.delete('/labels/comments/:label', function(req, res, next) {
    Label.findOneAndDelete({of:"comments" , name:req.params.label})
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

module.exports = router;
