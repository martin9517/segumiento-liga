'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    nombre: {
        type: String,
        required: false
    },
    anio: {
        type: Number,
        required: false
    },
    liga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liga'
    },
    fechas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fecha'
    }]
}, { timestamps: true});

module.exports = mongoose.model('Temporada', schema);