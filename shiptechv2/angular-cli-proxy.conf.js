const angular = require('./angular');

const baseHref = angular.projects.shiptech.architect.serve.options.baseHref.toLowerCase().replace(/^\/|\/$/g, '');

const PROXY_CONFIG = {
  '/': {
    'target': 'http://localhost:4200',
    'secure': false,
    'logLevel': 'debug',
    'bypass': function(req, res, proxyOptions) {
      if (!req.url.toLowerCase().startsWith(`/${baseHref}`)) {
        const redirectedUrl = `/${baseHref}${req.url}`;
        console.log(`Redirected ${req.url} to ${redirectedUrl}`);
        return redirectedUrl;
      } else {
        return req.url;
      }
    }
  }
};

module.exports = PROXY_CONFIG;
