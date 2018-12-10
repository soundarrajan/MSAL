module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.translations)
            .pipe(gulp.dest(config.dist_dir + '/translations/'));
    };
};