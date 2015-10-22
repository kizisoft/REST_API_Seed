'use strict';

function BasicStrategy(options, authenticate) {
    if (typeof authenticate !== 'function') {
        throw new Error('Basic strategy requires authenticate function as second parameter!');
    }
    this._name = 'basic';
    this._authenticate = authenticate;
    return this;
}

BasicStrategy.prototype.authenticate = function (req, done) {
    this._authenticate(req.body.username || '', req.body.password || '', done);
};

module.exports = BasicStrategy;