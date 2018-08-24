// Greetingtemplates service used to communicate Greetingtemplates REST endpoints
(function () {
  'use strict';

  angular
    .module('customers.services')
    .factory('SubscriptionChargesService', SubscriptionChargesService);

  SubscriptionChargesService.$inject = ['$resource'];

  function SubscriptionChargesService($resource) {
    return $resource('/api/admin/subscriptionCharges/:id', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
