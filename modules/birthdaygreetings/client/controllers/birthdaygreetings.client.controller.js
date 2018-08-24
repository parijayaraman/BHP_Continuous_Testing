(function() {
  'use strict';

  // Birthdaygreetings controller
  angular
    .module('birthdaygreetings')
    .controller('BirthdaygreetingsController', BirthdaygreetingsController);

  BirthdaygreetingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'birthdaygreetingResolve'];

  function BirthdaygreetingsController($scope, $state, $window, Authentication, birthdaygreeting) {
    var vm = this;

    vm.authentication = Authentication;
    vm.birthdaygreeting = birthdaygreeting;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Birthdaygreeting
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.birthdaygreeting.$remove($state.go('birthdaygreetings.list'));
      }
    }

    // Save Birthdaygreeting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.birthdaygreetingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.birthdaygreeting._id) {
        vm.birthdaygreeting.$update(successCallback, errorCallback);
      } else {
        vm.birthdaygreeting.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('birthdaygreetings.view', {
          birthdaygreetingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());