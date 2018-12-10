var del = require('del');

module.exports = function (config) {
    return function () {
        return del.sync(config.app_dir + config.vendors_dir);
    };
};