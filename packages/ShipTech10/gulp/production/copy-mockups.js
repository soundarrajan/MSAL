module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.app_dir + config.mockups_dir + '/**/*')
            .pipe(gulp.dest(config.dist_dir + config.mockups_dir));
    };
};