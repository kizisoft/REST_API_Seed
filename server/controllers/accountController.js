'use strict';

module.exports = function (config, data) {
    var util = require('util'),
        identity = require('../utilities/identity'),
        encryption = require('../utilities/encryption'),
        throwMy = require('../utilities/throwMy'),
        UserInputModel = require('../viewModels/account/UserInputModel')(config);

    function postRegister(req, res, next) {
        var userInputModel = new UserInputModel(req.body);
        if (userInputModel.isValid()) {
            userInputModel.salt = encryption.generateSalt();
            userInputModel.hashPass = encryption.generateHashedPassword(userInputModel.salt, userInputModel.password);
            userInputModel.token = encryption.generateToken();
            userInputModel.expireDate = (new Date()).addDays(1);
            data.users.add(userInputModel)
                .then(function (userDb) {
                    resultSuccessUser(res, userDb);
                }).catch(function (err) {
                    if (err.customError === true) {
                        next(new throwMy[err.name](err));
                    } else {
                        next(err);
                    }
                });
        } else {
            next(new throwMy.BadRequest({errors: userInputModel.getErrorMessages()}));
        }
    }

    function postRegisterSocial(req, res, next) {
        try {
            identity.authenticate(req.params.provider, function (err, user, socialUser) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    next(new throwMy.BadRequest({errors: ['User "' + user.username + '" already exist! Try to login.']}));
                } else if (socialUser) {
                    socialUser.username = req.body.username;
                    socialUser.token = encryption.generateToken();
                    socialUser.expireDate = (new Date()).addDays(1);
                    data.users.add(socialUser)
                        .then(function (userDb) {
                            var userLogin = {
                                user: userDb,
                                providerId: socialUser.id,
                                provider: req.params.provider
                            };
                            data.userLogins.add(userLogin)
                                .then(function (userLoginDb) {
                                    resultSuccessUser(res, userDb);
                                }).catch(function (err) {
                                    next(err);
                                });
                        }).catch(function (err) {
                            if (err.customError === true) {
                                next(new throwMy[err.name](err));
                            } else {
                                next(err);
                            }
                        });
                } else {
                    next(new throwMy.BadRequest({errors: ['Incorrect username or password!']}));
                }
            });
        } catch (err) {
            next(new throwMy.BadRequest({errors: [err.message]}), null);
        }
    }

    function postLogin(req, res, next) {
        try {
            identity.authenticate(req.params.provider, function (err, user, socialUser) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    data.users.update(user._id, {
                        token: encryption.generateToken(),
                        expireDate: (new Date()).addDays(1)
                    }).then(function (userDb) {
                        resultSuccessUser(res, userDb);
                    }).catch(function (err) {
                        next(err);
                    });
                } else if (socialUser) {
                    res.status(403).json(socialUser);
                } else {
                    next(new throwMy.BadRequest({errors: ['Incorrect username or password!']}));
                }
            });
        } catch (err) {
            next(new throwMy.BadRequest({errors: [err.message]}), null);
        }
    }

    function resultSuccessUser(res, user) {
        res.status(200).json({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
            token: user.token,
            expireDate: user.expireDate
        });
    }

    return {
        postRegister: postRegister,
        postRegisterSocial: postRegisterSocial,
        postLogin: postLogin
    };
};