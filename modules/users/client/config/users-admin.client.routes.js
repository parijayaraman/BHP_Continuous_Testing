(function() {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.dashboard', {
        // abstract: true,
        url: '/dashboard',
        templateUrl: '/modules/users/client/views/admin/admin.client.view.html',
        controller: 'AdminDashboardController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: dashboardData
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.dashboard.home', {
        url: '/home',
        templateUrl: '/modules/users/client/views/admin/dashboard.client.view.html',
        controller: 'AdminDashboardController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: dashboardData
        },
        data: {
          pageTitle: 'Dashboard'
        }
      })
      .state('admin.dashboard.users', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Users List'
        }
      })
      .state('admin.dashboard.user', {
        url: '/users/:userId',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'Edit {{ userResolve.displayName }}'
        }
      })
      .state('admin.dashboard.user-create', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: newUser
        },
        data: {
          //  roles: ['user'],
          pageTitle: 'Professional Create'
        }
      })
      .state('admin.dashboard.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'Edit User {{ userResolve.displayName }}'
        }
      })
      // .state('admin.templates', {
      //   url: '/templates',
      //   templateUrl: '/modules/users/client/views/admin/templates.client.view.html',
      //   controller: 'TemplatesController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     templatesResolve: getTemplates
      //   },
      //   data: {
      //     roles: ['admin'],
      //     pageTitle: 'Templates'
      //   }
      // })

      .state('admin.dashboard.greetingtemplates', {
        url: '/greetingtemplates',
        templateUrl: '/modules/users/client/views/admin/list-greetingtemplates.client.view.html',
        controller: 'GreetingtemplatesListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: 'Greetingtemplates List'
        }
      })
      .state('admin.dashboard.greetingtemplate', {
        url: '/greetingtemplates/:greetingtemplateId',
        templateUrl: '/modules/users/client/views/admin/form-greetingtemplate.client.view.html',
        controller: 'GreetingtemplatesController',
        controllerAs: 'vm',
        resolve: {
          greetingtemplateResolve: getGreetingTemplates
        },
        data: {
          pageTitle: 'Edit {{ greetingTemplateResolve.name }}'
        }
      }).state('admin.dashboard.createTemplate', {
        url: '/greetingtemplates',
        templateUrl: '/modules/users/client/views/admin/form-greetingtemplate.client.view.html',
        controller: 'GreetingtemplatesController',
        controllerAs: 'vm',
        resolve: {
          greetingtemplateResolve: newGreetingTemplates
        },
        data: {
          pageTitle: 'Create Template'
        }
      }).state('admin.dashboard.subscriptions', {
        url: '/subscriptions',
        templateUrl: '/modules/users/client/views/admin/list-admin-subscriptionCharge.client.view.html',
        controller: 'AdminSubscriptionListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: 'sub List'
        }
      }).state('admin.dashboard.subscription-edit', {
        url: '/subscriptions/:subscriptionId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-admin-subscriptionCharge.client.view.html',
        controller: 'AdminEditSubscriptionController',
        controllerAs: 'vm',
        resolve: {
          subscriptionResolve: getSubscriptionCharge
        },
        data: {
          roles: ['admin'],
          pageTitle: 'sub List'
        }
      }).state('admin.dashboard.contacts', {
        url: '/contacts',
        templateUrl: '/modules/users/client/views/admin/list-contacts.client.view.html',
        controller: 'ContactsListController',
        controllerAs: 'vm',
        resolve: {
          getContactsResolve: getContacts
        },
        data: {
          pageTitle: 'Contacts'
        }
      });


    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      console.log($stateParams.userId);
      return AdminService.get({
        userId: $stateParams.userId
      }).$promise;
    }

    getGreetingTemplates.$inject = ['$stateParams', 'GreetingtemplatesService'];

    function getGreetingTemplates($stateParams, GreetingtemplatesService) {
      return GreetingtemplatesService.get({
        greetingtemplateId: $stateParams.greetingtemplateId
      }).$promise;
    }

    dashboardData.$inject = ['DashboardService'];

    function dashboardData(DashboardService) {
      return DashboardService.get({}).$promise;
    }

    newGreetingTemplates.$inject = ['GreetingtemplatesService'];

    function newGreetingTemplates(GreetingtemplatesService) {
      return new GreetingtemplatesService();
    }

    newUser.$inject = ['AdminService'];

    function newUser(AdminService) {
      return new AdminService();
    }

    getSubscriptionCharge.$inject = ['$stateParams', 'SubscriptionChargesService'];


    function getSubscriptionCharge($stateParams, SubscriptionChargesService) {
      return SubscriptionChargesService.query({
        id: $stateParams.subscriptionId
      }).$promise;
    }


    getContacts.$inject = ['$stateParams', 'ContactsService'];


    function getContacts($stateParams, ContactsService) {
      return ContactsService.get({}).$promise;
    }

  }
}());