'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: false
    },
    capacidad: {
        type: Number,
        required: false
    },
    localidad: {
        type: String,
        required: false
    }
}, { timestamps: true});

module.exports = mongoose.model('Cancha', schema);