'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  SubscriptionSummary = mongoose.model('SubscriptionSummary'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// add and renew subscriptions for a professional. Both add and renew calls will make new entries in the db
exports.addSubscription = function(req, res) {
  var subscriptionDate = new Date();
  var months = 12;
  var subscription = new SubscriptionSummary(req.body);
  var expiryDate = subscriptionDate.setMonth(subscriptionDate.getMonth() + months);

  subscription.expiryDate = expiryDate;
  subscription.updated = new Date();
  subscription.user = req.user;

  subscription.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(subscription);
    }
  });
};

// Get the entire subscription summary of a professional
exports.getSubscriptionSummary = function(req, res, next) {
  SubscriptionSummary.find({ 'user': req.params.profId }).populate('user', 'email').exec(function(err, subscriptions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.subscriptions = subscriptions;
      next();
    }
  });
};

// Return subscription status(true/false) and the final subscription information in an array
exports.checkSubscriptionStatus = function(req, res) {
  var subscriptions = req.subscriptions;
  var subscription = [];
  var active = {};
  var finalSubscription;
  var status;

  if (subscriptions.length > 0) {
    finalSubscription = subscriptions[subscriptions.length - 1]; // Get the final subscrption information

    if (finalSubscription.expiryDate >= new Date()) {
      status = 'valid'; // Subscribed
    } else {
      status = 'expired'; // Exoired
    }

  } else {
    status = 'no'; // Not subscribed yet
    finalSubscription = 'No Subscriptions Yet.';
  }

  active.status = status;
  subscription.push(finalSubscription);
  subscription.push(active);
  subscription.push(subscriptions);

  res.jsonp(subscription);
};
