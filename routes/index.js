var express = require('express');
var router = express.Router();



/* GET home page */
router.get('/', function(req, res, next) {
  res.status(200).render('index', { title: 'Express' });
});



/* GET all posts */
router.get('/posts', function(req, res, next) {
  res.redirect(308,'/');
});

/* GET a specific post */
router.get('/posts/:idPost', function(req, res, next) {
  res.status(200).send('GET request to this post');
});

/* Post a post */
router.post('/posts', function(req, res, next) {
  res.status(201).send('POST request for this post');
});

/* Delete a post */
router.delete('/posts/:idPost', function(req, res, next) {
  res.status(200).send('Delete request for this post');
});



/* Post an answer */
router.post('/posts/:idPost', function(req, res, next) {
  res.status(201).send('POST request for this answer');
});

/* Delete an answer */
router.delete('/posts/:idPost/:idAnswer', function(req, res, next) {
  res.status(200).send('Delete request for this answer');
});



/* Post a reaction for a post*/
router.post('/posts/:idPost/:reaction', function(req, res, next) {
  res.status(201).send('POST request for this post reaction');
});

/* Delete a reaction for a post */
router.delete('/posts/:idPost/:reaction', function(req, res, next) {
  res.status(200).send('Delete request for this post reaction');
});



/* Post a reaction for an answer */
router.post('/posts/:idPost/:answer/:reaction', function(req, res, next) {
  res.status(201).send('POST request for this answer reaction');
});

/* Delete a reaction for an answer */
router.delete('/posts/:idPost/:answer/:reaction', function(req, res, next) {
  res.status(200).send('Delete request for this answer reaction');
});



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
