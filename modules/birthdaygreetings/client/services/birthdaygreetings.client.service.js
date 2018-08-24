// Birthdaygreetings service used to communicate Birthdaygreetings REST endpoints
(function () {
  'use strict';

  angular
    .module('birthdaygreetings')
    .factory('BirthdaygreetingsService', BirthdaygreetingsService);

  BirthdaygreetingsService.$inject = ['$resource'];

  function BirthdaygreetingsService($resource) {
    return $resource('api/birthdaygreetings/:birthdaygreetingId', {
      birthdaygreetingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
