'use strict';

function GoogleStrategy(options, authenticate) {
    if (!options) {
        throw new Error('Google strategy requires options!');
    }
    if (typeof authenticate !== 'function') {
        throw new Error('Google strategy requires authenticate function as second parameter!');
    }
    this._name = 'google';
    this._clientID = options.CLIENT_ID;
    this._clientSecret = options.CLIENT_SECRET;
    this._authenticate = authenticate;
    return this;
}

GoogleStrategy.prototype.authenticate = function (req, done) {
    var self = this,
        google = require('googleapis'),
        plus = google.plus('v1'),
        OAuth2 = google.auth.OAuth2,
        oauth2Client = new OAuth2(this._clientID, this._clientSecret);
    oauth2Client.setCredentials({access_token: req.body.accessToken || ''});
    plus.people.get({userId: 'me', auth: oauth2Client}, function (err, userGoogle) {
        if (err) {
            done({message: 'Authentication Error', errors: [err.message]}, null);
        } else {
            self._authenticate({
                id: userGoogle.id,
                gender: userGoogle.gender,
                firstName: userGoogle.name.givenName,
                lastName: userGoogle.name.familyName,
                image: {url: userGoogle.image.url, isDefault: userGoogle.image.isDefault},
                url: userGoogle.url,
                email: userGoogle.emails[0] || ''
            }, done);
        }
    });
};

module.exports = GoogleStrategy;