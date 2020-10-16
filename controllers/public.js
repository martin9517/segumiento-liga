'use strict';

const express = require('express');
const Noticia   = require('../models/noticia');
const Club   = require('../models/club');
const Liga   = require('../models/liga');
const Temporada = require('../models/temporada');
const ObjectId = require('mongoose').Types.ObjectId; 
const router  = express.Router();


router.get('/ligas', (request, response) => {
    Liga.find({})
    .populate('icono')
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


router.get('/partidos/:liga', (request, response) => {
    Temporada.find({'liga': new ObjectId(request.params.liga)})

    .populate({
        path: 'fechas',
        populate:{
            path: 'partidos',
            populate: {
                path:'local visitante',
                populate: 'escudo'
            }
        }
    })
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

router.get('/temporadas/:liga', (request, response) => {
    Temporada.find({'liga': new ObjectId(request.params.liga)})
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

router.get('/posiciones/:temporada/:liga', (request, response) => {
    Temporada.findById(request.params.temporada)
    .populate({
        path: 'fechas',
        populate:{
            path: 'partidos',
            populate: {
                path:'local visitante',
                populate: 'escudo'
            }
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

        Club.find({'liga': new ObjectId(request.params.liga)})
        .populate('escudo')
        .exec(function(error,objects){

            if (error) {
                return response.status(500).json({
                    code: '500',
                    message: "Ha ocurrido un error",
                    stacktrace: error
                });
            }   
            var clubes = [];
            objects.forEach(club => {
                clubes.push({
                    club: club,
                    partidosJugados: 0,
                    partidosGanados: 0,
                    partidosPerdidos: 0,
                    partidosEmpatados: 0,
                    puntos: 0,
                    golesFavor: 0,
                    golesEnContra: 0                    
                })
            });

            item.fechas.forEach(fecha => {
                if(fecha.tipo == 1){
                    fecha.partidos.forEach(partido => {
                        if(partido.estado == 2){
                            clubes.forEach(club => {
                                if(club.club._id.equals(partido.local._id)){//el club jugó de local en la fecha                                    
                                    club.partidosJugados++;
                                    club.golesFavor += partido.resultado.local;
                                    club.golesEnContra += partido.resultado.visitante;
                                    if(partido.resultado.local > partido.resultado.visitante){//Ganó
                                        club.partidosGanados++;
                                        club.puntos += 3;
                                    }
                                    if(partido.resultado.local == partido.resultado.visitante){//Empató
                                        club.partidosEmpatados++;
                                        club.puntos += 1;
                                    }
                                    if(partido.resultado.local < partido.resultado.visitante){//perdio
                                        club.partidosPerdidos++;
                                    }
                                }
                                if(club.club._id.equals(partido.visitante._id)){//el club jugó de visitante en la fecha
                                    club.partidosJugados++;
                                    club.golesFavor += partido.resultado.visitante;
                                    club.golesEnContra += partido.resultado.local;
                                    if(partido.resultado.visitante > partido.resultado.local){//Ganó
                                        club.partidosGanados++;
                                        club.puntos += 3;
                                    }
                                    if(partido.resultado.visitante == partido.resultado.local){//Empató
                                        club.partidosEmpatados++;
                                        club.puntos += 1;
                                    }
                                    if(partido.resultado.visitante < partido.resultado.local){//perdio
                                        club.partidosPerdidos++;
                                    }
                                }
                            });
                        }
                        
                    });
                }                
            });

            clubes.sort(function (a, b) {
                
                if (a.puntos < b.puntos) {
                  return -1;
                }
                // a must be equal to b
                return 0;
            });
    
            return response.status(200).json(clubes);
        })        
    });
});

router.get('/noticias/:liga', (request, response) => {
    Noticia.find({'liga': new ObjectId(request.params.liga)})
    .sort('-createdAt')
    .populate('imagenes')
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

module.exports = router;