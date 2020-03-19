const mongoose = require('mongoose');
const Post = require('./Post');
const Comment = require('./Comment');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        min:1,
        max:32,
    },
    email: {
        type: String,
        required: true,
        min:6,
        max:64,
    },
    password: {
        type: String,
        required: true,
        min:6,
        max:64,
    },
    postReaction: {
        type: [Post.schema.ObjectId],
        required: true,
        default: [],
    },
    commentReaction: {
        type: [Comment.schema.ObjectId],
        required: true,
        default: [],
    },
    postReported: {
        type: [Post.schema.ObjectId],
        required: true,
        default: [],
    },
    commentReported: {
        type: [Comment.schema.ObjectId],
        required: true,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
});

module.exports = mongoose.model('User', userSchema);