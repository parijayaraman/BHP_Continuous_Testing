(function() {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.isButtonLoading = false;
    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      // $location.path('/');
      if (vm.authentication.user.roles.indexOf('admin') !== -1) {
        // And redirect to the previous or home page
        $state.go('admin.dashboard.home');
      } else {
        // $state.go('customers.list');
        $state.go('customers.birthdaylist');
      }
    }

    function signup(isValid) {
      vm.isButtonLoading = true;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin(isValid) {
      vm.isButtonLoading = true;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      vm.isButtonLoading = false;
      //   vm.credentials = null;
      // Notification.success({ message: response.message, title: '<i class="glyphicon glyphicon-ok"></i> Signup successful!.' });
      $state.go('authentication.activation.valid');
    }

    function onUserSignupError(response) {
      vm.isButtonLoading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Sign-Up Error !', delay: 10000 });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.success({ message: 'Welcome ' + response.firstName });
      // $state.go($state.previous.state.name || 'home', $state.previous.params);
      if (vm.authentication.user.roles.indexOf('admin') !== -1) {
        // And redirect to the previous or home page
        $state.go('admin.dashboard.home');
      } else {
        // if ($state.previous.href === '/') {
        $state.go('customers.birthdaylist');
        // } else {
        //   $window.location.href = $state.previous.href; // Go to the previous state
        // }
      }
    }

    function onUserSigninError(response) {
      vm.isButtonLoading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i>Sign-in error!', delay: 10000 });
    }
  }
}());
