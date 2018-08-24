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

var SubscriptionSummarySchema = new Schema({
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updated: {
    type: Date
  },
  charge: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('SubscriptionSummary', SubscriptionSummarySchema);
