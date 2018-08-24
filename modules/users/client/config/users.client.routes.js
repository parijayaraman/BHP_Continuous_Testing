(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('customers.settings', {
        abstract: true,
        url: '/settings',
        templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('customers.settings.profile', {
        url: '/profile',
        templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('customers.settings.password', {
        url: '/password',
        templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('customers.settings.picture', {
        url: '/picture',
        templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.activation', {
        abstract: true,
        url: '/activation',
        template: '<ui-view/>'
      })
      .state('authentication.activation.invalid', {
        url: '/invalid',
        templateUrl: '/modules/users/client/views/authentication/signup-invalid.client.view.html',
        data: {
          pageTitle: 'Signup activation invalid'
        }
      })
      .state('authentication.activation.valid', {
        url: '/valid',
        templateUrl: '/modules/users/client/views/authentication/signup-valid.client.view.html',
        data: {
          pageTitle: 'Signup activation valid'
        }
      })
      .state('authentication.activation.success', {
        url: '/success',
        templateUrl: '/modules/users/client/views/authentication/signup-success.client.view.html',
        data: {
          pageTitle: 'Signup activation success'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.info', {
        url: '/info',
        templateUrl: '/modules/users/client/views/password/reset-password-info.client.view.html',
        data: {
          pageTitle: 'Password reset information'
        }
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      })
      .state('customers.settings.template', {
        url: '/template',
        templateUrl: '/modules/users/client/views/settings/edit-template.client.view.html',
        controller: 'EditTemplateController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Template'
        }
      })
      .state('customers.settings.reminder', {
        url: '/reminder',
        templateUrl: '/modules/users/client/views/settings/edit-reminder.client.view.html',
        controller: 'EditReminderController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reminder'
        }
      })
      .state('customers.settings.subscription', {
        url: '/subscription',
        templateUrl: '/modules/users/client/views/settings/edit-subscription.client.view.html',
        controller: 'EditSubscriptionController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Subscription'
        }
      })
      .state('customers.settings.importFile', {
        url: '/importFile',
        templateUrl: '/modules/users/client/views/settings/import-file.client.view.html',
        controller: 'ImportFileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Import File'
        }
      })
      .state('customers.settings.test', {
        url: '/test',
        templateUrl: '/modules/customers/client/views/payments.client.view.html',
        controller: 'PaymentController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer
        },
        data: {
          pageTitle: 'Settings'
        }
      });
  }

  getCustomer.$inject = ['$stateParams', 'CustomersService'];

  function getCustomer($stateParams, CustomersService) {
    if (!$stateParams.customerId) {
      return false;
    }
    return CustomersService.get({
      customerId: $stateParams.customerId
    }).$promise;
  }
}());
