'use strict';

/**
 * Module dependencies
 */

var media = require('../controllers/content/media.server.controller');
var core = require('../controllers/core/core.server.controller');

module.exports = function (app) {

  app.route('/api/media/upload').post(media.upload);

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

};
