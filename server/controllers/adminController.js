var data,
    CONTROLLER_NAME = 'admin';

module.exports = function (dataIn) {
    data = dataIn.data;
    return {
        moduleName: CONTROLLER_NAME,
        data: {
            getIndex: function (req, res) {
                res.render(CONTROLLER_NAME + '/index');
            }
        }
    }
};