var express = require('express');
var router = express.Router();

// Import routes
const apiRouter = require('./api/public');
const webRouter = require('./web/public');

/** MIDDLEWARE **/

/* Authentication */

/** Routes repartition **/

router.use('/api', apiRouter);
router.use('/', webRouter);

module.exports = router;
