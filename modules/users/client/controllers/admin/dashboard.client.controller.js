(function () {
  'use strict';

  // Customers controller
  angular
    .module('users.admin')
    .controller('AdminDashboardController', AdminDashboardController);

  AdminDashboardController.$inject = ['dashboardResolve', '$scope', '$state', 'Authentication', '$timeout'];

  function AdminDashboardController (dashboard, $scope, $state, Authentication, $timeout) {
    var vm = this;
    vm.authentication = Authentication;
    vm.data = dashboard; // DaTA FOR DASHBOARD
    $scope.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.series = ['Emails sent'];
    $scope.monthData = [
      [65, 59, 80, 81, 56, 55, 40, 20, 30, 54, 23, 87]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
    };

    $scope.weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $scope.weekData = [10, 20, 15, 25, 35, 30, 5];

  }
}());
