'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Update a Customer
 */
exports.updateDefaultReminder = function(req, res) {
// console.log('hello irukengala');
  var user = req.user;
  console.log(req);
  console.log(req.body.option);

  if (user) {
    user.updated = Date.now();
    user.birthdayReminderMail = req.body.option;

    user.save(function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            console.log('The record is inserted');
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(401).send({
      message: 'Default reminder option is not set'
    });
  }
};
