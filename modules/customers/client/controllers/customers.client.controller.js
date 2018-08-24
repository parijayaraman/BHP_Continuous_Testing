(function() {
  'use strict';

  // Customers controller
  var customerModule = angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$filter', '$location', '$scope', '$state', '$window', 'Authentication', 'customerResolve', 'CustomersService', 'EventsService', 'subscriptionResolve', 'templatesResolve', 'Notification', 'textAngularManager', '$templateRequest', '$sce', '$uibModal'];

  function CustomersController($filter, $location, $scope, $state, $window, Authentication, customer, CustomersService, EventsService, subscription, templates, Notification, textAngularManager, $templateRequest, $sce, $uibModal) {
    var vm = this;
    vm.authentication = Authentication;
    vm.customer = customer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.askForSendEmailTemplate = askForSendEmailTemplate;
    vm.loadModal = loadModal;
    vm.getTemplate = getTemplate;
    vm.emailTemplate = '';
    vm.myDate = new Date();
    vm.isCreateOrUpdate = false;

    if (vm.customer.firstName !== undefined && vm.customer.lastName !== undefined) {
      vm.customer.subject = 'Happy Birthday ' + vm.customer.firstName.charAt(0).toUpperCase() + vm.customer.firstName.slice(1) + ' ' + vm.customer.lastName.charAt(0).toUpperCase() + vm.customer.lastName.slice(1) + '!';
    }

    vm.maxDate = new Date(2000, 11, 31);
    vm.minDate = new Date(1915, 11, 32);

    vm.subscriptionStatus = subscription[1].status;

    if ($state.current.name === 'customers.greetings') {
      templates.$promise.then(function(data) { // Load the templates only if its resolved.
        vm.templates = data;
        vm.getTemplate();
      });
    }

    // Create the datetimepicker for the DOB
    // $scope.today = function() {
    //   $scope.dt = new Date();
    // };
    // $scope.today();

    // $scope.inlineOptions = {
    //   customClass: getDayClass,
    //   minDate: new Date(),
    //   showWeeks: true
    // };

    // $scope.dateOptions = {
    //   //   dateDisabled: disabled,
    //   formatYear: 'yy',
    //   maxDate: new Date(2020, 5, 22),
    //   minDate: new Date(),
    //   startingDay: 1
    // };

    // function disabled(data) { // Disable weekend selection
    //   var date = data.date;
    //   var mode = data.mode;
    //   return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    // }

    // $scope.toggleMin = function() {
    //   $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    //   $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    // };

    // $scope.toggleMin();

    // $scope.openDatetimePicker = function() {
    //   $scope.datetimePicker.opened = true;
    // };

    // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    // $scope.format = $scope.formats[0];
    // $scope.altInputFormats = ['M!/d!/yyyy'];

    // $scope.datetimePicker = {
    //   opened: false
    // };

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    }

    // Remove existing Customer
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.customer.$remove($state.go('customers.list'));
      }
    }

    function getTimeToServer(date) {
      var dt = (new Date(date)).setHours(0, 0, 0, 0);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    }

    // Save Customer
    function save(isValid) {
      vm.isCreateOrUpdate = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }
      vm.customer.dob = getTimeToServer(vm.customer.dob);
      vm.customer.date = new Date(vm.customer.dob).getDate();
      vm.customer.month = new Date(vm.customer.dob).getMonth() + 1;
      vm.customer.year = new Date(vm.customer.dob).getFullYear();

      if (vm.customer._id) {
        vm.customer.$update(successCallback, errorCallback);
      } else {
        vm.customer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.isCreateOrUpdate = false;
        $state.go('customers.list', {
          customerId: res._id
        });
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Profile Saved!'
        });
      }

      function errorCallback(res) {
        vm.isCreateOrUpdate = false;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Customer create or update error!'
        });
      }
    }

    function loadModal(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/modules/customers/client/views/form-subscription.client.view.html',
        controller: 'ConfirmSubscriptionController',
        size: 'lg',
        resolve: {
          customer: function() {
            return vm.customer;
          }
        }
      });
    }

    // Submit email template to the customer
    function askForSendEmailTemplate(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }

      vm.customer.professional = vm.authentication.user.displayName;
      vm.customer.customerName = vm.customer.firstName;

      // Open the subscription dialog if user's subscription expired.
      if (vm.subscriptionStatus === 'no' || vm.subscriptionStatus === 'expired') {
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '/modules/customers/client/views/payments.client.view.html',
          controller: 'PaymentController',
          backdrop: 'static',
          resolve: {
            customer: function() {
              return vm.customer;
            }
          }
        });
        return false;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '/modules/customers/client/views/paid-result.client.view.html',
        controller: 'PaidEmailController',
        backdrop: 'static',
        resolve: {
          customer: function() {
            return vm.customer;
          }
        }
      });

    }

    // Email template Callbacks
    function onRequestTemplateSuccess(response) {
      // Show user success message and clear form
      Notification.success({
        message: response.message,
        title: '<i class="glyphicon glyphicon-ok"></i> Email template has sent successfully!'
      });
      $state.go('customers.birthdaylist');
    }

    function onRequestTemplateError(response) {
      // Show user error message and clear form
      Notification.error({
        message: response.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to send email template',
        delay: 4000
      });
    }

    // WYSIWYG editor preview
    $scope.disabled = false;
    if (vm.subscriptionStatus === 'no' || vm.subscriptionStatus === 'expired') {
      // vm.customer.email = '';
      $scope.disabled = false
    }

    var templateUrl;

    function getTemplate() {
      var firstName = vm.customer.firstName;
      var lastName = vm.customer.lastName;
      if (vm.customer.template === undefined) {
        // Set the selected defaultTemplate
        $scope.defaultTemplate = $filter('filter')(vm.templates, {
          $: vm.authentication.user.defaultTemplate
        });
        vm.customer.template = $scope.defaultTemplate[0];
      }

      if (vm.customer.template !== null && vm.customer.template !== undefined) {
        vm.emailTemplate = vm.customer.template.content;
        vm.emailTemplate = vm.emailTemplate.toString().replace(/TAG_CUSTOMER_FIRST_NAME/g, firstName.charAt(0).toUpperCase() + firstName.slice(1)).replace(/TAG_CUSTOMER_LAST_NAME/g, lastName.charAt(0).toUpperCase() + lastName.slice(1));
        EventsService.requestPeaks(vm.customer.year)
          .then(onPeakSuccessSuccess);
      } else {
        vm.customer.htmlcontent = null;
      }
    }

    function onPeakSuccessSuccess(response) {
      var year = response.year;
      var peaks = response.peaks;
      var events = response.events;
      var baseURL = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;

      var peaks_default = {
        president: 'N/A',
        vicePresident: 'N/A',
        sp500: 'N/A',
        gainTo: 'N/A',
        gallonOfMilk: 'N/A',
        loafOfBread: 'N/A',
        gallonOfGas: 'N/A',
        newHome: 'N/A',
        newCar: 'N/A',
        wages: "N/A",
        baseball: 'N/A',
        superbowl: 'N/A',
        popularGirl: 'N/A',
        popularBoy: "N/A",
        popularMovie: 'N/A',
        popularActor: 'N/A',
        popularActress: 'N/A',
        populartvShow: 'N/A',
        timePerson: 'N/A',
        chineseYear: 'N/A',
        hipHopMusic: 'N/A',
        popMusic: 'N/A',
        actors_image: "/images/actors/default.png",
        actresses_image: "/images/actresses/default.jpg",
        movies_image: "/images/movies/default.jpg",
        presidents_image: "/images/presidents/default.png",
        vice_presidents_image: "/images/vice_presidents/default.png",
        time_persons_image: "/images/time_persons/default.png",
        cars_image: "/images/cars/default.jpg",
        gas_image: "/images/gas/gallon_of_gas.jpg",
        bread_image: "/images/bread/bread_loaf.jpg",
        milk_image: "/images/milk/quart_of_milk.jpg",
        sp500_chart_path: "images/sp/default.png"
      };

      var events_default = [{
        eventId: 1,
        event: "N/A",
        event_image: "/images/events/default.png"
      }, {
        eventId: 2,
        event: "N/A",
        event_image: "/images/events/default.png"
      }, {
        eventId: 3,
        event: "N/A",
        event_image: "/images/events/default.png"
      }, {
        eventId: 4,
        event: "N/A",
        event_image: "/images/events/default.png"
      }];
      
    
      var emailTemplate = vm.emailTemplate.toString();
      var month = new Date(vm.customer.dob).toString().split(" ")[1];
      var date = new Date(vm.customer.dob).toString().split(" ")[2];
      emailTemplate = emailTemplate.replace(/TAG_MONTH/g, month);
      emailTemplate = emailTemplate.replace(/TAG_DATE/g, date);
      emailTemplate = year ? emailTemplate.replace(/TAG_YEAR/g, year) : emailTemplate.replace(/TAG_YEAR/g, year);

      emailTemplate = peaks.actors_image != "" ? emailTemplate.replace(/TAG_ACTOR_IMAGE/g, baseURL + peaks.actors_image) : emailTemplate.replace(/TAG_ACTOR_IMAGE/g, baseURL + peaks_default.actors_image);
      emailTemplate = peaks.actresses_image != "" ? emailTemplate.replace(/TAG_ACTRESS_IMAGE/g, baseURL + peaks.actresses_image) : emailTemplate.replace(/TAG_ACTRESS_IMAGE/g, baseURL + peaks_default.actresses_image);
      emailTemplate = peaks.movies_image != "" ? emailTemplate.replace(/TAG_MOVIE_IMAGE/g, baseURL + peaks.movies_image) : emailTemplate.replace(/TAG_MOVIE_IMAGE/g, baseURL + peaks_default.movies_image);
      emailTemplate = peaks.presidents_image != "" ? emailTemplate.replace(/TAG_PRESIDENT_IMAGE/g, baseURL + peaks.presidents_image) : emailTemplate.replace(/TAG_PRESIDENT_IMAGE/g, baseURL + peaks_default.presidents_image);
      emailTemplate = peaks.vice_presidents_image != "" ? emailTemplate.replace(/TAG_VICE_PRESIDENT_IMAGE/g, baseURL + peaks.vice_presidents_image) : emailTemplate.replace(/TAG_VICE_PRESIDENT_IMAGE/g, baseURL + peaks_default.vice_presidents_image);
      emailTemplate = peaks.time_persons_image != "" ? emailTemplate.replace(/TAG_TIME_PERSON_IMAGE/g, baseURL + peaks.time_persons_image) : emailTemplate.replace(/TAG_TIME_PERSON_IMAGE/g, baseURL + peaks_default.time_persons_image);
      emailTemplate = peaks.cars_image != "" ? emailTemplate.replace(/TAG_CAR_IMAGE/g, baseURL + peaks.cars_image) : emailTemplate.replace(/TAG_CAR_IMAGE/g, baseURL + peaks_default.cars_image);
      emailTemplate = peaks.gas_image != "" ? emailTemplate.replace(/TAG_GAS_IMAGE/g, baseURL + peaks.gas_image) : emailTemplate.replace(/TAG_GAS_IMAGE/g, baseURL + peaks_default.gas_image);
      emailTemplate = peaks.bread_image != "" ? emailTemplate.replace(/TAG_BREAD_IMAGE/g, baseURL + peaks.bread_image) : emailTemplate.replace(/TAG_BREAD_IMAGE/g, baseURL + peaks_default.bread_image);
      emailTemplate = peaks.milk_image != "" ? emailTemplate.replace(/TAG_MILK_IMAGE/g, baseURL + peaks.milk_image) : emailTemplate.replace(/TAG_MILK_IMAGE/g, baseURL + peaks_default.milk_image);
      emailTemplate = peaks.milk_image != "" ? emailTemplate.replace(/TAG_SPCHART_IMAGE/g, baseURL + peaks.sp500_chart_path) : emailTemplate.replace(/TAG_SPCHART_IMAGE/g, baseURL + peaks_default.sp500_chart_path);

      emailTemplate = peaks.president != "" ? emailTemplate.replace(/TAG_PRESIDENT/g, peaks.president) : emailTemplate.replace(/TAG_PRESIDENT/g, peaks_default.president);
      emailTemplate = peaks.vicePresident != "" ? emailTemplate.replace(/TAG_VICE_PRESIDENT/g, peaks.vicePresident) : emailTemplate.replace(/TAG_VICE_PRESIDENT/g, peaks_default.vicePresident);
      emailTemplate = peaks.sp500 != "" ? emailTemplate.replace(/TAG_SP/g, peaks.sp500) : emailTemplate.replace(/TAG_SP/g, peaks_default.sp500);
      emailTemplate = peaks.gainTo != "" ? emailTemplate.replace(/TAG_GAINTO/g, peaks.gainTo) : emailTemplate.replace(/TAG_GAINTO/g, peaks_default.gainTo);
      emailTemplate = peaks.gallonOfMilk != "" ? emailTemplate.replace(/TAG_GALLON_OF_MILK/g, "$" + peaks.gallonOfMilk) : emailTemplate.replace(/TAG_GALLON_OF_MILK/g, peaks_default.gallonOfMilk);
      emailTemplate = peaks.loafOfBread != "" ? emailTemplate.replace(/TAG_LOAF_OF_BREAD/g, "$" + peaks.loafOfBread) : emailTemplate.replace(/TAG_LOAF_OF_BREAD/g, peaks_default.loafOfBread);
      emailTemplate = peaks.gallonOfGas != "" ? emailTemplate.replace(/TAG_GALLON_OF_GAS/g, "$" + peaks.gallonOfGas) : emailTemplate.replace(/TAG_GALLON_OF_GAS/g, peaks_default.gallonOfGas);
      emailTemplate = peaks.newHome != "" ? emailTemplate.replace(/TAG_NEW_HOME/g, peaks.newHome) : emailTemplate.replace(/TAG_NEW_HOME/g, peaks_default.newHome);
      emailTemplate = peaks.newCar != "" ? emailTemplate.replace(/TAG_NEW_CAR/g, peaks.newCar) : emailTemplate.replace(/TAG_NEW_CAR/g, peaks_default.newCar);
      emailTemplate = peaks.wages != "" ? emailTemplate.replace(/TAG_WAGES/g, peaks.wages) : emailTemplate.replace(/TAG_WAGES/g, peaks_default.wages);
      emailTemplate = peaks.baseball != "" ? emailTemplate.replace(/TAG_WORLD_SERIES_WINNER/g, peaks.baseball) : emailTemplate.replace(/TAG_WORLD_SERIES_WINNER/g, peaks_default.baseball);
      emailTemplate = peaks.superbowl != "" ? emailTemplate.replace(/TAG_SUPERBOWL_WINNER/g, peaks.superbowl) : emailTemplate.replace(/TAG_SUPERBOWL_WINNER/g, peaks_default.superbowl);
      emailTemplate = peaks.popularGirl != "" ? emailTemplate.replace(/TAG_POPULAR_GIRL/g, peaks.popularGirl) : emailTemplate.replace(/TAG_POPULAR_GIRL/g, peaks_default.popularGirl);
      emailTemplate = peaks.popularBoy != "" ? emailTemplate.replace(/TAG_POPULAR_BOY/g, peaks.popularBoy) : emailTemplate.replace(/TAG_POPULAR_BOY/g, peaks_default.popularBoy);
      emailTemplate = peaks.popularMovie != "" ? emailTemplate.replace(/TAG_MOVIE/g, peaks.popularMovie) : emailTemplate.replace(/TAG_MOVIE/g, peaks_default.popularMovie);
      emailTemplate = peaks.popularActor != "" ? emailTemplate.replace(/TAG_ACTOR/g, peaks.popularActor) : emailTemplate.replace(/TAG_ACTOR/g, peaks_default.popularActor);
      emailTemplate = peaks.popularActress != "" ? emailTemplate.replace(/TAG_ACTRESS/g, peaks.popularActress) : emailTemplate.replace(/TAG_ACTRESS/g, peaks_default.popularActress);
      emailTemplate = peaks.populartvShow != "" ? emailTemplate.replace(/TAG_POPULAR_TV_SHOW/g, peaks.populartvShow) : emailTemplate.replace(/TAG_POPULAR_TV_SHOW/g, peaks_default.populartvShow);
      emailTemplate = peaks.timePerson != "" ? emailTemplate.replace(/TAG_TIME_PERSON_OF_THE_YEAR/g, peaks.timePerson) : emailTemplate.replace(/TAG_TIME_PERSON_OF_THE_YEAR/g, peaks_default.timePerson);
      emailTemplate = peaks.chineseYear != "" ? emailTemplate.replace(/TAG_CHINESE_YEAR/g, peaks.chineseYear) : emailTemplate.replace(/TAG_CHINESE_YEAR/g, peaks_default.chineseYear);
      emailTemplate = peaks.hipHopMusic != "" ? emailTemplate.replace(/TAG_HIP_HOP_SONG/g, peaks.hipHopMusic) : emailTemplate.replace(/TAG_HIP_HOP_SONG/g, peaks_default.hipHopMusic);
      emailTemplate = peaks.popMusic != "" ? emailTemplate.replace(/TAG_POP_SONG/g, peaks.popMusic) : emailTemplate.replace(/TAG_POP_SONG/g, peaks_default.popMusic);

      emailTemplate = events[0].event_image != "" ? emailTemplate.replace(/TAG_EVENT1_IMAGE/g, baseURL + events[0].event_image) : emailTemplate.replace(/TAG_EVENT1_IMAGE/g, baseURL + events_default[0].event_image);
      emailTemplate = events[1].event_image != "" ? emailTemplate.replace(/TAG_EVENT2_IMAGE/g, baseURL + events[1].event_image) : emailTemplate.replace(/TAG_EVENT2_IMAGE/g, baseURL + events_default[1].event_image);
      emailTemplate = events[2].event_image != "" ? emailTemplate.replace(/TAG_EVENT3_IMAGE/g, baseURL + events[2].event_image) : emailTemplate.replace(/TAG_EVENT3_IMAGE/g, baseURL + events_default[2].event_image);
      emailTemplate = events[3].event_image != "" ? emailTemplate.replace(/TAG_EVENT4_IMAGE/g, baseURL + events[3].event_image) : emailTemplate.replace(/TAG_EVENT4_IMAGE/g, baseURL + events_default[3].event_image);

      emailTemplate = events[0].event != "" ? emailTemplate.replace(/TAG_INCIDENT1/g, events[0].event) : emailTemplate.replace(/TAG_INCIDENT1/g, events_default[0].event);
      emailTemplate = events[1].event != "" ? emailTemplate.replace(/TAG_INCIDENT2/g, events[1].event) : emailTemplate.replace(/TAG_INCIDENT2/g, events_default[1].event);
      emailTemplate = events[2].event != "" ? emailTemplate.replace(/TAG_INCIDENT3/g, events[2].event) : emailTemplate.replace(/TAG_INCIDENT3/g, events_default[2].event);
      emailTemplate = events[3].event != "" ? emailTemplate.replace(/TAG_INCIDENT4/g, events[3].event) : emailTemplate.replace(/TAG_INCIDENT4/g, events_default[3].event);

      emailTemplate = emailTemplate.replace(/(N\/A)+/g, ''); // Clear N/A

      vm.customer.hiddenTemplate = emailTemplate;

      // Supress the superbowl if the year less than 1967.
      setTimeout(function() {
        if (vm.customer.year < 1967) {
          document.getElementById('spnSuperbowl').innerText = "";
        }
        vm.customer.htmlcontent = document.getElementById('hiddenTemplate').innerHTML;
      }, 0);

    }
  }

  // Disable right click on email template editor.
  customerModule.directive('disableRightClick', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.bind('contextmenu', function(e) {
          e.preventDefault();
        });
      }
    };
  });
}());
