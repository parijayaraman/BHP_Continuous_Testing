(function() {
  'use strict';

  var customerModule = angular
    .module('customers')
    .controller('BirthdayCustomersListController', BirthdayCustomersListController);

  BirthdayCustomersListController.$inject = ['Authentication', '$filter', '$scope', '$state', '$window', 'CustomersService', 'Notification', '$uibModal', '$resource'];

  function BirthdayCustomersListController(Authentication, $filter, $scope, $state, $window, CustomersService, Notification, $uibModal, $resource) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    CustomersService.query(function(data) {
      vm.customers = data;

      vm.customers.forEach(function(data) {

        data.fromNow = getDateDiff(data.dob);
        if (data.emailSentDate != null) {
          data.checkEmailSentDate = getDateDiff(data.emailSentDate);

          if (data.checkEmailSentDate === 0 && data.emailSent) {
            data.enableTick = true;
          }
        }

        if (data.fromNow === 0 && data.emailSent) {
          data.enableTick = true;
        }

      });
      vm.buildPager();
    });

    function getDateDiff(date) {
      var date = $filter('date')(date, 'yyyy-MM-dd');
      var day = date.split('-');
      var currentYear = new Date().getFullYear();
      var targetDate = new Date(currentYear, day[1] - 1, day[2]);
      var today = new Date();
      var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (targetDate.valueOf() < todayDate.valueOf()) {
        targetDate.setFullYear(currentYear + 1);
      }

      return targetDate.valueOf() - todayDate.valueOf();

    }

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.customers, {
        $: vm.search
      });
      vm.pagedItems = vm.filteredItems;
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    $scope.remove = function(customer) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modules/customers/client/views/delete-customer.client.view.html',
        controller: 'DeleteCustomerController',
        // size: 'sm',
        resolve: {
          customer: function() {
            return customer;
          }
        }
      });

      modalInstance.result.then(function(updated) {
        vm.pagedItems.splice(vm.pagedItems.indexOf(customer), 1); // Update the list view.
        Notification.success('Customer deleted successfully!');
      });
    };

  }

  // TODO: Need to move it to a directive package
  customerModule.directive('customSort', function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        order: '=',
        sort: '='
      },
      template: ' <a ng-click="sort_by(order)" style="color: #555555; cursor:pointer">' +
        '    <span ng-transclude></span>' +
        '    <i ng-class="selectedCls(order)"></i>' +
        '</a>',
      link: function(scope) {
        // change sorting order
        scope.sort_by = function(newSortingOrder) {
          var sort = scope.sort;

          if (sort.sortingOrder === newSortingOrder) {
            sort.reverse = !sort.reverse;
          }
          sort.sortingOrder = newSortingOrder;
        };

        scope.selectedCls = function(column) {
          if (column === scope.sort.sortingOrder) {
            return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
          } else {
            return 'icon-sort';
          }
        };
      } // end link
    };
  });
}());