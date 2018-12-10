var cache = require('gulp-angular-templatecache');

module.exports = function (gulp, config) {
    return function () {
        return gulp.src(config.templates.source)
            .pipe(cache({module: config.templates.moduleName, 
            			base: config.templates.base}))
            .pipe(gulp.dest(config.templates.dest));
    };
};