'use strict';

var mongoose = require('mongoose'),
    UserLogin = mongoose.model('UserLogin');

module.exports = {
    moduleName: 'userLogins',
    data: {
        add: function add(userLogin) {
            return new Promise(function (resolve, reject) {
                UserLogin.create({
                    user: userLogin.user,
                    providerId: userLogin.providerId,
                    provider: userLogin.provider
                }, function (err, userDb) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(userDb);
                    }
                });
            });
        },
        del: function del(option) {
            return new Promise(function (resolve, reject) {
                UserLogin.remove(option, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        },
        getBy: function getBy(option) {
            return new Promise(function (resolve, reject) {
                UserLogin.find(option)
                    .populate('user')
                    .exec(function (err, userLoginsDb) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(userLoginsDb);
                        }
                    });
            });
        }
    }
};