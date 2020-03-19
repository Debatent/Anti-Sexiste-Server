// Express
const express = require('express');
const router = express.Router();

// Middlewares
const wrap = require('async-middleware').wrap
const {hardAdmin} = require('./middlewares/admin');

// Model
const Post = require('../models/Post');
const Comment = require('../models/Label');

// Validation
const pageValidation = require('../validation/query');


/** REPORT (-R-D) **/

/* Restricted admin area */
router.use('/:of', wrap(hardAdmin));


/* READ all reports */
router.get('/:of', async function(req, res, next) {
    // Validating query fields
    try{
        await pageValidation(req.query);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Checking if it's a valid type of report
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of report');
    }

    // Determining the type of report
    let Content;
    if (request.params.of === 'post') {
        Content = Post;
    }
    else {
        Content = Comment;
    }

    // Getting the list of reported post
    Content.find({report:{$gt:0}})
        .limit(15)
        .skip((req.query.page-1)*15)
        .sort({report: -1})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a report */
router.delete('/:of/:idContent', async function(req, res, next) {
    // Checking if it's a valid type of label
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of report');
    }

    // Determining the type of report
    let Content;
    if (request.params.of === 'post') {
        Content = Post;
    }
    else {
        Content = Comment;
    }

    // Retrieving the content
    const content = await Content.findById(req.params.idContent)
        .select({report:1})
        .exec()
        .catch(err => {res.status(400).json({message: err})});

    // Resetting report counter
    content.report = 0 ;

    // Saving
    content.save()
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

module.exports = router;
