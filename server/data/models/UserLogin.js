'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function () {
    var userLoginSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,//'{PATH} is required',
            unique: true
        },
        providerId: {type: String, required: '{PATH} is required', unique: true},
        provider: {type: String, required: '{PATH} is required'}
    });

    mongoose.model('UserLogin', userLoginSchema);
};