const mongoose = require('mongoose');
const Comment = require('./Comment');

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
        type: [Comment.schema],
        default: [],
        required: true,
    }
}, {timestamps:true});


module.exports = mongoose.model('Post', postSchema);