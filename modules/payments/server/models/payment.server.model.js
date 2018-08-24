'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Professional's stripe reference schema
 */
var StripeReferenceSchema = new Schema({
  //  Professional's stripe reference id
  stripeId: {
    type: String,
    default: '',
    trim: true
  },
  // Token created by stripe.js in client side with the card elements
  cardToken: {
    type: String,
    default: '',
    trim: true
  },
  // email reference of the payee
  email: {
    type: String,
    default: '',
    trim: true
  },
  // Professional reference
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  // Adding professional in stripe respons eentire summary
  summary: {
    type: Schema.Types.Mixed,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Professional's stripe reference schema
 */
var paymentOtpSchema = new Schema({
  //  Professional's stripe reference id
  otp: {
    type: Number,
    default: '',
    trim: true
  },
// Professional reference
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var TransactionSuccessSchema = new Schema({
  // Professional's stripe reference id
  stripeId: {
    type: String,
    default: '',
    trim: true
  },
  // Transaction id of the charge
  transactionId: {
    type: String,
    default: '',
    trim: true
  },
  // The amount charged
  amount: {
    type: Number,
    default: '',
    trim: true
  },
  // Currency denomination (usd etc)
  currency: {
    type: String,
    default: '',
    trim: true
  },
  // From stripe's response
  message: {
    type: String,
    default: '',
    trim: true
  },
  paidStatus: {
    type: Boolean,
    default: '',
    trim: true
  },
  // Entire summary of successful transaction returned by stripe
  summary: {
    type: Schema.Types.Mixed,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var TransactionFailureSchema = new Schema({
  //  Professional's stripe reference id
  stripeId: {
    type: String,
    default: '',
    trim: true
  },
  transactionId: {
    type: String,
    default: '',
    trim: true
  },
  amount: {
    type: Number,
    default: '',
    trim: true
  },
  currency: {
    type: String,
    default: '',
    trim: true
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  summary: {
    type: Schema.Types.Mixed,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('paymentOtp', paymentOtpSchema);
mongoose.model('StripeReference', StripeReferenceSchema);
mongoose.model('SuccessTransaction', TransactionSuccessSchema);
mongoose.model('FailureTransaction', TransactionFailureSchema);
