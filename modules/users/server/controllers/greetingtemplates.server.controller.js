'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Greetingtemplate = mongoose.model('Greetingtemplate'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Greetingtemplate
 */
exports.create = function(req, res) {
  var greetingtemplate = new Greetingtemplate(req.body);
  greetingtemplate.user = req.user;

  greetingtemplate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(greetingtemplate);
    }
  });
};

/**
 * Show the current Greetingtemplate
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var greetingtemplate = req.greetingtemplate ? req.greetingtemplate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  greetingtemplate.isCurrentUserOwner = req.user && greetingtemplate.user && greetingtemplate.user._id.toString() === req.user._id.toString();

  res.jsonp(greetingtemplate);
};

/**
 * Update a Greetingtemplate
 */
exports.update = function(req, res) {
  var greetingtemplate = req.greetingtemplate;

  greetingtemplate = _.extend(greetingtemplate, req.body);

  greetingtemplate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(greetingtemplate);
    }
  });
};

/**
 * Delete an Greetingtemplate
 */
exports.delete = function(req, res) {
  var greetingtemplate = req.greetingtemplate;

  greetingtemplate.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(greetingtemplate);
    }
  });
};

/**
 * List of Greetingtemplates
 */
exports.list = function(req, res) {
  Greetingtemplate.find().sort('-created').populate('user', 'displayName').exec(function(err, greetingtemplates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(greetingtemplates);
    }
  });
};

/**
 * Greetingtemplate middleware
 */
exports.greetingtemplateByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Greetingtemplate is invalid'
    });
  }

  Greetingtemplate.findById(id).populate('user', 'displayName').exec(function(err, greetingtemplate) {
    if (err) {
      return next(err);
    } else if (!greetingtemplate) {
      return res.status(404).send({
        message: 'No Greetingtemplate with that identifier has been found'
      });
    }
    req.greetingtemplate = greetingtemplate;
    next();
  });
};


// // A temporary method to insert templates. This will be dynamically added later
// exports.populateGreetingTemplates = function(req, res) {
//   var names = [{ name: 'Greeting Template1', 'content': '<html></html>' }, { name: 'Greeting Template 2', 'content': '<html></html>' }];

//   var template = new GreetingTemplate();

//   template.collection.insert(names, onInsert);

//   function onInsert(err, docs) {
//     if (err) {
//       // TODO: handle error
//       res.send('OOPS!!, there is an error in inserting records');
//     } else {
//       res.send('Inserted');
//     }
//   }
// };


// // Get all greeting templates
// exports.getAllGreetingTemplates = function(req, res) {

//   GreetingTemplate.find({}, function(err, templates) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(templates);
//     }
//   });

// };