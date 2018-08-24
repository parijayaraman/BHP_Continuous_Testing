'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Customer = mongoose.model('Customer'),
  SubscriptionSummary = mongoose.model('SubscriptionSummary'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Show the current user
 */
exports.read = function(req, res) {
  res.json(req.model);
};

/**
 * Create a User
 */
exports.create = function(req, res, next) {
  async.waterfall([
    function(done) {
      var user = new User(req.body);
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.displayName = user.firstName + ' ' + user.lastName;
      user.roles = ['user'];
      user.isActive = req.body.isActive;
      user.provider = 'local';
      var password = user.password;
      //  user.userActivationToken = token;
      user.save(function(err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          //  res.json(user);
          done(err, user, password);
        }
      });
    },

    function(user, password, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      res.render(path.resolve('modules/users/server/templates/user-signin-email'), {
        name: user.displayName,
        email: user.email,
        password: password,
        appName: config.app.title,
        url: baseUrl + '/authentication/signin'
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },

    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'User Registration by Admin',
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
 * Update a User
 */
exports.update = function(req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;
  user.isActive = req.body.isActive;

  user.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function(req, res) {
  var user = req.model;

  user.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

exports.list = function(req, res) {
  var newUsers = [];
  getAllUsers(function(users) {
    // console.log(users);
    async.forEach(users, function(user, callback) {
      // console.log(user); // print the key
      var id = user._id;

      getAllCustomers(id, function(customers) {
        // console.log("customers", customers);
        var count = customers.length;
        user.customerCount = count;
        // console.log("user.customerCount", user.customerCount);
        // newUsers.push(user);
        // callback();

        getLatestSubscriptionSummary(id, function(subscription) {
          user.subscription = subscription;
          newUsers.push(user);
          callback();

        });
      });

      // tell async that that particular element of the iterator is done
    }, function(err) {
      console.log('iterating done');
      res.json(newUsers);

    });
  });
};

function getAllUsers(callback) {
  User.find({
    'roles': 'user'
  }, '-salt -password -providerData').sort('firstName').populate('user', 'displayName').lean().exec(function(err, users) {
    callback(users);
  });
}

function getAllCustomers(id, callback) {
  Customer.find({
    user: id
  }).exec(function(err, customers) {
    callback(customers);
  });
}

function getLatestSubscriptionSummary(id, callback) {
  SubscriptionSummary.findOne({
    'user': id
  }, {}, {
    sort: {
      'created': -1
    }
  }, function(err, subscription) {
    callback(subscription);
  });
}