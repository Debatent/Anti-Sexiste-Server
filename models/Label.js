const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    of: {
        type: String,
        required: true,
        min:1,
        max:32,
    },
    name: {
        type: String,
        required: true,
        min:1,
        max:32,
    },
});

module.exports = mongoose.model('Label', labelSchema);
