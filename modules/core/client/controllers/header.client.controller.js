(function() {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$location', '$window', '$scope', '$state', 'Authentication', 'menuService', '$mdDialog'];

  function HeaderController($location, $window, $scope, $state, Authentication, menuService, $mdDialog) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.redirectToHome = redirectToHome;
    vm.logout = logout;

    var url = window.location.href;


//    var found = url.includes('reset') || url.includes('success') || url.includes('greetings'); // IE 11 doesn't support
    var found = window.location.hash.indexOf("reset") >= 0 || window.location.hash.indexOf("success") >= 0 || window.location.hash.indexOf("greetings") >= 0
    if ($state.current.name === '' && !found) {
      redirectToHome();
    }

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    function redirectToHome() {
      // If user is signed in then redirect back home
      if (vm.authentication.user) {
        if (vm.authentication.user.roles.indexOf('admin') !== -1) {
          // And redirect to the previous or home page
          // $state.go('admin.dashboard.home');
          $state.transitionTo('admin.dashboard.home', {}, {
            reload: true,
            inherit: false,
            notify: true
          });
        } else {
          // $state.go('customers.birthdaylist');
          $state.transitionTo('customers.birthdaylist', {}, {
            reload: true,
            inherit: false,
            notify: true
          });
        }
      }
    }

    $scope.goto = function(page) {
      // var baseURL = new $window.URL($location.absUrl()).origin; // IE 11 doesn't support
      var baseURL = $location.$$absUrl.replace($location.$$url, '');


      if ((page == "home" || page == "feature" || page == "samples" || page == "pricing" || page == "about" || page == "contact") &&
        ($location.absUrl() == baseURL + "/authentication/signin" || $location.absUrl() == baseURL + "/authentication/signup" || $location.absUrl() == baseURL + "/password/forgot")) {

        $window.location.href = baseURL;

      } else if (page == "authentication.signin" || page == "authentication.signup" || page == "password.forgot") {
        $state.go(page);
      }

    };

    // Dynamically Set the active class for all the menus
    $scope.isActive = function(viewLocation) {
      var urlLocation = window.location.hash ? window.location.href.substr(window.location.href.lastIndexOf('#') + 1) : window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

      if (urlLocation.indexOf('#') > -1) {
        urlLocation = urlLocation.replace('#', '');
      }

      var active = (viewLocation === urlLocation);
      return active;
    };

    function logout(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      $mdDialog.show({
          controller: 'LogoutController',
          templateUrl: '/modules/core/client/views/logout.client.view.html',
          //  parent: angular.element(document.body),
          //  targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
          resolve: {
            user: function() {
              return vm.authentication.user;
            }
          }
        })
        .then(function(data) {}, function() {});
    }

    $scope.help = function() {
      $mdDialog.show({
          controller: 'HelpStepController',
          templateUrl: '/modules/core/client/views/help-step.client.view.html',
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
          resolve: {
            user: function() {
              return vm.authentication.user;
            }
          }
        })
        .then(function(data) {}, function() {});
    };


  }
}());