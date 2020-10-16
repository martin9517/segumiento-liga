'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    icono: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Imagen'
    },
    abreviacion: {
        type: String,
        required: false
    },
    colorPrimario: {
        type: String,
        required: false
    },
    colorSecundario: {
        type: String,
        required: false
    },
    clubes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }],
}, { timestamps: true});

module.exports = mongoose.model('Liga', schema);