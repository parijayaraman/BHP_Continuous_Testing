(function() {
  'use strict';

  angular
    .module('customers')
    .controller('PaymentResultController', PaymentResultController);

  PaymentResultController.$inject = ['$scope', 'amount', 'customer', 'txnid', 'paid', 'activated', 'transactionerror', 'CustomersService', '$state', 'Notification', '$uibModalInstance'];

  function PaymentResultController($scope, amount, customer, txnid, paid, activated, error, CustomersService, $state, Notification, $uibModalInstance) {
    $scope.customer = customer;
    $scope.amount = amount;
    $scope.txnid = txnid;
    $scope.paid = paid;
    $scope.activated = activated;
    $scope.sent = false;
    $scope.transactionerror = error;

    if (paid) {
      CustomersService.requestEmailGreetings($scope.customer)
        .then(onRequestTemplateSuccess)
        .catch(onRequestTemplateError);
    }

    $scope.agree = function() {
      $uibModalInstance.close();
      if (customer) {
        $state.go('customers.birthdaylist');
      } else {
        $state.go('customers.settings.subscription');
      }
    };

    // Email template Callbacks
    function onRequestTemplateSuccess(response) {
      $scope.paid = true;
      $scope.sent = true;
      $scope.activated = false;
      // Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Email has been sent successfully', delay: 10000 });
      $state.go('customers.birthdaylist');
    }

    function onRequestTemplateError(response) {
      // Show user error message and clear form
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to send email template', delay: 10000 });
      $state.go('customers.birthdaylist');
    }
  }
}());
