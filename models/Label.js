const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        max:255,
    },
    name: {
        type: [String],
        required: true,
        unique: true,
        max:255,
    },
});

module.exports = mongoose.model('Label', labelSchema);
