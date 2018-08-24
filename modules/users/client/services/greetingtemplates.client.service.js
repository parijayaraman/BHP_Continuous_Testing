// Greetingtemplates service used to communicate Greetingtemplates REST endpoints
(function () {
  'use strict';

  angular
    .module('users.admin.services')
    .factory('GreetingtemplatesService', GreetingtemplatesService);

  GreetingtemplatesService.$inject = ['$resource'];

  function GreetingtemplatesService($resource) {
    return $resource('/api/admin/greetingtemplates/:greetingtemplateId', {
      greetingtemplateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
