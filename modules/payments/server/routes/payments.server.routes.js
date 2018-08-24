'use strict';

/**
 * Module dependencies
 */
var payments = require('../controllers/payments.server.controller');

module.exports = function(app) {
  // Payments Routes
  // app.use(payments.customerExists); // Middleware - Ref(https://stormpath.com/blog/how-to-write-middleware-for-express-apps)
  app.get('/api/process/payment/', payments.fetchProfessional, payments.createProfessional, payments.processPayment, payments.addSubscription);
  app.get('/api/process/sendpaymentEmail/', payments.sendOTP);
  app.get('/api/process/verifyOtp/', payments.verifyOtp);
};
