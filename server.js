'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const compression = require('compression');
const passport = require('passport');
const cors = require('cors');
const config = require("./config/index");

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(helmet());
app.use(methodOverride());
app.use(cors());

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());


app.use(express.static(__dirname + '/front'));

app.all("/", function(request, response, next) {
    response.sendFile(path.join(__dirname+'/front/public/index.html'));
});

app.all("/admin/", function(request, response, next) {
    response.sendFile(path.join(__dirname+'/front/admin/index.html'));
});

/* Socket io */
io.on('connection', function(socket){
    config.Socket = socket;
});

http.listen(config.port, () => {
    mongoose.connection.on('error', error => {
        console.log('Error trying to connect with mongo: ', error);
        process.exit(1);
    });

    mongoose.connection.on('open', error => {
        if (error) {
            console.log('Error with mongo: ', error);
            process.exit(1);
        }

        console.log(`Node server is up and running on port ${config.port}`);
        require('./routes')(app);
    });

    mongoose.connect(config.database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
});