'use strict';

const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    auth = require('./controllers/auth');

module.exports = app => {
    router.use('/auth/login', auth.login);
    router.use('/checkToken', auth.checkToken);
    router.use('/public' , require('./controllers/public'))

    auth.authenticate();
    router.use(passport.authenticate('jwt', { session: false }));

    router.use('/uploads', require('./controllers/upload'));
    router.use('/usuarios', require('./controllers/usuario'));
    router.use('/jugadores', require('./controllers/jugador'));
    router.use('/clubes', require('./controllers/club'));
    router.use('/canchas', require('./controllers/cancha'));
    router.use('/ligas', require('./controllers/liga'));
    router.use('/temporadas', require('./controllers/temporada'));
    router.use('/fechas', require('./controllers/fecha'));
    router.use('/partidos', require('./controllers/partido'));
    router.use('/noticias', require('./controllers/noticia'));
    
    app.use('/api/v1/', router);
};