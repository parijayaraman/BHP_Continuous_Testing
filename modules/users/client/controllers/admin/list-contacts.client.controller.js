(function() {
  'use strict';

  angular
    .module('users.admin')
    .controller('ContactsListController', ContactsListController);

  ContactsListController.$inject = ['$scope', '$filter', '$window', '$state', 'getContactsResolve', 'ContactsService', 'Notification'];

  function ContactsListController($scope, $filter, $window, $state, contacts, ContactsService, Notification) {
    var vm = this;
    vm.remove = remove;
    vm.contacts = contacts;

    // Remove existing contact
    function remove(contact) {
      if ($window.confirm('Are you sure you want to delete?')) {
        contact.$remove(successCallback, errorCallback);
      }


      function successCallback(res) {
        var index = _.findIndex(vm.contacts, function(o) {
          return o._id == res._id;
        });
        vm.contacts.splice(index, 1);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Profile Saved!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Customer create or update error!'
        });
      }

    }
  }
}());