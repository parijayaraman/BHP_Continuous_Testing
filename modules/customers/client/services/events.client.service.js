(function () {
  'use strict';

  angular
    .module('customers.services')
    .factory('EventsService', EventsService);

  EventsService.$inject = ['$resource'];

  function EventsService($resource) {
    var events = $resource('/api/events/', {}, {
      // getEventsByDateAndMonth: {
      //   method: 'GET',
      //   url: '/api/events/:date/:month',
      //   isArray: true,
      //   params: {
      //     date: '@date',
      //     month: '@month'
      //   }
      // },
      getPeaksByYear: {
        method: 'GET',
        url: '/api/events/:year',
        params: {
          year: '@year'
        }
      }
    });

    angular.extend(events, {
      requestEvents: function (date, month) {
        return this.getEventsByDateAndMonth({ date: date, month: month }).$promise;
      },
      requestPeaks: function (year) {
        return this.getPeaksByYear({ year: year }).$promise;
      }
    });

    return events;
  }
}());
