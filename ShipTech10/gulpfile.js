var gulp = require('gulp'),
    config = require('./config.js');

gulp.task('clean-vendors-dev', require('./gulp/dev/clean-vendors')(config));
gulp.task('templates-dev', require('./gulp/dev/template-cache')(gulp, config));
gulp.task('copy-vendors-dev', require('./gulp/dev/copy-vendors')(gulp, config));
gulp.task('server-start-dev', require('./gulp/dev/server-start')(config));
gulp.task('server-reload-dev', require('./gulp/dev/server-reload')());

gulp.task('clean', require('./gulp/production/clean')(config));
gulp.task('html', require('./gulp/production/html')(gulp, config));
gulp.task('copy-assets', require('./gulp/production/copy-assets')(gulp, config));
gulp.task('copy-images', require('./gulp/production/copy-images')(gulp, config));
gulp.task('copy-layouts', require('./gulp/production/copy-layouts')(gulp, config));
gulp.task('copy-mockups', require('./gulp/production/copy-mockups')(gulp, config));
gulp.task('copy-config', require('./gulp/production/copy-config')(gulp, config));
gulp.task('copy-translations', require('./gulp/production/copy-translations')(gulp, config));
gulp.task('watch', require('./gulp/production/watch')(gulp, config));
gulp.task('server-start', require('./gulp/production/server-start')(config));
gulp.task('server-reload', require('./gulp/production/server-reload')());


/**
 * Helper function to pretty-log activity.
 */
function glog(msg, sep) {

    sep = sep || '=';

    var separator = Array(70).join(sep);

    console.log(separator);
    console.log(msg);
    console.log(separator);
}





/**
 * Setup the application:
 *   - copy vendor scripts in app folder
 *
 * This only needs to run when external dependencies are updated.
 */
gulp.task('setup', gulp.series([
    // glog('Setting up files...'),
    'clean-vendors-dev',
    'copy-vendors-dev'
]));


/**
 * Build for development:
 *   - compile Angular templates
 *
 * Run this whenever the app source code changes, i.e.
 * on saving your work.
 * Runs automagically if serving files from /app with "serve-dev".
 */
gulp.task('build-dev', gulp.series(
    // glog('Development build...'),
    'templates-dev'
));

/**
 * Build for production:
 *   - perform a DEVELOPMENT build to process relevant files
 *   - process and copy files from /app to /dist
 * NOTE: This is an incremental build, based on the dev build.
 * TODO: This is still work in progress.
 */
gulp.task('build', gulp.series(
    // glog('Production build...'),
    'build-dev',
    'clean',
    'html',
    'copy-assets',
    'copy-images',
    'copy-layouts',
    'copy-mockups',
    'copy-translations',
    'copy-config'
));

/**
 * Initialize environment:
 *   - run setup
 *   - perform builds (dev and production)
 *
 * Runs automagically after npm install.
 */
gulp.task('initialize', gulp.series(
    // glog('Initializing environment...'),
    'setup',
    'build',
    // glog('Done.'),
    // glog('Run "gulp serve-dev" to start developing.'),
    )
);





/**
 * Reload previously started development server. This is
 * invoked automatically by browsersync.
 */
gulp.task('reload-dev', gulp.series(
    'build-dev',
    'server-reload-dev'
    )
);

gulp.task('watch-dev', require('./gulp/dev/watch')(gulp, config));


/**
 * Serve files from the app directory:
 *   - perform a development build
 *   - watch app dir for changes
 *   - start development server
 */
gulp.task('serve-dev', gulp.series(
    'build-dev',
    gulp.parallel('watch-dev', 'server-start-dev')
    )
);

gulp.task('default', gulp.series(
    'build',
    'server-reload-dev'
    )
);
/**
 * Serve files from production directory:
 *   - perform a production build
 *   - watch /dist directory for changes
 *   - start "production" test server
 */
gulp.task('serve', gulp.series(
    'build',
    gulp.parallel('watch', 'server-start')
    )
);


/**
 * Reload previously started development server. This is
 * invoked automatically by browsersync.
 */
gulp.task('reload', gulp.series(
    'build',
    'server-reload'
    )
);

