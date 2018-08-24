(function() {
  'use strict';

  angular
    .module('core')
    .controller('HelpStepController', HelpStepController);

  HelpStepController.$inject = ['$mdDialog', '$scope', 'user'];

  function HelpStepController($mdDialog, $scope, user) {
    $scope.model = {
      user: user
    };

    $scope.ui = {
      myTabIndex: 0,
      progressValue: 0
    }

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.$watchCollection('ui', function(newNames, oldNames) {
      $scope.ui.progressValue = (($scope.ui.myTabIndex + 1) * 100) / 5

    });
  }
}());