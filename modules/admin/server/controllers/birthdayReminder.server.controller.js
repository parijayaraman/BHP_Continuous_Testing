'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  BirthdayReminder = mongoose.model('BirthdayReminder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a greetingTemplate
 */
exports.create = function(req, res) {

  var birthdayReminder = new BirthdayReminder(req.body);

  birthdayReminder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(birthdayReminder);
    }
  });
};

// A temporary method to insert templates. This will be dynamically added later
exports.populateBirthdayReminders = function(req, res) {
  var names = [{ description: 'On the day of the event', 'option': 1, message: 'today' }, { description: 'One day before the event', 'option': 2, message: 'tomorrow'}];

  var reminder = new BirthdayReminder();

  reminder.collection.insert(names, onInsert);

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
exports.getAllBirthdayReminders = function(req, res) {
  BirthdayReminder.find({}, function(err, reminders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reminders);
    }
  });

};
