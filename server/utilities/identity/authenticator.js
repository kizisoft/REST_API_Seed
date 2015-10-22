'use strict';

// extend standard http
require('./http/request');

function Authenticator() {
    this._strategies = {};
    return this;
}

Authenticator.prototype.use = function use(strategy) {
    this._strategies[strategy._name] = strategy;
};

Authenticator.prototype.deserializeUser = function (deserialize) {
    if (typeof deserialize !== 'function') {
        throw new Error('"deserializeUser" requires a function as parameter.')
    }
    return this._deserialize = deserialize;
};

Authenticator.prototype.authenticate = function authenticate(strategyName, done) {
    if (!this._strategies[strategyName]) {
        throw new Error('Unknown authentication strategy "' + strategyName + '"');
    }
    this._strategies[strategyName].authenticate(this._req, done);
};

Authenticator.prototype.initialize = function initialize() {
    var self = this;
    return function (req, res, next) {
        var authorization = req.header('authorization'),
            token = authorization ? authorization.slice(7) : req.query.authorization_token;
        self._req = req;
        req._identity = self;
        if (token) {
            self._deserialize(token, function (err, user) {
                if (!err && user) {
                    req.user = user;
                }
                next();
            });
        } else {
            next();
        }
    }
};

module.exports = Authenticator;