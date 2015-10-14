'use strict';

module.exports = function (config, data) {
    var util = require('util'),
        request = require('request'),
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
                    res.status(200).json({
                        id: userDb.id,
                        username: userDb.username,
                        token: userDb.token,
                        expireDate: userDb.expireDate
                    });
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

    function postLogin(req, res, next) {
        if (req.user) {
            data.users.update(req.user._id, {token: encryption.generateToken(), expireDate: (new Date()).addDays(1)})
                .then(function (userDb) {
                    res.status(200).json({
                        id: userDb._id,
                        username: userDb.username,
                        token: userDb.token,
                        expireDate: userDb.expireDate
                    });
                })
                .catch(function (err) {
                    next(err);
                });
        }
    }

    function getCallbackGoogle(req, res, next) {
        data.users.add({
            username: req.query.username,
            firstName: req.user.name.givenName,
            lastName: req.user.name.familyName,
            token: encryption.generateToken(),
            expireDate: (new Date()).addDays(1)
        }).then(function (userDb) {
            res.status(200).json({
                id: userDb.id,
                username: userDb.username,
                token: userDb.token,
                expireDate: userDb.expireDate
            });
        }).catch(function (err) {
            if (err.customError === true) {
                next(new throwMy[err.name](err));
            } else {
                next(err);
            }
        });
    }

    function test(req, res) {
        res.status(200).json({error: false, test: 'Test passed!'});
    }

    return {
        postRegister: postRegister,
        postLogin: postLogin,
        getCallbackGoogle: getCallbackGoogle,
        test: test
    };
};