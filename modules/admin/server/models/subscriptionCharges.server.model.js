'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * Subscription Charge Schema
 */

var SubscriptionChargeSchema = new Schema({
  description: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 1
  },
  months: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('SubscriptionCharge', SubscriptionChargeSchema);
