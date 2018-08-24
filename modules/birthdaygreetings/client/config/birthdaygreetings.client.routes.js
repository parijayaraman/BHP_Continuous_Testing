(function () {
  'use strict';

  angular
    .module('birthdaygreetings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('birthdaygreetings', {
        abstract: true,
        url: '/birthdaygreetings',
        template: '<ui-view/>'
      })
      .state('birthdaygreetings.list', {
        url: '',
        templateUrl: 'modules/birthdaygreetings/client/views/list-birthdaygreetings.client.view.html',
        controller: 'BirthdaygreetingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Send Birthday greetings'
        }
      });
  }
}());
