'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Birthdaygreeting = mongoose.model('Birthdaygreeting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * List of Birthdaygreetings
 */
exports.list = function(req, res) {
  Birthdaygreeting.find().sort('-created').populate('user', 'displayName').exec(function(err, birthdaygreetings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(birthdaygreetings);
    }
  });
};
