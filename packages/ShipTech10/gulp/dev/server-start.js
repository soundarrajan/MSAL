var browserSync = require('browser-sync');

module.exports = function (config) {
    return function () {
        browserSync.init(config.browserSync_dev);
    };
};