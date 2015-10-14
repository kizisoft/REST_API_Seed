'use strict';

module.exports = function (config, data) {
    var identity = require('../utilities/identity'),
        GoogleStrategy = require('../utilities/identity/strategies/GoogleStrategy'),
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
        data.userLogins.getBy({providerId: userGoogle.providerId})
            .then(function (userLogin) {
                userLogin = userLogin[0];
                if (userLogin) {
                    done(null, userLogin.user);
                } else {
                    done({
                        message: 'Authorization Error',
                        errors: ['User "' + userGoogle.name.givenName + ' ' + userGoogle.name.familyName + '" is not registered locally!']
                    }, null);
                }
            })
            .catch(function (err) {
                done(err, null);
            })
    }));

    identity.use(new BasicStrategy({}, function (username, password, done) {
        var errors = [];
        if (!username) {
            errors.push('Username is required!');
        }
        if (!password) {
            errors.push('Password is required!');
        }
        if (errors.length === 0) {
            data.users.getBy({username: username})
                .then(function (userDb) {
                    userDb = userDb[0];
                    if (userDb && userDb.authenticate(password)) {
                        done(null, userDb);
                    } else {
                        done({
                            message: 'Authorization Error',
                            errors: ['Wrong username or password!']
                        }, null);
                    }
                })
                .catch(function (err) {
                    done(err, null);
                });
        } else {
            done({
                message: 'Authorization Error',
                errors: errors
            }, null);
        }
    }));
};