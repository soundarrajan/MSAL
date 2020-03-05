
module.exports = function (gulp, config) {
    return function () {
      /*  gulp.watch([
            config.app_dir + '/!**!/!*',
            '!' + config.app_dir + '/templates.js',
            '!' + config.app_dir + '/assets/!**!/!*'
        ],
            { interval: 1500 },
            ['reload-dev']);*/

        // Watch template changes
        gulp.watch([config.app_dir + '/**/*',
            '!' + config.app_dir + '/templates.js',
            '!' + config.app_dir + '/assets/**/*'])
            .on('change', gulp.series('reload-dev'));
    };
};