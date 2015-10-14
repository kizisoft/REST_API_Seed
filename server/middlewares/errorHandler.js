'use strict';

module.exports = function (app, logger) {
    if (!logger) {
        logger = require('../utilities/logger');
    }

    app.use(function (err, req, res, next) {
        var env = app.get('env');
        logger.error(err);
        if (env !== 'development' && env !== 'test') {
            delete err.stack;
            delete err.debugError;
        }

        res.status(err.statusCode || 500).json(err);
    });
};