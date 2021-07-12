var path = require('path');

module.exports = {

    entry: ['babel-polyfill'],

    source: [
        './app/application.js',
        './app/**/*.js',

        '!./app/app.js',
        '!./app/assets/**/*'
    ],

    styles: './app/**/*.less',

    vendors: [
        './node_modules/angular/angular.min.js',
        './node_modules/angular-route/angular-route.min.js',
        './node_modules/angular-resource/angular-resource.min.js',
        './node_modules/angular-ui-router/release/angular-ui-router.min.js',
        './node_modules/angular-animate/angular-animate.min.js',
        './node_modules/angular-translate/dist/angular-translate.min.js',
        './node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        './node_modules/angular-sanitize/angular-sanitize.min.js',
        './node_modules/angular-touch/angular-touch.min.js',
        './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        './node_modules/angular-ui-grid/ui-grid.js',
        './node_modules/oclazyload/dist/ocLazyLoad.min.js',
        './node_modules/lodash/lodash.min.js',
        './node_modules/gridstack/dist/*.min.*',
        './node_modules/angular-gridstack/dist/angular-gridstack.js',
        './node_modules/angular-ui-sortable/dist/sortable.js',
        './node_modules/angular-base64-upload/dist/angular-base64-upload.js',
        './node_modules/file-saver/*.js',
        './node_modules/signalr/jquery.signalR.min.js',
        './node_modules/angular-filter/dist/angular-filter.min.js',
        './lib/assets/global/scripts/*.min.js',
        '.lib/assets/pages/scripts/*.min.js',
        './lib/assets/layouts/global/scripts/*.js',
        './lib/assets/layouts/layout/scripts/*.min.js',


    ],

    vendors_dir: '/vendors',

    templates: {
        source: ['./app/components/**/*.html',
                './app/pages/**/*.html',
                './app/layouts/**/*.html',
                './app/directives/**/*.html',
                './app/app-masters/views/**/*.html',
                './app/app-admin/views/**/*.html',
                './app/app-labs/views/**/*.html',
                './app/app-delivery/views/**/*.html',
                './app/app-claims/views/**/*.html',
                './app/app-alerts/views/**/*.html',
                './app/app-recon/views/**/*.html',
                './app/app-invoice/views/**/*.html',
                './app/app-contract/views/**/*.html',
                './app/app-dev-playground/views/**/*.html',
                './app/app-general-components/views/**/*.html'],
        moduleName: 'shiptech.templates',
        base: path.join(process.cwd(), "app"),
        dest: './app'
    },

    assets: [
        './ci/package.json',
        './ci/heroku.js',
        './ci/Procfile',
    ],

    assets_dir: '/assets',

    img_dir: '/img',
    layouts_dir: '/layouts',

    mockups_dir: '/js/mockups',

    translations: [
        './app/translations/*.json'
    ],
    config: [
        './app/config/*'
    ],

    app_dir: './app',

    dist_dir: './dist',

    browserSync: {
        ui: false,
        server: './dist',
        host: 'localhost',
        port: 9016,
        open: 'external',
        https: false,
        notify: false
    },

    browserSync_dev: {
        browser: "chrome",
        ui: false,
        server: './app',
        host: 'localhost',
        port: 9016,
        open: 'local',
        https: false,
        notify: false,
        socket: {
            domain: 'http://localhost:9016'
        },
    }
};
