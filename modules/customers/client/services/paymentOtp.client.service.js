'use strict';

angular.module('customers').factory('PaymentAuthenticationService', ['$resource',
  function($resource) {
    var resource;

    resource = $resource('/api/process/sendpaymentEmail/', null, {
      sendOTP: {
        method: 'GET',
        isArray: true
      }
    });

    return resource;
  }
]);
