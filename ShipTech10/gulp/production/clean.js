var del = require('del');

module.exports = function (config) {
    return function () {
        return del([config.dist_dir + '/**/*']);
    };
};