'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    titulo: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: false
    },
    liga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liga'
    },
    imagenes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Imagen'
    }],
    
}, { timestamps: true});

module.exports = mongoose.model('Noticia', schema);