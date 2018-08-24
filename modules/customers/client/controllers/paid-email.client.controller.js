(function() {
  'use strict';

  angular
    .module('customers')
    .controller('PaidEmailController', PaidEmailController);

  PaidEmailController.$inject = ['$scope',  'customer', 'CustomersService', '$state', 'Notification', '$uibModalInstance'];

  function PaidEmailController($scope,  customer,  CustomersService, $state, Notification, $uibModalInstance) {
    $scope.customer = customer;
    $scope.activated = true;
    $scope.sent = false;

      CustomersService.requestEmailGreetings($scope.customer)
        .then(onRequestTemplateSuccess)
        .catch(onRequestTemplateError);
    

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
      $scope.activated = false;
      $scope.sent = true;
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
