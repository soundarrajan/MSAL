module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.app_dir + config.layouts_dir + '/**/*')
            .pipe(gulp.dest(config.dist_dir + config.layouts_dir));
    };
};