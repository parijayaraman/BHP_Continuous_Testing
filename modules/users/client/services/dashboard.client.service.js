// Greetingtemplates service used to communicate Greetingtemplates REST endpoints
(function () {
  'use strict';

  angular
    .module('users.admin.services')
    .factory('DashboardService', DashboardService);

  DashboardService.$inject = ['$resource'];

  function DashboardService($resource) {
    return $resource('/api/admin/dashboard/:id', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
