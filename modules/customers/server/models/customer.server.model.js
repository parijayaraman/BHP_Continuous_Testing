'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function(email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, {
    require_tld: false
  }));
};

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  firstName: {
    type: String,
    default: '',
    required: 'Please fill first name',
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    default: '',
    required: 'Please fill last name',
    trim: true,
    lowercase: true,
  },
  jobTitle: {
    type: String,
    default: '',
    trim: true
  },
  organization: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
    lowercase: true,
  },
  dob: {
    type: Date,
    required: 'Please fill dob',
    trim: true
  },
  date: {
    type: Number,
    required: 'Please fill date',
    trim: true
  },
  month: {
    type: Number,
    // default: '',
    required: 'Please fill month',
    trim: true
  },
  year: {
    type: Number,
    required: 'Please fill year',
    trim: true
  },
  gender: {
    type: Number,
    //default: '',
    required: 'Please fill gender',
    trim: true
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentDate: {
    type: Date,
    default: null,
    trim: true
  },
  // isAdmmin: {
  //   type: Boolean,
  //   default: 0
  // },
  // isProfessional: {
  //   type: Boolean,
  //   default: 0
  // },
  // isCustomer: {
  //   type: Boolean,
  //   default: 1
  // },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var eventSchema = new Schema({
  day: Number,
  Month: Number,
  // birthdays: Schema.Types.Mixed,
  events: [{
    event: String,
    year: String,
    _id: false
  }]
});

var peakSchema = new Schema({
  year: Number,
  movie: String,
  actor: String,
  actress: String,
  baseball: String,
  superbowl: String,
  gallonOfMilk: String,
  loafOfBread: String,
  newCar: String,
  gallonOfGas: String,
  newHome: String,
  averageIncome: String,
  president: String,
  vicePresident: String,
  popularGirls: String,
  popularBoys: String,
  tvShows: String,
  scienceAndTechnology: String,
  sp500: String,
  popularMusics: String
});

var chartSpSchema = new Schema({
  startYear: String,
  endYear: String,
  fileName: String
});


mongoose.model('Event', eventSchema);

mongoose.model('Peak', peakSchema);

mongoose.model('Customer', CustomerSchema);

mongoose.model('Sp', chartSpSchema);