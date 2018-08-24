'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  GreetingTemplate = mongoose.model('GreetingTemplate'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a greetingTemplate
 */
exports.create = function(req, res) {

  var greetingTemplate = new GreetingTemplate(req.body);

  greetingTemplate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(greetingTemplate);
    }
  });
};

/**
 * Show the current greetingTemplate
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var greetingTemplate = req.greetingTemplate ? req.greetingTemplate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  greetingTemplate.isCurrentUserOwner = req.user && greetingTemplate.user && greetingTemplate.user._id.toString() === req.user._id.toString();

  res.jsonp(greetingTemplate);
};

/**
 * Update a greetingTemplate
 */
exports.update = function(req, res) {
  var greetingTemplate = req.greetingTemplate;

  greetingTemplate = _.extend(greetingTemplate, req.body);

  greetingTemplate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(greetingTemplate);
    }
  });
};

// A temporary method to insert templates. This will be dynamically added later
exports.populateGreetingTemplates = function(req, res) {
  var names = [{
    name: 'Greeting Template 1',
    'content': '<html></html>'
  }, {
    name: 'Greeting Template 2',
    'content': '<html></html>'
  }];

  var template = new GreetingTemplate();

  template.collection.insert(names, onInsert);

  function onInsert(err, docs) {
    if (err) {
      // TODO: handle error
      res.send('OOPS!!, there is an error in inserting records');
    } else {
      res.send('Inserted');
    }
  }
};


// Get all greeting templates
exports.getAllGreetingTemplates = function(req, res) {

  GreetingTemplate.find({}, function(err, templates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(templates);
    }
  });

};