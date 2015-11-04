'use strict';

module.exports = function (config) {
    var BaseViewModel = require('../BaseViewModel')(config);

    function UserViewModel(user) {
        user = user || {};
        BaseViewModel.call(this, UserViewModel.schema);
        this.id = user.id;
        this.username = user.username || '';
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.image = {url: user.image.url || '', isDefault: user.image.isDefault};
        this.email = user.email || '';
        this.roles = user.roles || [];
        this.isLocalUser = !!(user.hashPass && user.salt);
        this.token = user.token;
        this.expireDate = user.expireDate;
        return this;
    }

    UserViewModel.prototype = BaseViewModel.prototype;
    UserViewModel.constructor = UserViewModel;

    UserViewModel.schema = {};

    return UserViewModel;
};