'use strict';

module.exports = function (app, config) {
    var fs = require('fs'),
        express = require('express'),
        bodyParser = require('body-parser'),
    // passport = require('passport'),
        identity = require('../utilities/identity'),
    // path = require('path'),
        morgan = require('morgan'),
        stream = fs.createWriteStream(config.server.LOGFILE, 'utf8'),
        loggerOptions = {stream: stream};
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(morgan('short', loggerOptions));
    // app.use(passport.initialize());
    // app.use(express.static(path.join(config.server.ROOT_PATH, config.server.STATIC_FOLDER)));
    app.use(identity.initialize());
};