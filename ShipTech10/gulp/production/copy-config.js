module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.config)
            .pipe(gulp.dest(config.dist_dir + '/config/'));
    };
};