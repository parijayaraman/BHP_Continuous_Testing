// Subsriptions service used to communicate Subsriptions REST endpoints

(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('SubscriptionService', SubscriptionService);

  SubscriptionService.$inject = ['$resource'];

  function SubscriptionService($resource) {
    var Subsriptions = $resource('/api/professional/subscription/:profId', { profId: '@_id' }, {
      get: {
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'POST'
      }
    });

    angular.extend(Subsriptions, {
    });

    return Subsriptions;
  }
}());
