'use strict';

angular.module('customers').factory('PaymentOtpVerifyService', ['$resource',
  function($resource) {
    var resource;

    resource = $resource('/api/process/verifyOtp/', { otp: 'otp' }, {
      verifyOtp: {
        method: 'GET',
        isArray: true
      }
    });

    return resource;
  }
]);
