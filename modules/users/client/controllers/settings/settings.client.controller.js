(function() {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'Authentication', '$state'];

  function SettingsController($scope, Authentication, $state) {
    var vm = this;
    vm.user = Authentication.user;
    vm.currentState = undefined;
    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      vm.currentState = $state.current.name;
    }

    // Dynamically Set the active class for all the menus
    $scope.isActive = function(viewLocation) {
      return viewLocation === vm.currentState;
    };
  }
}());
