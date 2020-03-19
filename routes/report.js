// Express
const express = require('express');
const router = express.Router();

// Middlewares
const {wrapAsync} = require('./middlewares/async');
const {hardAdmin} = require('./middlewares/admin');

// Model
const Post = require('../models/Post');

// Validation
const {pageValidation} = require('../validation/query');


/** REPORT (-R-D) **/
/** for REPORT (C---) go to post report ou comment report section**/

/* Restricted admin area */
router.use('/:of', wrapAsync(hardAdmin));


/* READ all reports */
router.get('/:of', async function(req, res, next) {
    let commentPerPage = 15;

    // Validating query fields
    try{
        await pageValidation(req.query);
        if (!req.query.page){
            req.query.page = 1;
        }
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking if it's a valid type of report
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of report');
    }

    // Determining the type of report
    if (req.params.of === 'posts') {
        // Getting the list of reported posts
        Post.find({report:{$gt:0}})
            .sort({report: -1})
            .select({comments: 1})
            .skip(commentPerPage*(req.query.page-1))
            .limit(commentPerPage)
            .exec()
            .then(data => res.status(200).json(data))
            .catch(err => {res.status(400).json({message: err})});
    }
    else {
        // Getting the list of comments
        const posts = await Post.find()
            .select({comments: 1})
            .exec()
            .catch(err => {res.status(400).json({message: err})});

        // Getting the list of reported comments
        var reportedComments = [];
        posts.forEach((post) => {
            post.comments.forEach((comment) => {
                if (comment.report > 0) {
                    reportedComments.push({
                        "_id": comment._id,
                        "message": comment.message,
                        "type": comment.type,
                        "author": comment.author,
                        "report": comment.report,
                        "reaction": comment.reaction,
                        "createdAt": comment.createdAt,
                        "updatedAt": comment.updatedAt,
                    });
                }
            });
        });
        reportedComments = reportedComments
            .sort((a,b) => b.report - a.report)
            .slice((req.query.page-1)*commentPerPage,(req.query.page)*commentPerPage);
        return res.status(200).json(reportedComments);
    }
});

/* DELETE a report */
router.delete('/:of/:idContent', async function(req, res, next) {
    // Checking if it's a valid type of label
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of report');
    }

    let post;
    // Determining the type of report
    if (req.params.of === 'posts') {
        // Retrieving the post
        post = await Post.findById(req.params.idContent)
            .select({report:1})
            .exec()
            .catch(err => {res.status(400).json({message: err})});

        // Resetting report counter
        post.report = 0 ;
    }
    else {
        // Getting the list of comments
        posts = await Post.find()
            .select({comments: 1})
            .exec()
            .catch(err => {res.status(400).json({message: err})});

        // Getting the list of reported comments
        var idPost;
        posts.forEach((post) => {
            post.comments.forEach((comment) => {
                if (comment._id == req.params.idContent) {
                    idPost = post._id;
                }
            });
        });


        if (!idPost) {
            return res.status(400).send("idContent invalid");
        }

        // Retrieving the post
        post = await Post.findById(idPost)
            .select({comments:1})
            .exec()
            .catch(err => {res.status(400).json({message: err})});

        // Resetting report counter
        post.comments.id(req.params.idContent).report = 0 ;
    }
    // Saving
    post.save()
        .then(data => {res.status(200).json("Success")})
        .catch(err => {res.status(400).json({message: err})});
});

module.exports = router;
