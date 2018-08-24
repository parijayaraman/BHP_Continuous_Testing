'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  SubscriptionCharge = mongoose.model('SubscriptionCharge'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a greetingTemplate
 */
exports.create = function(req, res) {

  var subscriptionCharge = new SubscriptionCharge(req.body);

  subscriptionCharge.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(subscriptionCharge);
    }
  });
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
  var subscription = req.subscription;
  subscription = _.extend(subscription, req.body);

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

// A temporary method to insert templates. This will be dynamically added later
exports.populateSubscriptionCharges = function(req, res) {
  var names = [{ description: 'Pay for this template', amount: 0.99, currency: 'USD', months: 0 }, { description: 'Subscribe for the 12 months', amount: 49.99, currency: 'USD', months: 12 }];

  var subscriptionCharge = new SubscriptionCharge();

  subscriptionCharge.collection.insert(names, onInsert);

  function onInsert(err, docs) {
    if (err) {
      // TODO: handle error
      res.send('OOPS!!, there is an error in inserting records');
    } else {
      res.send('Inserted');
    }
  }
};


// Get all greeting templates
exports.getAllSubscriptionCharges = function(req, res) {
  SubscriptionCharge.find({}, function(err, subscriptions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(subscriptions);
    }
  });

};
// Get all greeting templates
exports.getSubscriptionCharge = function(req, res) {
  SubscriptionCharge.find({ _id: req.params.id }, function(err, subscription) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(subscription);
    }
  });

};

exports.subscriptionChargeById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  SubscriptionCharge.findById(id).exec(function(err, subscription) {
    if (err) {
      return next(err);
    } else if (!subscription) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.subscription = subscription;
    next();
  });
};
