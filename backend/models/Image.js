const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

