'use strict';

function FacebookStrategy(options, authenticate) {
    if (!options) {
        throw new Error('Facebook strategy requires options!');
    }
    if (typeof authenticate !== 'function') {
        throw new Error('Facebook strategy requires authenticate function as second parameter!');
    }
    this._name = 'facebook';
    this._clientID = options.CLIENT_ID;
    this._clientSecret = options.CLIENT_SECRET;
    this._authenticate = authenticate;
    return this;
}

FacebookStrategy.prototype.authenticate = function (req, done) {
    var self = this,
        fb = require('fb');
    fb.api('me', {
        fields: 'id,first_name,last_name,email,gender,link,picture',
        access_token: req.body.accessToken || ''
    }, function (response) {
        if (response && response.error) {
            done({message: 'Authentication Error', errors: [response.error.message]}, null);
        } else {
            var socialUser = {
                id: response.id,
                gender: response.gender,
                firstName: response.first_name,
                lastName: response.last_name,
                image: {url: response.picture.data.url, isDefault: response.picture.data.is_silhouette},
                url: response.link,
                email: response.email || ''
            };
            self._authenticate(socialUser, function (err, userDb) {
                if (!err && !userDb) {
                    return done(null, false, socialUser);
                }
                done(err, userDb);
            });
        }
    });
};

module.exports = FacebookStrategy;