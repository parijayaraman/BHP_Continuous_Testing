(function() {
  'use strict';

  angular
    .module('customers')
    .controller('PaymentSuccessController', PaymentSuccessController);

  PaymentSuccessController.$inject = ['$uibModalInstance', '$scope', '$state', 'customer'];

  function PaymentSuccessController($uibModalInstance, $scope, $state, customer) {

    $scope.model = {
      customer: customer
    };

    $scope.ui = {
      modalHeaderTitle: 'Payment'
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
      if (!customer) {
        $state.go('customers.settings.subscription');
      } else {
        $state.go('customers.greetings', {
          customerId: customer._id
        });
      }
    };
  }
}());
