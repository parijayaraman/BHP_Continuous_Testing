(function() {
  'use strict';

  angular
    .module('customers')
    .controller('DeleteCustomerController', DeleteCustomerController);

  DeleteCustomerController.$inject = ['$mdDialog', '$scope', 'customer'];

  function DeleteCustomerController($mdDialog, $scope, customer) {

    $scope.model = {
      customer: customer
    };

    $scope.ui = {
      modalHeaderTitle: 'Delete customer'
    };

    $scope.deleteCustomer = function(customer) {
      // Delete a single customer and close the popup
      if (customer.length === undefined) {

        customer.$remove().then(function(updated) {
          $mdDialog.hide(updated);
        });
        return false;
      }

      // Delete the selected customers and close the popup
      var count = 0;
      angular.forEach(customer, function(v, k) {
        if (v) {
          count++;
          v.$remove().then(function(updated) {
            // $mdDialog.hide(updated);

          });
        }
      });

      if (customer.length === count) {
        $mdDialog.hide(customer);
      }

    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }
}());
