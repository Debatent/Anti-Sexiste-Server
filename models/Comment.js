const mongoose = require('mongoose');


/** Sub Object Comment **/

const commentSchema =  new mongoose.Schema({

    message: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    type: {
        type: String,
        required: true,
        max:255,
    },
    reaction:{
        type: Number,
        required: true,
        default: 0,
        min: 0,
    }
}, {timestamps:true});


module.exports = mongoose.model('Comment', commentSchema);