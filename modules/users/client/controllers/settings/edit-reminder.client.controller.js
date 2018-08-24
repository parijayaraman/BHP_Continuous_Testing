(function() {
  'use strict';

  angular
    .module('users')
    .controller('EditReminderController', EditReminderController);

  EditReminderController.$inject = ['$filter', '$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification', 'ReminderService'];

  function EditReminderController($filter, $scope, $http, $location, UsersService, Authentication, Notification, ReminderService) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateDefaultReminder = updateDefaultReminder;

    ReminderService.query(function(data) {
      vm.reminders = data;
      // Set the selected defaultReminder
      $scope.defaultReminder = $filter('filter')(vm.reminders, { option: vm.user.birthdayReminderMail });
      vm.reminder = $scope.defaultReminder[0]; // Single reminder option that is set to be default
    });


    // Update reminder
    function updateDefaultReminder(isValid) {
      console.log(vm.reminder);

      if (vm.Reminder === undefined) {
        vm.Reminder = null;
      }
      UsersService.setDefaultReminder(vm.reminder)
        .then(onChangeReminderSuccess)
        .catch(onChangeReminderError);
    }

    function onChangeReminderSuccess(response) {
      console.log(response);
      if (response !== undefined) {
        Authentication.user.birthdayReminderMail = response.birthdayReminderMail; // Set the defaultReminder to window object.
      } else {
        Authentication.user.birthdayReminderMail = null;
      }

      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Reminder updated!' });
    }

    function onChangeReminderError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i>  Update default reminder failed!' });
    }


  }
}());
