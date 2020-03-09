var useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    css = require('gulp-clean-css'),
    cssrewrite = require('gulp-rewrite-css'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    lazypipe = require('lazypipe'),
    slash = require('gulp-slash'),
    babel = require('gulp-babel'),
    terser = require('gulp-terser'),
    gulpif = require('gulp-if');

module.exports = function(gulp, config) {
    return function (done) {

        var updir = '../';
        var splitter = '/app/assets/';
        var dest = 'assets/';


        /**
         * Go up by one dir on a given path (rewind it).
         * @param {String} path - The path to rewind.
         * @return {String} The rewound path.
         */
        function rewindPath(path) {
            var  parts = path.split('/');
            parts.pop();

            return parts.join('/');
        }


        /**
         * Check if a path is a relative path.
         * @param {String} path - The path to check.
         * @return {Boolean} True if the path is a relative path.
         * TODO: This may need to account for more markers of relativity, such as  './'.
         */
        function isRelativePath(path) {
            return path.indexOf(updir) >= 0;
        }

        var babelFiles = ['schedule-dashboard-timeline.js'];

        var isBabelFile = function(file) {
            var fileParts = file.path.split('\\');
            return (babelFiles.indexOf(fileParts[fileParts.length - 1]) > -1);
        };

        /**
         * Create pipe for rebasing relative asset URLs in CSS files.
         */
        var rebasePipe = lazypipe()
            .pipe(
                function() {
                    return gulpif('*.css',
                        cssrewrite({
                            destination: dest,

                            adaptPath: function(context) {

                                var parts = slash(context.sourceDir).split(splitter);

                                var path = parts[1];

                                if(isRelativePath(context.targetFile)) {

                                    if(path) {
                                        path = rewindPath(path);
                                    }

                                    context.targetFile = context.targetFile.replace('../', dest + path + '/');

                                } else {

                                    if(path) {
                                        context.targetFile = dest + path + '/' + context.targetFile;
                                    }
                                }

                                return context.targetFile;
                            }
                        })
                    );
                }
            ).pipe(
                function() {
                    return gulpif(isBabelFile,
                        babel({
                            presets: ['@babel/preset-env', 'es2015']
                        }));
                }
            );

        // 'app/*.html', '!app/assets/'
        function buildJs() {
            return gulp.src(['app/*.js'])
                .pipe(useref({}, rebasePipe))
                .pipe(babel({
                    presets: ['@babel/preset-env', 'es2015']
                }))
                .pipe(gulpif('*.js', uglify({mangle:false})))
                .pipe(gulp.dest(config.dist_dir));
        }

        function buildHtml() {
            return gulp.src(['!app/assets/','app/*.html'])
                .pipe(htmlmin({ collapseWhitespace: true }))
                .pipe(gulp.dest(config.dist_dir));
        }

        function buildCss() {
            return gulp.src(['!app/assets/','app/*.html'])
                .pipe(useref({}, rebasePipe))
                .pipe(css())
                .pipe(gulp.dest(config.dist_dir));
        }

        // return gulp.series(buildHtml, buildJs, buildCss)(done);
        return gulp.src(['app/*.html', '!app/assets/'])
            .pipe(useref({}, rebasePipe))
            .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
            .pipe(gulpif('*.css', css()))
            .pipe(gulp.dest(config.dist_dir));

    };
};
