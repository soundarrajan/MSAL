var less = require('gulp-less'),
    concat = require('gulp-concat');

module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.styles)
            .pipe(concat('app.less'))
            .pipe(less())
            .pipe(gulp.dest(config.dist_dir));
    };
};