(function() {
  'use strict';

  angular
    .module('core')
    .controller('ChangePasswordSuccessController', ChangePasswordSuccessController);

  ChangePasswordSuccessController.$inject = ['$mdDialog', '$scope'];

  function ChangePasswordSuccessController($mdDialog, $scope) {
    $scope.ui = {
      modalHeaderTitle: 'Change password'
    };
  }
}());
