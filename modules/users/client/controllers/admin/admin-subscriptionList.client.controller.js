(function() {
  'use strict';

  angular
    .module('users.admin')
    .controller('AdminSubscriptionListController', AdminSubscriptionListController);

  AdminSubscriptionListController.$inject = ['$scope', '$filter', 'SubscriptionChargesService'];

  function AdminSubscriptionListController($scope, $filter, SubscriptionChargesService) {
    var vm = this;

    SubscriptionChargesService.query(function(data) {
      vm.subscriptions = data;
    });
  }
}());
