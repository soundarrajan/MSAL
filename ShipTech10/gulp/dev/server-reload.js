var browserSync = require('browser-sync');

module.exports = function () {
    return browserSync.reload;
};