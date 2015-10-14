'use strict';

var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

module.exports = function () {
    var userSchema = new mongoose.Schema({
        username: {type: String, required: '{PATH} is required', minlength: 3, maxlength: 30, unique: true},
        firstName: {type: String, required: '{PATH} is required', minlength: 2, maxlength: 30},
        lastName: {type: String, required: '{PATH} is required', minlength: 2, maxlength: 30},
        salt: String,
        hashPass: String,
        token: String,
        expireDate: Date,
        roles: [String]
    });

    userSchema.methods.authenticate = function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashPass
    };

    userSchema.methods.isInRole = function (role) {
        return this.roles.indexOf(role) > -1;
    };

    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function (err, collection) {
        if (err) {
            console.log('Cannot find users: ' + err);
            return;
        }

        if (collection.length === 0) {
            var salt = encryption.generateSalt(),
                hashedPwd = encryption.generateHashedPassword(salt, 'KiziSoft');
            User.create({
                username: 'kizisoft',
                firstName: 'Ivan',
                lastName: 'Kizirian',
                salt: salt,
                hashPass: hashedPwd,
                roles: ['admin']
            });
            console.log('Users added to database...');
        }
    });
};