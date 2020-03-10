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



/** Object Post **/

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max:255,
    },
    message: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    location: {
        type: String,
        required: true,
        max:255
    },

    reaction:{
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },

    comments: {
        type: [commentSchema],
        default: []
    }
}, {timestamps:true});



module.exports = mongoose.model('Post', postSchema);
module.exports = mongoose.model('Comment', commentSchema);