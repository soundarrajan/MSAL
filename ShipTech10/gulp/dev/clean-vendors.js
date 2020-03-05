var del = require('del');

module.exports = function (config) {
    return function () {
        return del([config.app_dir + config.vendors_dir]);
    };
};