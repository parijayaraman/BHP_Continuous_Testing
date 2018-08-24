'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * ContactSchema Schema
 */
var ContactSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill name',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill email',
    trim: true
  },
  subject: {
    type: String,
    default: '',
    required: 'Please fill subject',
    trim: true
  },
  message: {
    type: String,
    default: '',
    required: 'Please fill message',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Contact', ContactSchema);