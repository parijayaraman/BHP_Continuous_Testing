(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditTemplateController', EditTemplateController);

  EditTemplateController.$inject = ['$filter', '$scope', '$http', '$location', 'TemplateService', 'UsersService', 'Authentication', 'Notification'];

  function EditTemplateController($filter, $scope, $http, $location, TemplateService, UsersService, Authentication, Notification) {
    var vm = this;
    vm.user = Authentication.user;
    vm.updateDefaultTemplate = updateDefaultTemplate;

    // Get all the templates
    TemplateService.query(function (data) {
      vm.templates = data;

      // Set the selected defaultTemplate
      $scope.defaultTemplate = $filter('filter')(vm.templates, {
        $: vm.user.defaultTemplate
      });
      vm.template = $scope.defaultTemplate[0];
    });

    // Change user default template
    function updateDefaultTemplate(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.defaultTemplateForm');
      //   return false;
      // }
      if (vm.template === undefined) {
        vm.template = null;
      }
      UsersService.setDefaultTemplate(vm.template)
        .then(onChangeTemplateSuccess)
        .catch(onChangeTemplateError);
    }

    function onChangeTemplateSuccess(response) {
      if (response.defaultTemplate !== undefined) {
        Authentication.user.defaultTemplate = response.defaultTemplate; // Set the defaultTemplate to window object.
      } else {
        Authentication.user.defaultTemplate = null;
      }

      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Template updated successfully' });
    }

    function onChangeTemplateError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i>  Update default template failed!' });
    }
  }
}());
