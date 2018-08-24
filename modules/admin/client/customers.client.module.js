(function (app) {
  'use strict';

  app.registerModule('customers');
  app.registerModule('customers.routes', ['ui.router', 'core.routes']);
  app.registerModule('customers.services');
}(ApplicationConfiguration));
