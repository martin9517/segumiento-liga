'use strict';

const express = require('express');
const Model   = require('../models/fecha');
const Temporada   = require('../models/temporada');
const router  = express.Router();

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

        Temporada.findById(request.body.temporada)
        .populate('liga', 'nombre')
        .populate('fechas')
        .exec((error, temporada)  => {
            if (error) {
                return response.status(500).json({
                    code: '500',
                    message: "Ha ocurrido un error",
                    stacktrace: error
                });
            }
            temporada.fechas.push(item)
            temporada.save();
            
            return response.status(201).json(temporada);
        });

    });
});

router.get('/:id/partidos', (request, response) => {
    Model.findById(request.params.id)
    .populate({
        path: 'partidos',
        populate:{
            path: 'local visitante',
            populate: 'jugadores'
        }
    })
    .exec((error, item) => {
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

router.get('/:id', (request, response) => {
    Model.findById(request.params.id, (error, item) => {
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

router.get('/', (request, response) => {
    Model.find({}, (error, items) => {
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