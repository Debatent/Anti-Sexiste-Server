// Express
const express = require('express');
const router = express.Router();

// Middlewares
const {wrapAsync} = require('./middlewares/async');
const {hardAdmin} = require('./middlewares/admin');

// Model
const Label = require('../models/Label');

// Validation
const {labelValidation} = require('../validation/label');

/** LABEL (CRUD) **/

/* READ all labels */
router.get('/:of', function(req, res, next) {
    // Checking if it's a valid type of label
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of label');
    }

    // Getting the labels
    Label.find({of:req.params.of})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})});
});

/* Restricted admin area */
router.use('/:of', wrapAsync(hardAdmin));

/* CREATE a label */
router.post('/:of', async function(req, res, next) {
    // Checking if it's a valid type of label
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of label');
    }

    // Checking with DB for unique fields
    const labelExist = await Label.findOne({of: req.params.of, name: req.body.name});
    if (labelExist) return res.status(400).send('Label already exists');

    // Validating body fields
    try{
        await labelValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Creating the label
    const label = new Label({
        of: req.params.of,
        name: req.body.name,
    });

    // Saving
    label.save()
        .then(data => {res.status(201).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* UPDATE a label */
router.put('/:of/:label', async function(req, res, next) {
    // Checking if it's a valid type of label
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of label');
    }

    // Checking with DB for unique fields
    const labelExist = await Label.findOne({of: req.params.of, name: req.body.name});
    if (labelExist) return res.status(400).send('Label already exists');

    // Validating body fields
    try{
        await labelValidation(req.body);
    }
    catch (err) {
        return res.status(400).json({message: err});
    }

    // Updating the label
    Label.findOneAndUpdate({of:req.params.of, name:req.params.label},{
        name: req.body.name,
    })
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

/* DELETE a label */
router.delete('/:of/:label', function(req, res, next) {
    // Checking if it's a valid type of label
    if (req.params.of !== 'posts' &&  req.params.of !== 'comments') {
        return res.status(400).send('Only posts and comments are valid type of label');
    }

    // Deleting the label
    Label.findOneAndDelete({of:req.params.of, name:req.params.label})
        .then(data => {res.status(200).json(data)})
        .catch(err => {res.status(400).json({message: err})});
});

module.exports = router;
