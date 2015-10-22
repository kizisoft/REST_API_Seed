'use strict';

module.exports = function (config) {
    var throwMy = require('../utilities/throwMy');

    function isAuthorized(req, res, next) {
        if (!req.isAuthorized()) {
            next(new throwMy.Unauthorized({errors: [config.auth.ERROR_AUTHORIZATION_FAILED]}));
        } else {
            next();
        }
    }

    function isInRole(role) {
        return function (req, res, next) {
            if (req.isAuthorized() && req.user.roles.indexOf(role) > -1) {
                next();
            } else {
                next(new throwMy.Forbidden({errors: [config.auth.ERROR_UNAUTHORIZED_ACCESS]}));
            }
        }
    }

    return {
        isAuthorized: isAuthorized,
        isInRole: isInRole
    }
};