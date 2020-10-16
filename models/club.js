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
    localidad: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: false
    },
    abreviacion: {
        type: String,
        required: false
    },
    cancha: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cancha'
    },
    liga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liga'
    },
    jugadores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jugador'
    }],
    escudo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Imagen'
    },
}, { timestamps: true});

module.exports = mongoose.model('Club', schema);