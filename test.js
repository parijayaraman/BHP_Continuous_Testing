'use strict';

/**
 * Module dependencies.
 */
var webdriver = require('selenium-webdriver');
var path = require('path');
var app = require(path.resolve('./config/lib/app'));

/**app.init(function () {
  console.log('Initialized test automation');
*/

var browser = new webdriver.Builder().
	withCapabilities(webdriver.Capabilities.chrome()).build());
	
browser.get('htt://localhost:3000');

var title = browser.getTitle();

console.log(title);

assert.equal(title, 'Birthday Headlines');

console.log('Test completed');
  
});
