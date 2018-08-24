'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Contact = mongoose.model('Contact'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var smtpTransport = nodemailer.createTransport(config.mailer.options);


/**
 * List of Greetingtemplates
 */
exports.list = function(req, res) {
  Contact.find().sort('-created').populate('user', 'displayName').exec(function(err, contacts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contacts);
    }
  });
};

/**
 * Contact a User
 */
exports.contact = function(req, res, next) {
  async.waterfall([
    function(done) {
      var contact = new Contact(req.body);
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.subject = req.body.subject;
      contact.message = req.body.message;

      contact.save(function(err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          done(err, contact);
        }
      });
    },

    function(contact, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      res.render(path.resolve('modules/users/server/templates/contact-form-email'), {
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message
      }, function(err, emailHTML) {
        done(err, emailHTML, contact);
      });
    },

    // If valid email, send reset email using service
    function(emailHTML, contact, done) {
      var fromCreated = config.mailer.from.replace("BHP-Admin", contact.name);
      var mailOptions = {
        to: config.mailer.from,
        from: fromCreated,
        subject: 'A Question from ' + contact.name,
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          res.send({
            message: 'An email is sent to the registered email with further instructions'
          });
        } else {
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
};

/**
 * Delete an contact
 */
exports.delete = function(req, res) {
  Contact.deleteOne({
    _id: req.params.contactId
  }, function(err, results) {
    if (err) {
      console.log("failed");
      throw err;
    }
    res.jsonp(results);
  });
};