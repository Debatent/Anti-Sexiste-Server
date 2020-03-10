var express = require('express');
var router = express.Router();



/** MIDDLEWARE **/

/* Authentication */

/** POST **/

/* Delete a post */
router.delete('/posts/:idPost', function(req, res, next) {
    res.status(200).send('Delete request for this post');
});



/** ANSWER **/

/* Delete an answer */
router.delete('/posts/:idPost/:idAnswer', function(req, res, next) {
    res.status(200).send('Delete request for this answer');
});



/** CATEGORY **/

/* Post a post type */
router.post('/post/type', function(req, res, next) {
    res.status(201).send('POST request for post type');
});

/* Put a post type */
router.put('/posts/type/:type', function(req, res, next) {
    res.status(200).send('Put request for post type');
});

/* Delete a post type */
router.delete('/posts/type/:type', function(req, res, next) {
    res.status(200).send('Delete request for post type');
});



/* Post an answer type */
router.post('/answer/type', function(req, res, next) {
    res.status(201).send('POST request for answer type');
});

/* Put an answer type */
router.put('/answer/type/:type', function(req, res, next) {
    res.status(200).send('Put request for answer type');
});

/* Delete an answer type */
router.delete('/answer/type/:type', function(req, res, next) {
    res.status(200).send('Delete request for answer type');
});

module.exports = router;
