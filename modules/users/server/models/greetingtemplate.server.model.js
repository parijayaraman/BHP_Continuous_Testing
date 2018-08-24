'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Greetingtemplate Schema
 */
// var GreetingtemplateSchema = new Schema({
//   name: {
//     type: String,
//     default: '',
//     required: 'Please fill Greetingtemplate name',
//     trim: true
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User'
//   }
// });

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

mongoose.model('Greetingtemplate', GreetingTemplateSchema);
