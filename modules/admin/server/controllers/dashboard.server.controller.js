'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  async = require('async'),
  SubscriptionSummary = mongoose.model('SubscriptionSummary'),
  EmailHistory = mongoose.model('EmailHistory'),
  User = mongoose.model('User'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


exports.getEmailsCount = function(req, res, next) {
  // No of emails sent
  EmailHistory.find({}, function(err, histories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.emailsCount = histories.length;
      // console.log(req.emailtotalCounts);
      next();
    }
  });
};

exports.getProfessionalsCount = function(req, res, next) {
  // No of emails sent
  User.find({ 'roles': 'user', 'isActive': true }, function(err, professionals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.professionalsCount = professionals.length;
      // console.log(req.professionalsCount);
      next();
    }
  });
};

// Subscription information is not applied to admin
exports.getSubscriptionInfo = function(req, res, next) {

  getAllUsers(function(users) {
    // console.log(users);
    var paid = 0;
    var unpaid = 0;
    async.forEach(users, function(user, callback) {
      var id = user._id;

      getLatestSubscriptionSummary(id, function(subscription) {

        if (subscription) {
          if (subscription.expiryDate >= new Date()) {
            paid += 1;
          }
        } else {
          unpaid += 1;
        }

        callback();
      });

      // tell async that that particular element of the iterator is done
    }, function(err) {
      // console.log("paid", paid);
      // console.log("unpaid", unpaid);
      req.paidProfessionals = paid;
      req.unpaidProfessionals = unpaid;
      next();
    });
  });
};


exports.getCustomersCount = function(req, res, next) {
  // No of emails sent
  Customer.find({}, function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var emailsCount = req.emailsCount;
      var professionalsCount = req.professionalsCount;
      var customersCount = customers.length;
      var paidCount = req.paidProfessionals;
      var unpaidCount = req.unpaidProfessionals;

      res.jsonp({ paidProfesssionals: paidCount, unpaidProfesssionals: unpaidCount, emails: emailsCount, professionals: professionalsCount, customers: customersCount });
    }
  });
};


function getAllUsers(callback) {
  User.find({ 'roles': 'user' }, '-salt -password -providerData').sort('-created').populate('user', 'displayName').lean().exec(function(err, users) {
    callback(users);
  });
}

function getLatestSubscriptionSummary(id, callback) {
  SubscriptionSummary.findOne({ 'user': id }, {}, { sort: { 'created': -1 } }).lean().exec(function(err, subscription) {


    callback(subscription);

  });
}
