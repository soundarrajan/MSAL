module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.vendors)
            .pipe(gulp.dest(config.app_dir + config.vendors_dir));
    };
};