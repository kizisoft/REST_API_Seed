'use strict';

var http = require('http');
http.IncomingMessage.prototype.isAuthenticated = function () {
    if (!this._identity) {
        throw new Error('Identity must be initialized!');
    }
    this._identity._deserialize();
};