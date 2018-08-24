'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Birthdaygreeting Schema
 */
var BirthdaygreetingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Birthdaygreeting name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Birthdaygreeting', BirthdaygreetingSchema);
