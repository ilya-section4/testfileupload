'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./settings/settings'));


/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).send();
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
