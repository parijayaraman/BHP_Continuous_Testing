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

var GreetingTemplateSchema = new Schema({
  name: {
    type: String,
    default: '',
    // required: 'Please fill the template name',
    trim: true
  },
  content: {
    type: String,
    default: '',
    // required: 'Please fill the template content',
    trim: true
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('GreetingTemplate', GreetingTemplateSchema);
