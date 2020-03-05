module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.vendors, { allowEmpty: true })
            .pipe(gulp.dest(config.app_dir + config.vendors_dir));
    };
};