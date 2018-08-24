'use strict';

module.exports = function(app) {
  // User Routes
  var professionals = require('../controllers/subscriptions.server.controller');

  app.route('/api/professional/subscription/:profId').get(professionals.getSubscriptionSummary).get(professionals.checkSubscriptionStatus);


  // Both subscribe and renew will make a new entry in the db. Hence utilized the same method
  app.route('/api/professional/subscription').post(professionals.addSubscription);
  app.route('/api/professional/renew').post(professionals.addSubscription);
};
