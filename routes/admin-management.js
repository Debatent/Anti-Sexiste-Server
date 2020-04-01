// Express
const express = require('express');
const router = express.Router();

// Middlewares
const {wrapAsync} = require('./middlewares/async');
const {hardAdmin} = require('./middlewares/admin');

// Model
const User = require('../models/User');

/* Restricted admin area */
router.use('/admins', wrapAsync(hardAdmin));

router.get('/admins', async function(req, res, next) {
    User.find({isAdmin:true})
        .select({pseudo:1})
        .exec()
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})})
});
/*ADD an admin*/
router.put('/admins',async function(req,res,next){
    const userExist = await User.findOne({pseudo:req.body.pseudo});
    if (!userExist) return res.status(400).send('User doesn\'t exists');
    
    User.findOneAndUpdate({pseudo:req.body.pseudo},{isAdmin: true})
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})})
});

/*DELETE an admin*/
router.delete('/admins/:idUser/',async function(req,res,next){
    const userExist = await User.findById(req.params.idUser);
    if (!userExist) return res.status(400).send('User doesn\'t exists');
    
    User.findByIdAndUpdate(req.params.idUser,{isAdmin: false})
        .then(data => res.status(200).json(data))
        .catch(err => {res.status(400).json({message: err})})
});

module.exports = router;