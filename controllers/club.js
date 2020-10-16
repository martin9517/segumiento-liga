'use strict';

const express = require('express');
const Model   = require('../models/club');
const Jugador   = require('../models/jugador');
const router  = express.Router();
const ObjectId = require('mongoose').Types.ObjectId; 

router.post('/', (request, response) => {
    let item = new Model(request.body);
    item.save((error, item) => {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        return response.status(201).json(item);
    });
});

router.post('/importJugadores', (request, response) => {
    let jugadores = request.body.jugadores;

    Jugador.insertMany(jugadores, function (err, docs) {
        if (err){ 
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        } else {    
            Model.findById(request.body.club)
            .populate('jugadores')
            .exec((error, item) => {
                if (error) {
                    return response.status(500).json({
                        code: '500',
                        message: "Ha ocurrido un error",
                        stacktrace: error
                    });
                }
                docs.forEach(element => {
                    item.jugadores.push(element);
                });

                item.save();
        
                return response.status(200).json(item);
            });
        }
    });
});

router.get('/findByLiga/:liga', (request, response) => {
    Model.find({'liga': new ObjectId(request.params.liga)})
    .populate('escudo', 'filename url')
    .exec((error, items) => {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        return response.status(200).json(items);
    });
});

router.get('/', (request, response) => {
    Model.find({})
    .populate('liga', 'nombre')
    .populate('cancha', 'nombre')
    .populate('escudo', 'filename url')
    .populate('jugadores')
    .exec((error, items) => {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        return response.status(200).json(items);
    });
});

router.put('/:id', (request, response) => {
    let item = new Model(request.body);
    Model.findOneAndUpdate({ _id: request.params.id }, item, { new: true }, (error, item) => {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        return response.status(200).json(item);
    });
});

router.delete('/:id', (request, response) => {
    Model.findById(request.params.id, function (error, item) {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        item.remove((error, item) => {
            if (error) {
                return response.status(500).json({
                    code: '500',
                    message: "Ha ocurrido un error",
                    stacktrace: error
                });
            }

            return response.status(204).json({
                code: '204',
                message: "Se ha eliminado con éxito"
            });
        });
    });
});

module.exports = router;