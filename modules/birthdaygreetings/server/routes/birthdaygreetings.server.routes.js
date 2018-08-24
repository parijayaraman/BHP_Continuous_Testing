'use strict';

/**
 * Module dependencies
 */
var birthdaygreetingsPolicy = require('../policies/birthdaygreetings.server.policy'),
  birthdaygreetings = require('../controllers/birthdaygreetings.server.controller');

module.exports = function(app) {
  // Birthdaygreetings Routes
  app.route('/api/birthdaygreetings').all(birthdaygreetingsPolicy.isAllowed)
    .get(birthdaygreetings.list);
};
