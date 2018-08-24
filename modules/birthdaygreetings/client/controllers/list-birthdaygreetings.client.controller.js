(function () {
  'use strict';

  angular
    .module('birthdaygreetings')
    .controller('BirthdaygreetingsListController', BirthdaygreetingsListController);

  BirthdaygreetingsListController.$inject = ['BirthdaygreetingsService'];

  function BirthdaygreetingsListController(BirthdaygreetingsService) {
    var vm = this;

    vm.birthdaygreetings = BirthdaygreetingsService.query();
  }
}());
