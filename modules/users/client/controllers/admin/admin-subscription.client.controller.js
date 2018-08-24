(function() {
  'use strict';

  angular
    .module('users.admin')
    .controller('AdminEditSubscriptionController', AdminEditSubscriptionController);

  AdminEditSubscriptionController.$inject = ['$scope', '$state', 'subscriptionResolve', 'Notification'];

  function AdminEditSubscriptionController($scope, $state, subscription, Notification) {
    var vm = this;

    // vm.authentication = Authentication;
    vm.subscription = subscription[0];
    vm.save = save;
    vm.isCreateOrUpdate = false;

    function save(isValid) {
      vm.isCreateOrUpdate = true;
      if (!isValid && !vm.subscription._id) {
        $scope.$broadcast('show-errors-check-validity', 'vm.subscriptionForm');

        return false;
      }
      var subscription = vm.subscription;
      // TODO: move create/update logic to service
      if (subscription._id) {
        subscription.$update(successCallback, errorCallback);
      } else {
        subscription.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.isCreateOrUpdate = false;
        $state.go('admin.dashboard.subscriptions');
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Subscription charge updated successfully!'
        });
      }

      function errorCallback(res) {
        vm.isCreateOrUpdate = false;
        vm.error = res.data.message;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> User update error!'
        });
      }
    }

  }
}());