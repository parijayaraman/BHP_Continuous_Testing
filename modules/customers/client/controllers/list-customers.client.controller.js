(function() {
  'use strict';

  var customerModule = angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['$filter', 'filterFilter', '$scope', '$state', '$window', 'CustomersService', '$mdDialog', 'Notification', '$uibModal', '$resource'];

  function CustomersListController($filter, filterFilter, $scope, $state, $window, CustomersService, $mdDialog, Notification, $uibModal, $resource) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    CustomersService.query(function(data) {
      vm.customers = $filter('orderBy')(data, 'firstName');
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      if (vm.currentPage === undefined) {
        vm.currentPage = 1;
      }
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.customers, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    $scope.remove = function(customer, event) {
      $mdDialog.show({
          controller: 'DeleteCustomerController',
          templateUrl: '/modules/customers/client/views/delete-customer.client.view.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
          resolve: {
            customer: function() {
              return customer;
            }
          }
        })
        .then(function(updated) {
          vm.customers.splice(vm.customers.indexOf(customer), 1); // Update the  whole customers
          vm.buildPager();
          Notification.success('Customer deleted successfully!');
        }, function() {});
    };

    $scope.removeSelectedCustomers = function() {
      var selectedCustomers = filterFilter(vm.pagedItems, function(customer) {
        return customer.checked;
      });

      // Show the error message if the customers are not selected.
      if (selectedCustomers.length === 0) {
        Notification.error({
          message: 'Please select the customers.',
          title: '<i class="glyphicon glyphicon-remove"></i> Customer delete error!'
        });
        return false;
      }

      $mdDialog.show({
          controller: 'DeleteCustomerController',
          templateUrl: '/modules/customers/client/views/delete-customer.client.view.html',
          parent: angular.element(document.body),
          targetEvent: null,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
          resolve: {
            customer: function() {
              return selectedCustomers;
            }
          }
        })
        .then(function(deletedCustomers) {
          // vm.customers = filterFilter(vm.customers, function(customer) {
          //   if (!customer.$resolved) {
          //     return customer;
          //   }
          // });     

          angular.forEach(deletedCustomers, function(deletedCustomer) {

            var index = _.findIndex(vm.customers, function(customer) {
              return customer._id == deletedCustomer._id;
            });
            vm.customers.splice(index, 1);
          });

          vm.buildPager();
          Notification.success('Customer deleted successfully!');
        }, function() {});
    };

    $scope.allSelected = false;

    $scope.toggleAll = function() {
      var bool = true;
      if ($scope.allSelected) {
        bool = false;
      }
      angular.forEach(vm.pagedItems, function(v, k) {
        v.checked = bool;
        $scope.allSelected = !bool;
      });
    };

    $scope.cbChecked = function() {
      $scope.allSelected = true;
      angular.forEach(vm.pagedItems, function(v, k) {
        if (!v.checked) {
          $scope.allSelected = false;
        }
      });
    };
  }
}());