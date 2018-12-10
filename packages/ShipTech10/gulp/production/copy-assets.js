module.exports = function (gulp, config) {
    return function () {
        return gulp.src([config.app_dir + config.assets_dir + '/**/*.{jpg,png,woff,ttf,woff2}'])
            .pipe(gulp.dest(config.dist_dir + config.assets_dir));
    };
};