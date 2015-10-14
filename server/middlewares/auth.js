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

    function authenticateGoogle(req, res, next) {
        var accessToken = JSON.tryParse(req.query.accessToken);
        if (!accessToken || !accessToken.access_token) {
            return next(new throwMy.Unauthorized({errors: ['Google access token is missing or with wrong format!']}));
        }

        var google = require('googleapis'),
            credentials = config.passport.google,
            plus = google.plus('v1'),
            OAuth2 = google.auth.OAuth2,
            oauth2Client = new OAuth2(credentials.CLIENT_ID, credentials.CLIENT_SECRET);

        oauth2Client.setCredentials({access_token: accessToken.access_token});
        plus.people.get({userId: 'me', auth: oauth2Client}, function (err, response) {
            if (err) {
                return next(new throwMy.Unauthorized({
                    errors: ['Google authorization failed!'],
                    debugError: {message: err.message, name: 'GoogleError', stack: err.stack}
                }));
            }

            req.user = response;
            next();
        });
    }

    function authenticate(req, res, next) {
        identity.authenticate(req.params.provider, function (err, data) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    }

    return {
        isAuthenticated: isAuthenticated,
        isInRole: isInRole,
        authenticate: authenticate
    }
};