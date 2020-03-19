const mongoose = require('mongoose');


/** Sub Object Comment **/

const commentSchema =  new mongoose.Schema({

    message: {
        type: String,
        required: true,
        min:10,
        max:512,
    },
    author: {
        type: String,
        min:1,
        max:32,
    },
    type: {
        type: String,
        required: true,
        min:1,
        max:32,
    },
    reaction:{
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    report:{
        type: Number,
        required:true,
        default: 0,
        min: 0,
    },
}, {timestamps:true});


module.exports = mongoose.model('Comment', commentSchema);