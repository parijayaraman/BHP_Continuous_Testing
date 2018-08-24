'use strict';

/**
 * Module dependencies
 */
var contact = require('../controllers/contact.server.controller');

module.exports = function(app) {
  // Attendances Routes
  app.route('/api/contact')
    .get(contact.list)
    .post(contact.contact);

  app.route('/api/contact/:contactId')
    .delete(contact.delete);
};
