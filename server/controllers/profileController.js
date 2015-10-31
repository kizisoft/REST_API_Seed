'use strict';

module.exports = function (config, data) {
    var identity = require('../utilities/identity'),
        throwMy = require('../utilities/throwMy');

    function getLogins(req, res, next) {
        data.userLogins.getBy({user: req.user})
            .then(function (userLoginsDb) {
                var userLogins = [];
                for (var i = 0, length = userLoginsDb.length; i < length; i += 1) {
                    userLogins.push({id: userLoginsDb[i]._id, provider: userLoginsDb[i].provider})
                }
                res.status(200).json(userLogins);
            }).catch(function (err) {
                next(err);
            })
    }

    function addLogin(req, res, next) {
        try {
            identity.authenticate(req.params.provider, function (err, user, socialUser) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    var provider = req.params.provider[0].toUpperCase() + req.params.provider.slice(1);
                    return next(new throwMy.BadRequest({errors: ['User with this' + provider + ' account already exists!']}));
                }
                data.userLogins.add({user: req.user, providerId: socialUser.id, provider: req.params.provider})
                    .then(function (socialUserDb) {
                        res.status(201).json(socialUserDb);
                    }).catch(function (err) {
                        next(err);
                    });
            });
        } catch (err) {
            next(new throwMy.BadRequest({errors: [err.message]}), null);
        }
    }

    function deleteLogin(req, res, next) {
        data.userLogins.del({_id: req.params.id})
            .then(function (socialUserDb) {
                res.status(201).json(socialUserDb);
            }).catch(function (err) {
                next(err);
            });
    }

    return {
        getLogins: getLogins,
        addLogin: addLogin,
        deleteLogin: deleteLogin
    };
};