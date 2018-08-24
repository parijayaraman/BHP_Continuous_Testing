(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('DeleteUserController', DeleteUserController);

  DeleteUserController.$inject = ['$uibModalInstance', '$scope', 'user'];

  function DeleteUserController ($uibModalInstance, $scope, user) {

    $scope.model = {
      user: user
    };

    $scope.ui = {
      modalHeaderTitle: 'Delete user'
    };

    $scope.deleteUser = function deleteUser(user) {
      user.$remove().then(function(updated) {
        $uibModalInstance.close(updated);
      });
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
