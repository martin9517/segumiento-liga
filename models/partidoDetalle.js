'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    accion: {/* 1 - Gol , 2 - Amarilla , 3 - Roja  */
        type: Number,
        required: true
    },
    minuto: {
        type: Number,
        required: false
    },
    jugador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jugador'
    },
    tipo: {/* 1- Local , 2- Visitante */
        type: Number,
        required: false
    }
}, { timestamps: true});

module.exports = mongoose.model('PartidoDetalle', schema);