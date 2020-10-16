'use strict';

const express = require('express');
const router  = express.Router();
const Model   = require('../models/imagen');
const multer  = require('multer');
const crypto  = require('crypto');
const path    = require('path');
const fs      = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: './front/uploads',
        filename: function (req, file, callback) {
            crypto.pseudoRandomBytes(16, function(err, raw) {
                if (err) return callback(err);
                
                callback(null, raw.toString('hex') + path.extname(file.originalname));
            });
        }
    })
});

router.get('/:filename', (request, response) => {
    Model.findOne({ filename: request.params.filename }, (error, item) => {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        return response.status(200).sendFile(item.url);
    })
});

router.post('/', upload.array('files', 12), (request, response) => {
    if(!request.files || request.files.length == 0) {
        return response.status(400).json({
            code: '400',
            message: 'No se paso ningun archivo',
            stacktrace: null
        });
    }

    let files = request.files.map(function(item) {
        return {
            url: request.protocol + '://' + request.get('host') + '/uploads/' + item.filename,
            filename: item.filename,
            mimetype: item.mimetype,
            size: item.size,
            originalname: item.originalname
        }
    });

    Model.insertMany(files, function(error, docs) {
        if(error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error",
                stacktrace: error
            });
        }

        return response.status(200).json(docs);
    })
})

router.get('/delete/:filename', (request, response) => {
    Model.findOne({ filename: request.params.filename }, (error, item) => {
        if (error) {
            return response.status(500).json({
                code: '500',
                message: "Ha ocurrido un error al eliminar",
                stacktrace: error
            });
        }
        var dir  = __dirname;

        fs.unlink('./front/uploads/' + item.filename, (err) => {
            if (err) {
                return response.status(500).json({
                    code: '500',
                    message: "Ha ocurrido un error",
                    stacktrace: err
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

        
    })
});

module.exports = router;