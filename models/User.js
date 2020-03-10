const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        max:255,
    },
    email: {
        type: String,
        required: true,
        max:255,
    },
    password: {
        type: String,
        required: true,
        min:6,
    },
    postReaction: {
        type: [Schema.Types.ObjectId],

    },
    answerReaction: {
        type: [Schema.Types.ObjectId],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
});