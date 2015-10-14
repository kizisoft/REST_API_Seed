'use strict';

var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (config, data) {

    function authenticateBasic(username, password, done) {
        process.nextTick(function () {
            data.users.getBy({username: username})
                .then(function (userDb) {
                    userDb = userDb[0];
                    if (userDb && userDb.authenticate(password)) {
                        done(null, userDb);
                    }
                    else {
                        done(null, false);
                    }
                })
                .catch(function (err) {
                    throw cfg.db.ERROR_DB + err;
                });
        });
    }

    function authenticateGoogle(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }

    passport.use(new BasicStrategy({}, authenticateBasic));

    passport.use(new GoogleStrategy({
        clientID: config.passport.google.CLIENT_ID,
        clientSecret: config.passport.google.CLIENT_SECRET,
        callbackURL: config.passport.google.REDIRECT_URI
    }, authenticateGoogle));
};