'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  server: {
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'settings/**/*.js', 'app/controllers/**/*.js', 'app/models/**/*.js', 'app/routes/**/*.js', 'app/sockets/**/*.js', 'app/tests/**/*.js'],
    models: 'app/models/**/*.js',
    routes: 'app/routes/**/*.js',
    sockets: 'app/sockets/**/*.js',
    config: 'app/controllers/**/*.config.js',
    policies: 'app/controllers/**/*.policy.js',
    views: 'app/views/views_html/basic_layout/*.html'
  }
};
