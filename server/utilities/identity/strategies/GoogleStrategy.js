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
    this._callbackURL = options.callbackURL;
    this._authenticate = authenticate;
    return this;
}

GoogleStrategy.prototype.authenticate = function (req, done) {
    var self = this,
        accessToken = JSON.tryParse(req.query.accessToken),
        google = require('googleapis'),
        plus = google.plus('v1'),
        OAuth2 = google.auth.OAuth2,
        oauth2Client = new OAuth2(this._clientID, this._clientSecret);
    accessToken = accessToken || {};
    oauth2Client.setCredentials({access_token: accessToken.access_token});
    plus.people.get({userId: 'me', auth: oauth2Client}, function (err, userGoogle) {
        if (err) {
            done(err, null);
        } else {
            self._authenticate(userGoogle, function (err, user) {
                if (err) {
                    done(err, null);
                } else {
                    req.user = user;
                    done(null, user);
                }
            });
        }
    });
};

module.exports = GoogleStrategy;