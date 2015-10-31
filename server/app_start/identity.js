'use strict';

module.exports = function (config, data) {
    var identity = require('../utilities/identity'),
        GoogleStrategy = require('../utilities/identity/strategies/GoogleStrategy'),
        FacebookStrategy = require('../utilities/identity/strategies/FacebookStrategy'),
        BasicStrategy = require('../utilities/identity/strategies/BasicStrategy');

    identity.deserializeUser(function (token, done) {
        data.users.getBy({token: token})
            .then(function (userDb) {
                userDb = userDb[0];
                if (userDb) {
                    done(null, userDb);
                } else {
                    done(null, false);
                }
            })
            .catch(function (err) {
                done(err, null);
            });
    });

    identity.use(new GoogleStrategy({
        clientID: config.identity.google.CLIENT_ID,
        clientSecret: config.identity.google.CLIENT_SECRET
    }, function (userGoogle, done) {
        data.userLogins.getBy({providerId: userGoogle.id})
            .then(function (userLogin) {
                userLogin = userLogin[0];
                if (userLogin) {
                    done(null, userLogin.user);
                } else {
                    done(null, false);
                }
            }).catch(function (err) {
                done(err, null);
            })
    }));

    identity.use(new FacebookStrategy({
        clientID: config.identity.facebook.CLIENT_ID,
        clientSecret: config.identity.facebook.CLIENT_SECRET
    }, function (userFb, done) {
        data.userLogins.getBy({providerId: userFb.id})
            .then(function (userLogin) {
                userLogin = userLogin[0];
                if (userLogin) {
                    done(null, userLogin.user);
                } else {
                    done(null, false);
                }
            }).catch(function (err) {
                done(err, null);
            })
    }));

    identity.use(new BasicStrategy({}, function (username, password, done) {
        data.users.getBy({username: username})
            .then(function (userDb) {
                userDb = userDb[0];
                if (userDb && userDb.authenticate(password)) {
                    done(null, userDb);
                } else {
                    done(null, false);
                }
            }).catch(function (err) {
                done(err, null);
            });
    }));
};