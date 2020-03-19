// Express
const express = require('express');
const router = express.Router();

// Routes
const postRouter = require('./post');
const labelRouter = require('./label');
const reportRouter = require('./report');
const userRouter = require('./user');


/** HOME **/

/* GET API Documentation */
router.get('/', function(req, res, next) {
    return res.status(200).json({
        readme: "This is a documentation for the anti-sexiste API",
        routes: [
            {
                type:'GET',
                path:'/posts',
                response:'List of posts without their comments',
            },
            {
                type:'POST',
                path:'/posts',
                request:'New post',
            },
            {
                type:'GET',
                path:'/posts/:_id',
                response:'The corresponding post with its comments',
            },
            {
                type:'PATCH',
                path:'/posts/:_id',
                request:'Updated post',
                restriction: 'logged in author',
            },
            {
                type:'DELETE',
                path:'/posts/:_id',
                request:'Deleted post',
                restriction: 'logged in author || admin',
            },
            {
                type:'POST',
                path:'/posts/:_id/like',
                restriction: 'logged in',
            },
            {
                type:'PATCH',
                path:'/posts/:_id/unlike',
                restriction: 'logged in',
            },
            {
                type:'POST',
                path:'/posts/:_id/report',
                restriction: 'logged in',
            },



            {
                type:'POST',
                path:'/posts/:_id',
                request:'New comment',
            },
            {
                type:'PATCH',
                path:'/posts/:_id/:_id',
                request:'Updated comment',
                restriction: 'logged in author',
            },
            {
                type:'DELETE',
                path:'/posts/:_id/:_id',
                request:'Deleted comment',
                restriction: 'logged in author || admin',
            },
            {
                type:'POST',
                path:'/posts/:_id/:_id/like',
                restriction: 'logged in',
            },
            {
                type:'PATCH',
                path:'/posts/:_id/:_id/unlike',
                restriction: 'logged in',
            },
            {
                type:'POST',
                path:'/posts/:_id/:_id/report',
                restriction: 'logged in',
            },



            {
                type:'POST',
                path:'/labels/:of',
                request:'New label',
                restriction: 'admin',
            },
            {
                type:'GET',
                path:'/labels/:of',
                response:'List of labels :of',
            },
            {
                type:'PATCH',
                path:'/labels/:of/:name',
                request:'Updated label',
                restriction: 'admin',
            },
            {
                type:'DELETE',
                path:'/labels/:of/:name',
                request:'Deleted label',
                restriction: 'admin',
            },



            {
                type:'GET',
                path:'/reports/:of',
                response:'List of reports :of',
                restriction: 'admin',
            },
            {
                type:'DELETE',
                path:'/reports/:of/:_id',
                request:'Deleted report content',
                restriction: 'admin',
            },



            {
                type:'POST',
                path:'/register',
                request:'New user',
            },
            {
                type:'POST',
                path:'/login',
                request: "User's credentials",
                response:'Logged in',
            },
        ]
    });
});


/** ROUTES **/

router.use('/posts', postRouter); // will also handle redirect to commentRouter
router.use('/labels', labelRouter);
router.use('/reports', reportRouter);
router.use('/', userRouter);


module.exports = router;
