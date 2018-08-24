// contacts related service

(function() {
  'use strict';

  angular
    .module('users.services')
    .factory('ContactsService', ContactsService);

  ContactsService.$inject = ['$resource'];

  function ContactsService($resource) {
    var Contacts = $resource('/api/contact/:contactId', {
      contactId: '@_id'
    }, {
      get: {
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'POST'
      }
    });

    angular.extend(Contacts, {});

    return Contacts;
  }
}());