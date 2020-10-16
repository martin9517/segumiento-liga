'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    tipo:{/* 1-liga , 2- eliminatoria */
        type: Number,
        required: true
    },
    numero: {
        type: Number,
        required: false
    },
    fase: {
        type: String,
        required: false
    },
    partidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partido'
    }],
}, { timestamps: true});

module.exports = mongoose.model('Fecha', schema);