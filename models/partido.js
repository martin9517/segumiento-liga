'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const schema = new Schema({
    fechaPartido: {
        type: Date,
        required: false
    },
    hora: {
        type: String,
        required: false
    },
    local: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    },
    visitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    },
    descripcion: {
        type: String,
        required: false
    },
    detalles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartidoDetalle'
    }],
    resultado:{
        local: Number,
        visitante: Number
    },
    estado: { /* 1- Por jugar , 2- Finalizado ,  3-Suspendido , 4- Postergado*/
        type: Number,
        required: false,
        default: 1
    },
}, { timestamps: true});

module.exports = mongoose.model('Partido', schema);