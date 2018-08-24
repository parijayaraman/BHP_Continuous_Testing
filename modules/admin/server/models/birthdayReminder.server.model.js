'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * Subscription Summary Schema
 */

var reminderSchema = new Schema({
  description: {
    type: String,
    default: ''
  },
  option: {
    type: Number,
    default: 1
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('BirthdayReminder', reminderSchema);
