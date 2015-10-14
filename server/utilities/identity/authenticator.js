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
        throw new Error('"deserializeUser" requires function for parameter.')
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
        self._req = req;
        req._identity = self;
        next();
    }
};


module.exports = Authenticator;