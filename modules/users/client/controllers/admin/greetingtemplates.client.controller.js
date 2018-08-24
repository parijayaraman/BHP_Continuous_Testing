(function() {
  'use strict';

  // Greetingtemplates controller
  angular
    .module('users.admin')
    .controller('GreetingtemplatesController', GreetingtemplatesController);

  GreetingtemplatesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'greetingtemplateResolve', 'Notification'];

  function GreetingtemplatesController($scope, $state, $window, Authentication, greetingtemplate, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.greetingtemplate = greetingtemplate;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.isCreateOrUpdate = false;

    // Remove existing Greetingtemplate
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.greetingtemplate.$remove($state.go('greetingtemplates.list'));
      }
    }

    // Save Greetingtemplate
    function save(isValid) {
      vm.isCreateOrUpdate = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.greetingtemplateForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.greetingtemplate._id) {
        vm.greetingtemplate.$update(successCallback, errorCallback);
      } else {
        vm.greetingtemplate.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.isCreateOrUpdate = false;
        $state.go('admin.dashboard.greetingtemplates', {
          greetingtemplateId: res._id
        });
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Template saved successfully!'
        });
      }

      function errorCallback(res) {
        vm.isCreateOrUpdate = false;
        vm.error = res.data.message;
        Notification.error({
          message: vm.error,
          title: '<i class="glyphicon glyphicon-remove"></i> Template update error!'
        });
      }
    }
  }
}());