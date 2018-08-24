(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('GreetingtemplatesListController', GreetingtemplatesListController);

  GreetingtemplatesListController.$inject = ['GreetingtemplatesService'];

  function GreetingtemplatesListController(GreetingtemplatesService) {
    var vm = this;
    GreetingtemplatesService.query(function (data) {
      vm.greetingtemplates = data;
    });
  }
}());
