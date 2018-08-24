'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * GreetingTemplateSchema Summary Schema
 */

var emailHistorySchema = new Schema({
  sentTo: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  subject: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    default: '',
    trim: true
  },
  fromEmail: {
    type: String,
    default: '',
    trim: true
  },
  toEmail: {
    type: String,
    default: '',
    trim: true
  },
  sentBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  sentDate: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('EmailHistory', emailHistorySchema);
