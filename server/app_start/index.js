'use strict';

module.exports = function (app, config) {
    var data = require('../data')(config);
    require('./express')(app, config);
    require('../middlewares/allowCORS')(app);
    require('./routes')(app, config, data);
    require('./identity')(config, data);
    require('../middlewares/errorHandler')(app);
};