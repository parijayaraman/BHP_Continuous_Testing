(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('ReminderService', ReminderService);

  ReminderService.$inject = ['$resource'];

  function ReminderService($resource) {
    var Reminders = $resource('/api/admin/Reminders/:ReminderId', { ReminderId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Reminders, {
    });

    return Reminders;
  }
}());
