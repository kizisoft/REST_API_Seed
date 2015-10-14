'use strict';

function error(err) {
    console.log('[' + Date.now() + '] ' + err);
}

module.exports = {
    error: error
};