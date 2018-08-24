// Customers service used to communicate Customers REST endpoints

(function () {
  'use strict';

  angular
    .module('customers.services')
    .factory('CustomersService', CustomersService);

  CustomersService.$inject = ['$resource'];

  function CustomersService($resource) {
    var Customers = $resource('/api/professional/customers/:customerId', { customerId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      sendGreetings: {
        method: 'POST',
        url: '/api/professional/customer/greeting'
      },
      importCustomers: {
        method: 'POST',
        url: '/api/professional/customer/importCustomers'
      }
    });

    angular.extend(Customers, {
      requestEmailGreetings: function (email) {
        return this.sendGreetings(email).$promise;
      },
      requestImportCustomers: function (bulkCustomers) {
        return this.importCustomers(bulkCustomers).$promise;
      }
    });

    return Customers;
  }
}());
