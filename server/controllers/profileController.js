'use strict';

module.exports = function (config, data) {
    var identity = require('../utilities/identity'),
        encryption = require('../utilities/encryption'),
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

    function setLocalPassword(req, res, next) {
        var salt = encryption.generateSalt();
        data.users.update(req.user._id, {
            salt: salt,
            hashPass: encryption.generateHashedPassword(salt, req.body.newPassword)
        }).then(function (userDb) {
            res.status(201).json({
                id: userDb.id,
                username: userDb.username,
                firstName: userDb.firstName,
                lastName: userDb.lastName,
                image: userDb.image,
                email: userDb.email,
                roles: userDb.roles,
                isLocalUser: userDb.hashPass && userDb.salt,
                token: userDb.token,
                expireDate: userDb.expireDate
            });
        }).catch(function (err) {
            next(err);
        });
    }

    function changeLocalPassword(req, res, next) {
        var hashedPassword = encryption.generateHashedPassword(req.user.salt, req.body.password);
        if (hashedPassword !== req.user.hashPass) {
            return next(new throwMy.BadRequest({errors: ['Old password is not correct!']}))
        }
        setLocalPassword(req, res, next);
    }

    return {
        getLogins: getLogins,
        addLogin: addLogin,
        deleteLogin: deleteLogin,
        setLocalPassword: setLocalPassword,
        changeLocalPassword: changeLocalPassword
    };
};