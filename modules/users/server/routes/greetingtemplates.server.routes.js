'use strict';

/**
 * Module dependencies
 */
// var greetingtemplatesPolicy = require('../policies/greetingtemplates.server.policy'),
var greetingtemplates = require('../controllers/greetingtemplates.server.controller');

module.exports = function(app) {

  // app.route('/api/admin/populatetemplates').get(greetingtemplates.populateGreetingTemplates);
  // app.route('/api/admin/templates').get(greetingtemplates.getAllGreetingTemplates);

  // Greetingtemplates Routes
  app.route('/api/admin/greetingtemplates').all()
    .get(greetingtemplates.list)
    .post(greetingtemplates.create);

  app.route('/api/admin/greetingtemplates/:greetingtemplateId').all()
    .get(greetingtemplates.read)
    .put(greetingtemplates.update)
    .delete(greetingtemplates.delete);

  // Finish by binding the Greetingtemplate middleware
  app.param('greetingtemplateId', greetingtemplates.greetingtemplateByID);
};
