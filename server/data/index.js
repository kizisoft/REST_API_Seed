'use strict';

module.exports = function (config) {
    var loader = require('../utilities/loader'),
        mongoose = require('mongoose'),
        db;

    // Initialize database
    mongoose.connect(config.server.DB_CONNECTION);
    db = mongoose.connection;

    db.once('open', function (err) {
        if (err) {
            console.log(config.data.ERROR_DB_OPEN + err);
            return;
        }

        console.log(config.data.SUCCESS_DB_OPEN)
    });

    db.on('error', function (err) {
        console.log(config.data.ERROR_DB + err);
    });

    // Load all models
    require('./models')(loader);

    // Return 'Unity of Work' of all repositories
    return require('./repository')(loader);
};