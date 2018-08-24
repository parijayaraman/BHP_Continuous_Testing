'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var daemon = require('./daemon');
var server = app.start();
var cron = daemon.start();
