(function () {
  'use strict';

  angular
    .module('core')
    .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['$mdDialog', '$scope', 'user'];

  function LogoutController ($mdDialog, $scope, user) {
    $scope.model = {
      user: user
    };

    $scope.ui = {
      modalHeaderTitle: 'Logout'
    };

    // $scope.cancel = function() {
    // //  $uibModalInstance.dismiss('cancel');
    // };

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
}());
