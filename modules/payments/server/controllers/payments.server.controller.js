'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  // stripe = require('stripe')('sk_test_KPpmxN9abBAdQQCFrPGA0xhg'), // For Development
  stripe = require('stripe')('sk_live_9CJvue96ZBWVo21PMJI1M6wC'), // For Production
  PaymentOtp = mongoose.model('paymentOtp'),
  StripeReference = mongoose.model('StripeReference'),
  SuccessTransaction = mongoose.model('SuccessTransaction'),
  FailureTransaction = mongoose.model('FailureTransaction'),
  SubscriptionSummary = mongoose.model('SubscriptionSummary'),
  nodemailer = require('nodemailer'),
  smtpTransport = nodemailer.createTransport(config.mailer.options),
  User = mongoose.model('User'),
  math = require('mathjs'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.sendOTP = function(req, res, next) {
  var otp = Math.floor(1000 + Math.random() * 9000);

  PaymentOtp.create({ otp: otp, user: req.user }, function(err, payment) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      async.waterfall([
        function(done) {
          var httpTransport = 'http://';
          if (config.secure && config.secure.ssl === true) {
            httpTransport = 'https://';
          }
          var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
          var templateURL = 'modules/customers/server/templates/payment-otp-email';
          res.render(path.resolve(templateURL), {
            appName: config.app.title,
            imageUrl: baseUrl + '/images/birthday.png',
            professionalName: req.user.firstName,
            otp: otp,
            currentTime: new Date()
          }, function(err, emailHTML) {
            done(err, emailHTML, req);
          });
        },
        // If valid email, send reset email using service
        function(emailHTML, req, done) {
          var mailOptions = {
            to: req.user.email,
            from: config.mailer.from,
            // replyTo: req.body.user.email,
            subject: 'Birthday Headlines Payment - OTP',
            html: emailHTML
            // html: req.body.htmlcontent
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            if (!err) {
              res.jsonp({ sent: true });
              // res.send({
              //   message: 'An email is sent to the registered email with further instructions'
              // });
            } else {
              // return res.status(422).jsonp({ sent: false });
              return res.status(422).send({
                message: 'Failure sending email'
              });
            }

            done(err);
          });
        }
      ], function(err) {
        if (err) {
          return next(err);
        }
      });

    }
  });
};

exports.verifyOtp = function(req, res, next) {
  var user = req.user;

  PaymentOtp.findOne({ 'user': req.user._id }).sort({ created: -1 }).populate('user', 'email').exec(function(err, ref) {
    var otp = parseInt(req.query.otp, 10);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(typeof parseInt(req.query.otp));
      if (ref.otp === otp) {
        console.log('valid otp');
        res.jsonp({ status: 'valid' });
      } else {
        console.log('invalid otp');
        res.jsonp({ status: 'invalid' });
      }
    }
  });
};

/*
This method will fetch the professional's stripe referece from our db
If any reference esists, will return the reference otherwise return empty array
*/
exports.fetchProfessional = function(req, res, next) {
  var user = req.user;

  StripeReference.find({ 'user': req.user._id }).populate('user', 'email').exec(function(err, ref) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.customer = ref;
      next(); // This will call createProfessional method
    }
  });
};

/*
If there is no reference found in the db,
this function creates a professional in stripe and add a reference in our db
*/
exports.createProfessional = function(req, res, next) {
  console.log(req.user.email);
  if (req.customer.length === 0) {
    console.log('Professional does not exists in our db');
    // Create customer in stripe db first
    stripe.customers.create({
      email: req.user.email,

      source: req.query.token
    }).then(function(customer) {
      // Create stripe reference in our db
      StripeReference.create({ cardToken: req.query.token, email: req.user.email, stripeId: customer.id, summary: customer, user: req.user }, function(err, ref) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          console.log('creating professional in our db');
          req.customer = ref.stripeId;
          next();
        }
      });
    });
  } else {
    console.log('Professional already exists in our db');
    req.customer = req.customer[0].stripeId;
    next();
  }
};

exports.processPayment = function(req, res, next) {
  stripe.charges.create({
    // Charge the customer in stripe
    // amount: 49.99,
    amount: math.round(req.query.amount * 100, 2),
    currency: 'usd',
    customer: req.customer
  }).then(function(charge) {
    // Use and save the charge info in our db
    var successTransaction = {
      stripeId: charge.customer,
      transactionId: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      message: charge.outcome.seller_message,
      paidStatus: charge.paid,
      summary: charge
    };
    SuccessTransaction.create(successTransaction, function(err, ref) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log('Txn summary in our db -success');
        console.log(ref);
        req.charge = ref;
        next();
      }
    });
  }).catch(function(err) {
    // Deal with an error
    console.log('Error in charging the customer in stripe');
    console.log(err.message);
    var failureTransaction = new FailureTransaction();
    failureTransaction.summary = err;
    failureTransaction.save(function(err) {
      // if (err) return handleError(err);
      // saved!
    });
    res.jsonp({ status: 'error', message: err.message });
  });
};

// add and renew subscriptions for a professional. Both add and renew calls will make new entries in the db
exports.addSubscription = function(req, res) {
  var charge = req.charge;
  console.log('The amount reveived is', req.query.amount);
  if (req.query.amount > 10) {
    var subscriptionDate = new Date();
    // console.log(subscriptionDate);
    var months = 12;
    var subscription = new SubscriptionSummary(req.body);
    var expiryDate = subscriptionDate.setMonth(subscriptionDate.getMonth() + months);

    subscription.expiryDate = expiryDate;
    subscription.updated = new Date();
    subscription.user = req.user;

    subscription.charge = req.charge.amount;

    subscription.save(function(err) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log('The user is subscribed in our db');
        res.jsonp({ status: 'subscribed', charge: charge.transactionId });
      }
    });

  } else {
    res.jsonp({ status: 'no', charge: charge.transactionId });
  }
};
