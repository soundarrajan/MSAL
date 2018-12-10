var del = require('del');

module.exports = function (config) {
    return function () {
        return del.sync([config.dist_dir + '/**/*']);
    };
};