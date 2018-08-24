(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', 'Authentication'];

  function HomeController($state, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    // If user is signed in then redirect back home
    // if (vm.authentication.user) {
    //   if (vm.authentication.user.roles.indexOf('admin') !== -1) {
    //     // And redirect to the previous or home page
    //     $state.go('admin.dashboard.home');
    //   } else {
    //     $state.go('customers.birthdaylist');
    //   }
    // }
  }
}());
