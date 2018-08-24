  (function() {
    'use strict';

    angular
      .module('users.admin')
      .controller('UserController', UserController);

    UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'PasswordValidator', 'userResolve', 'Notification', '$uibModal'];

    function UserController($scope, $state, $window, Authentication, PasswordValidator, user, Notification, $uibModal) {
      var vm = this;

      vm.authentication = Authentication;
      vm.user = user;
      vm.remove = remove;
      vm.save = save;
      vm.isContextUserSelf = isContextUserSelf;
      vm.cancel = cancel;
      vm.isCreateOrUpdate = false;

      function remove() {

        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '/modules/users/client/views/admin/delete-user.client.view.html',
          controller: 'DeleteUserController',
          // size: 'sm',
          resolve: {
            user: function() {
              return vm.user;
            }
          }
        });

        modalInstance.result.then(function(updated) {
          $state.go('admin.dashboard.users');
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!'
          });
        });

      }

      function save(isValid) {
        vm.isCreateOrUpdate = true;
        if (!isValid && !vm.user._id) {
          $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

          return false;
        }
        var user = vm.user;

        // TODO: move create/update logic to service
        if (vm.user._id) {
          user.password = vm.user.password;
          user.$update(successCallback, errorCallback);
        } else {
          user.$save(successCallback, errorCallback);
        }

        function successCallback(res) {
          vm.isCreateOrUpdate = false;
          $state.go('admin.dashboard.users');
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!'
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

      function isContextUserSelf() {
        return vm.user.email === vm.authentication.user.email;
      }

      function cancel() {
        $state.go('admin.dashboard.users');
      }

    }
  }());