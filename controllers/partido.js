'use strict';

const express = require('express');
const Model = require('../models/partido');
const Fecha = require('../models/fecha');
const PartidoDetalle = require('../models/partidoDetalle');
const router = express.Router();

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

        Fecha.findById(request.body.fecha)
            .populate({
                path: 'partidos',
                populate: { path: 'local visitante' }
            })
            .exec((error, fecha) => {
                if (error) {
                    return response.status(500).json({
                        code: '500',
                        message: "Ha ocurrido un error",
                        stacktrace: error
                    });
                }

                item.populate('local visitante', function (err, i) {
                    fecha.partidos.push(i)
                    fecha.save();

                    return response.status(201).json(fecha);
                })
            });
    });
});

router.get('/getDetalles/:id', (request, response) => {
    Model.findById(request.params.id)
        .populate({
            path: 'detalles',
            populate: 'jugador'
        })
        .exec((error, item) => {
            if (error) {
                return response.status(500).json({
                    code: '500',
                    message: "Ha ocurrido un error",
                    stacktrace: error
                });
            }

            return response.status(200).json(item.detalles);
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
    let detalles = [];
    request.body.detalles.forEach(element => {
        if (!element._id) {
            detalles.push(element);
        }
    });

    Model.findById(request.params.id)
        .populate({
            path: 'local visitante',
            populate: 'jugadores'
        })
        .populate({
            path: 'detalles',
            populate: 'jugador'
        })
        .exec((error, partido) => {
            if (error) {
                return response.status(500).json({
                    code: '500',
                    message: "Ha ocurrido un error",
                    stacktrace: error
                });
            }

            PartidoDetalle.insertMany(detalles, function (err, docs) {
                if (err) {
                    return response.status(500).json({
                        code: '500',
                        message: "Ha ocurrido un error",
                        stacktrace: error
                    });
                } else {
                    if (docs && docs.length > 0) {
                        docs.forEach(element => {
                            partido.detalles.push(element)
                        });
                    }
                    var resultado = {
                        local: 0,
                        visitante: 0
                    }
                    partido.detalles.forEach(element => {
                        if (element.accion == 1) {
                            if (element.tipo == 1) {
                                resultado.local++;
                            }
                            if (element.tipo == 2) {
                                resultado.visitante++;
                            }
                        }
                    });
                    partido.estado = item.estado;
                    partido.fechaPartido = item.fechaPartido;
                    partido.hora = item.hora;
                    partido.resultado = resultado;
                    partido.save();

                    return response.status(200).json(partido);
                }
            });
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

router.delete('/removeDetalle/:detalle/:partido', (request, response) => {
    PartidoDetalle.findById(request.params.detalle, function (error, item) {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        Model.findById(request.params.partido, function (error, partido) {
            if(item.accion == 1){
                if(item.tipo == 1){
                    partido.resultado.local--;
                }
                if(item.tipo == 2){
                    partido.resultado.visitante--;
                }
            }

            item.remove((error, i) => {
                if (error) {
                    return response.status(500).json({
                        code: '500',
                        message: "Ha ocurrido un error",
                        stacktrace: error
                    });
                }

                partido.save();
    
                return response.status(204).json({
                    code: '204',
                    message: "Se ha eliminado con éxito"
                });
            });
        });

        
    });
});

module.exports = router;