const mongoose = require('mongoose');
const Comment = require('./Comment');

/** Object Post **/

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min:1,
        max:64,
    },
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
    location: {
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
    comments: {
        type: [Comment.schema],
        default: [],
        required: true,
    }
}, {timestamps:true});


module.exports = mongoose.model('Post', postSchema);