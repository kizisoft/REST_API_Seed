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
    this._authenticate(req.query.username, req.query.password, function (err, user) {
        if (err) {
            done(err, null);
        } else {
            req.user = user;
            done(null, user);
        }
    });
};

module.exports = BasicStrategy;