const model = require('../models/usuario');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require("../config/index");

module.exports = {
    authenticate: function () {
        passport.use(new JWTstrategy({
            secretOrKey: config.jwt.secretKey,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        }, (jwt_payload, done) => {
            model.findById(jwt_payload._id, (error, user) => {
                if (error) return done(error, false);

                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });

        }));
    },
    login: function (req, res, next) {
        model.findOne({ email: req.body.email }).populate('').exec((error, user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'El usuario no existe'
                });
            }

            if (req.body.password !== user.password) {
                return res.status(401).json({
                    message: 'Credenciales incorrectas'
                });
            }

            let token = jwt.sign({
                _id: user._id,
                user: {
                    email: user.email
                },
            }, config.jwt.secretKey);

            return res.status(200).json({
                token: token,
                user: {
                    id: user._id,
                    email: user.email
                }
            });
        })
    },

    checkToken: function (req, res, next) {
        var token = req.body.token;
        jwt.verify(token, config.jwt.secretKey, function (err, decode) {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: 'El token no es valido'
                });
            }
            
            model.findById(decode._id, (error, user) => {
                if (error) {
                    return res.status(200).json({
                        status: false
                    });
                }

                if (user) {
                    return res.status(200).json({
                        status: true,
                        user: user
                    });
                } else {
                    return res.status(200).json({
                        status: false
                    });
                }
            });

        })
    }
};