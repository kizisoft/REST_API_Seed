'use strict';

module.exports = function (config) {
    var identity = require('../utilities/identity'),
        throwMy = require('../utilities/throwMy');

    function isAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
            res.status(403)
                .json({success: false, message: config.auth.ERROR_AUTHENTICATION_FAILED});
        } else {
            next();
        }
    }

    function isInRole(role) {
        return function (req, res, next) {
            if (req.isAuthenticated() && req.user.roles.indexOf(role) > -1) {
                next();
            }
            res.status(403)
                .json({success: false, message: config.auth.ERROR_UNAUTHORIZED_ACCESS});
        }
    }

    return {
        isAuthenticated: isAuthenticated,
        isInRole: isInRole
    }
};