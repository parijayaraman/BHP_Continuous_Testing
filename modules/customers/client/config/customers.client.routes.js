(function () {
  'use strict';

  angular
    .module('customers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('customers', {
        abstract: true,
        url: '/customers',
        templateUrl: '/modules/customers/client/views/customers.client.view.html',
        controller: 'BirthdayCustomersListController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        }
      })
      .state('customers.birthdaylist', {
        url: '/birthdaylist',
        templateUrl: '/modules/customers/client/views/list-birthday-customers.client.view.html',
        controller: 'BirthdayCustomersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customers List'
        }
      })
      .state('customers.list', {
        url: '/list',
        templateUrl: '/modules/customers/client/views/list-customers.client.view.html',
        controller: 'CustomersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customers List'
        }
      })
      .state('customers.create', {
        url: '/create',
        templateUrl: '/modules/customers/client/views/form-customer.client.view.html',
        controller: 'CustomersController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: newCustomer,
          subscriptionResolve: getSubscription,
          templatesResolve: getTemplates
        },
        data: {
          roles: ['user'],
          pageTitle: 'Customers Create'
        }
      })
      .state('customers.edit', {
        url: '/:customerId/edit',
        templateUrl: '/modules/customers/client/views/form-customer.client.view.html',
        controller: 'CustomersController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer,
          subscriptionResolve: getSubscription,
          templatesResolve: getTemplates
        },
        data: {
          roles: ['user'],
          pageTitle: 'Edit customer {{ customerResolve.name }}'
        }
      })
      .state('customers.view', {
        url: '/:customerId',
        templateUrl: 'modules/customers/client/views/view-customer.client.view.html',
        controller: 'CustomersController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer,
          subscriptionResolve: getSubscription,
          templatesResolve: getTemplates
        },
        data: {
          pageTitle: 'Customer {{ customerResolve.name }}'
        }
      })
      .state('customers.greetings', {
        url: '/:customerId/greetings',
        templateUrl: '/modules/customers/client/views/email-customer.client.view.html',
        controller: 'CustomersController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer,
          subscriptionResolve: getSubscription,
          templatesResolve: getTemplates
        },
        data: {
          roles: ['user'],
          pageTitle: 'Send Email to {{ customerResolve.name }}'
        }
      })
      .state('customers.checkout', {
        url: '/:customerId/checkout',
        templateUrl: '/modules/customers/client/views/payments.client.view.html',
        controller: 'PaymentController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          pageTitle: 'Payment to {{ customerResolve.name }}'
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

  newCustomer.$inject = ['CustomersService'];

  function newCustomer(CustomersService) {
    return new CustomersService();
  }

  getSubscription.$inject = ['Authentication', 'SubscriptionService'];

  function getSubscription(Authentication, SubscriptionService) {
    return SubscriptionService.get({
      profId: Authentication.user._id
    }).$promise;
  }

  getTemplates.$inject = ['Authentication', 'TemplateService'];

  function getTemplates(Authentication, TemplateService) {
    return TemplateService.query();
  }

}());
