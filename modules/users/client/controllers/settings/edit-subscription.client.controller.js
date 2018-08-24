(function() {
  'use strict';

  angular
    .module('users')
    .controller('EditSubscriptionController', EditSubscriptionController);

  EditSubscriptionController.$inject = ['$scope', '$state', '$http', '$location', 'SubscriptionService', 'SubscriptionChargesService', 'Authentication', 'Notification', '$uibModal', 'PaymentAuthenticationService'];

  function EditSubscriptionController($scope, $state, $http, $location, SubscriptionService, SubscriptionChargesService, Authentication, Notification, $uibModal, PaymentAuthenticationService) {
    var vm = this;

    // alert('Getting inside of subscription111111111111111111');
    vm.user = Authentication.user;

    vm.subscriptionStatus = null;
    vm.updateSubscription = updateSubscription;
    vm.subscriptionDate = null;
    vm.expiryDate = null;
    vm.status = null;
    vm.allSubscriptions = null;
    vm.loadModal = loadModal;
    // vm.amount = 49.99;

    SubscriptionChargesService.query(function(data) {
      $scope.subscriptions = data;
      var i;
      for (i = 0; i < data.length; i++) {
        if (data[i].months == 12) {
          vm.amount = data[i].amount;
          console.log(vm.amount);
        }
      }

    });

    SubscriptionService.get({ profId: vm.user._id }, function(response, getResponseHeaders) {
      console.log(response[2]);
      vm.allSubscriptions = response[2];

      console.log(response[1].status); // true or false

      // If user is not subscribed
      if (response[1].status === 'no') {
        // alert('hello1');
        vm.subscriptionStatus = 'no';
      }

      if (response[1].status === 'valid') {
        // alert('hello2');
        vm.subscriptionStatus = 'valid';
        vm.subscriptionDate = response[0].subscriptionDate;
        vm.expiryDate = response[0].expiryDate;
        vm.status = 'Active';
      }

      if (response[1].status === 'expired') {
        // alert('hello3');
        vm.subscriptionStatus = 'expired';
        vm.subscriptionDate = response[0].subscriptionDate;
        vm.expiryDate = response[0].expiryDate;
        vm.status = 'Expired';
      }
    });

    // Get the subscription details
    $scope.subscription = SubscriptionService.get({
      profId: vm.user._id
    });

    $scope.subscription.$promise.then(function(data) {
      if (data) {
        $scope.expiryOn = data[0].expiryDate;
        $scope.subscriptionStatus = data[1].status;
      }
    });

    function loadModal() {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '/modules/customers/client/views/payments.client.view.html',
        controller: 'PaymentController',
        resolve: {
          amount: function() {
            return vm.amount;
          },
          customer: function() {
            return null;
          }
        }
      });
    }
    // Renewal subscription
    function updateSubscription() {
      var subscription = new SubscriptionService();
      subscription.$save(successCallback, errorCallback);

      function successCallback(response) {
        $scope.expiryOn = response.expiryDate;
        $scope.subscriptionStatus = true;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Subscription renewed successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: vm.error, title: '<i class="glyphicon glyphicon-remove"></i> Subscription renew error!' });
      }
    }
  }
}());
