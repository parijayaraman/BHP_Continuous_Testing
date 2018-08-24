(function() {
  'use strict';

  var changePasswordModule = angular
    .module('users')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'UsersService', 'PasswordValidator', 'Notification', '$mdDialog'];

  function ChangePasswordController($scope, $http, Authentication, UsersService, PasswordValidator, Notification, $mdDialog) {
    var vm = this;

    vm.user = Authentication.user;
    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // Change user password
    function changeUserPassword(isValid) {


      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

        return false;
      }

      UsersService.changePassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      $mdDialog.show({
          controller: 'ChangePasswordSuccessController',
          templateUrl: '/modules/users/client/views/settings/change-password-success.client.view.html',
          clickOutsideToClose: false,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          // $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          // $scope.status = 'You cancelled the dialog.';
        });
    }

    function onChangePasswordError(response) {
      Notification.error({
        message: response.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Password change failed!'
      });
    }
  }


  changePasswordModule.directive("unMatcher", function($timeout) {
    return {
      restrict: "A",

      require: "ngModel",

      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.unMatcher = function(modelValue) {
          return attributes.unMatcher !== modelValue;
        };
      }
    };
  });

  /* changePasswordModule.directive("matcher", function($timeout) {
        return {
            restrict : "A",

            require : "ngModel",

            link : function(scope, element, attributes, ngModel) {
                ngModel.$validators.matcher = function(modelValue) {
                    return attributes.matcher === modelValue;
                };
            }
        };
  }); */

}());