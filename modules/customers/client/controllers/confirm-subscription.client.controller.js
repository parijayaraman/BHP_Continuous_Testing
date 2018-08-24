   (function() {
     'use strict';

     // Customers controller
     var customerModule = angular
       .module('customers')
       .controller('ConfirmSubscriptionController', ConfirmSubscriptionController);

     ConfirmSubscriptionController.$inject = ['$scope', 'Authentication', '$window', '$state', '$uibModal', '$uibModalInstance', 'PaymentService', 'customer', 'SubscriptionChargesService'];

     function ConfirmSubscriptionController($scope, Authentication, $window, $state, $uibModal, $uibModalInstance, PaymentService, customer, SubscriptionChargesService) {
       var vm = this;
       vm.authentication = Authentication;
       // vm.submitSubscription = submitSubscription;
       vm.user = Authentication.user;
       $scope.customer = customer;
       $scope.amount = null;

       SubscriptionChargesService.query(function(data) {
         $scope.subscriptions = data;
       });

       $scope.selectSubscriptionType = function(subscriptionType) {
         $scope.amount = subscriptionType.amount;
       };

       $scope.submitSubscription = function(params) {
         $uibModalInstance.close();
         var modalInstance = $uibModal.open({
           templateUrl: '/modules/customers/client/views/payments.client.view.html',
           controller: 'PaymentController',
           resolve: {
             amount: function() {
               return $scope.amount;
             },
             customer: function() {
               return $scope.customer;
             }
           }

         });
       };

       $scope.ui = {
         modalHeaderTitle: 'Please choose your option'
       };

       $scope.cancel = function() {
         $uibModalInstance.dismiss('cancel');
       };

     }
   }());
