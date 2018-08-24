'use strict';

/**
 * Module dependencies
 */
var customersPolicy = require('../policies/customers.server.policy'),
  customers = require('../controllers/customers.server.controller');

module.exports = function(app) {
  // Customers Routes

  app.route('/api/mail/today')
    .get(customers.mailsToday);

  app.route('/api/customers').all(customersPolicy.isAllowed)
    .get(customers.list)
    .post(customers.create);

  app.route('/api/professionals/')
    .get(customers.getProfessionals);

  app.route('/api/activeProfessionals/:birthdayReminderMail')
    .get(customers.getActiveProfessionals);

  app.route('/api/customers/professional/:pid')
    .get(customers.getCustomersForProfessional);

  app.route('/api/customers/today/professional/:pid')
    .get(customers.todayBirthdays);

  app.route('/api/customers/tomorrow/professional/:pid')
    .get(customers.tomorrowBirthdays);

  app.route('/api/customers/:customerId').all(customersPolicy.isAllowed)
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);

  app.route('/api/professional/customers').all()
    .get(customers.getBirthdayCustomers)
    .post(customers.create);

  app.route('/api/professional/customers/:customerId').all(customersPolicy.isAllowed)
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);

  app.route('/api/professional/customer/greeting')
    // .get(customers.getBirthdayCustomers)
    .post(customers.sendEmailGreetings);

  app.route('/api/professional/customer/importCustomers')
    .post(customers.bulkCreate);

  // For daily birthday Reminder
  app.route('/api/customer/bdayReminder').post(customers.sendBirthdayReminder);

  app.route('/api/events/:year')
    .get(customers.getEventsAndPeaks);

  app.route('/api/customer/checkImages/:imageCategory').get(customers.checkImages);

  // Finish by binding the Customer middleware
  app.param('customerId', customers.customerByID);
};
