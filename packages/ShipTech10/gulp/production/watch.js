module.exports = function (gulp, config) {
    return function () {
        gulp.watch(config.dist_dir, ['reload']);
    };
};