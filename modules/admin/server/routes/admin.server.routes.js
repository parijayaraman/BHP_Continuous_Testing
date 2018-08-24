'use strict';

/**
 * Module dependencies
 */
var templates = require('../controllers/greetingTemplate.server.controller');
var reminders = require('../controllers/birthdayReminder.server.controller');
var dashboard = require('../controllers/dashboard.server.controller');
var charges = require('../controllers/subscriptionCharges.server.controller');

module.exports = function(app) {
  // Greeting template Routes
  app.route('/api/admin/dashboard').get(dashboard.getEmailsCount).get(dashboard.getProfessionalsCount).get(dashboard.getSubscriptionInfo).get(dashboard.getCustomersCount);
  app.route('/api/admin/populatetemplates').get(templates.populateGreetingTemplates);
  app.route('/api/admin/templates').get(templates.getAllGreetingTemplates);
  app.route('/api/admin/populateReminders').get(reminders.populateBirthdayReminders);
  app.route('/api/admin/reminders').get(reminders.getAllBirthdayReminders);
  app.route('/api/admin/populateSubscriptionCharges').get(charges.populateSubscriptionCharges);
  app.route('/api/admin/subscriptionCharges').get(charges.getAllSubscriptionCharges);
  app.route('/api/admin/subscriptionCharges/:id').get(charges.getSubscriptionCharge);
  app.route('/api/admin/subscriptionCharges/:id').put(charges.update);

  app.param('id', charges.subscriptionChargeById);
  app.route('/api/admin/templates/:templateId').all()
    .get(templates.read)
    .put(templates.update);
   // .delete(template.delete);


};
