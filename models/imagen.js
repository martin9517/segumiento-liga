'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    url: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Imagen', schema);