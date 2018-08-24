(function() {
  'use strict';

  var importCsvModule = angular
    .module('users')
    .controller('ImportFileController', ImportFileController);

  ImportFileController.$inject = ['$http', 'CustomersService', '$scope', 'Notification', 'Papa', 'usSpinnerService'];

  function ImportFileController($http, CustomersService, $scope, Notification, Papa, usSpinnerService) {
    var vm = this;
    vm.importData = importData;
    vm.parsedData;
    vm.error = null;
    vm.allKeyPresent = false; // Flag

    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    function importData(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.importDataForm');
        return false;
      } else {
        var extn = vm.upload.file.name.split('.').pop();
        if (extn !== 'csv') {
          $scope.$broadcast('show-errors-check-validity', 'vm.importDataForm');
          return false;
        }
      }
      vm.allKeyPresent = false;
      usSpinnerService.spin('spinner-1');

      Papa.parse(vm.upload.file, {
        delimiter: '', // auto-detect
        newline: '', // auto-detect
        quoteChar: '"',
        header: false,
        dynamicTyping: false,
        preview: 0,
        encoding: '',
        worker: false,
        comments: false,
        complete: undefined,
        error: undefined,
        download: false,
        skipEmptyLines: true,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        step: function(row, parser) {
          if (!vm.allKeyPresent) { // Only chek if flag is not set, i.e, for the first time
            parser.pause(); // pause the parser
            var first_row_data = row.data[0];
            // Now check object keys, if it match
            if ((first_row_data[0] === 'First name') && (first_row_data[1] === 'Last name') && (first_row_data[2] === 'Email address') && (first_row_data[3] === 'Job title') && (first_row_data[4] === 'Organization') && (first_row_data[5] === 'DOB') && (first_row_data[6] === 'Gender')) {
              // every required key is present
              vm.allKeyPresent = true;
              // Do your data processing here
              parser.resume();
              Papa.parse(vm.upload.file, {
                  header: true,
                  skipEmptyLines: true
                })
                .then(handleParseResult)
                .catch(handleParseError)
                .finally(parsingFinished);

            } else {
              // some key is missing, abort parsing
              vm.error = "The file's content must be comma separated, and must contain the columns as:  First name, Last name, Email address, Job title, Organization, DOB, Gender. For instance, 'John, Antony, john@gmail.com, Student, College, 01/Jan/1949, M'";
              $scope.$apply();
              parser.abort();
              usSpinnerService.stop('spinner-1');

            }
          } else { // we already match the header, all required key is present
            // Do the Data processing here
          }
        }
      });
    }

    function handleParseResult(result) {
      // do something useful with the parsed data
      vm.parsedData = result.data;
    }

    function handleParseError(result) {
      // display error message to the customer
    }

    function parsingFinished(result) {
      // whatever needs to be done after the parsing has finished
      var validData = true;
      var errorFields = '';
      vm.error = '';


      if (vm.allKeyPresent) {
        if (vm.parsedData.length === 0) {
          vm.error = 'The CSV file is empty.';
          validData = false;
        }

        _.each(vm.parsedData, function(pdata) {

          // Validation for mandatory fields.
          if (pdata['First name'] == '' || pdata['First name'] == undefined ||
            pdata['Last name'] == '' || pdata['Last name'] == undefined ||
            pdata['DOB'] == '' || pdata['DOB'] == undefined ||
            pdata['Gender'] == '' || pdata['Gender'] == undefined) {
            vm.error = ' Some of the columns are empty.';
            validData = false;
            usSpinnerService.stop('spinner-1');

          }

          // Email validation.
          if (pdata['Email address'] != "" && !EMAIL_REGEXP.test(pdata['Email address'])) {
            validData = false;
            errorFields += 'Email address: ' + pdata['Email address'] + ', ';
          }

          // Gender validation.
          if (!_.contains(['m', 'male', 'f', 'female'], pdata.Gender.trim().toLowerCase())) {
            validData = false;
            errorFields += 'Gender: ' + pdata.Gender + ', ';
          }

          // DOB validation.
          var customerDOB = moment(pdata.DOB, "MM/DD/YYYY");
          if (!customerDOB.isValid()) {
            validData = false;
            vm.error = 'The DOB ' + pdata.DOB + ' should be MM/DD/YYY format.';
            return false;
          }

          //var customerDOB = Date.parse(pdata.DOB.replace('-', '/').replace('-', '/'));
          if (!isNaN(customerDOB) && isNaN(pdata.DOB)) {
            customerDOB = new Date(customerDOB);
            // var currentDate = new Date();
            var maxDate = new Date(2000, 11, 31);
            var minDate = new Date(1915, 12, 1);


            if (customerDOB > maxDate || customerDOB < minDate) {
              validData = false;
              vm.error = 'The DOB ' + pdata.DOB + ' should be between the years 1916 to 2000';
            }
            pdata.DOB = getTimeToServer(customerDOB);
            pdata.date = new Date(customerDOB).getDate();
            pdata.month = new Date(customerDOB).getMonth() + 1;
            pdata.year = new Date(customerDOB).getFullYear();
          } else {
            validData = false;
            errorFields += pdata.DOB + ', ';
          }
        });

        if (validData) {

          vm.parsedData = _.uniq(vm.parsedData, function(data) {
            return JSON.stringify(_.pick(data, ['First name', 'Last name', 'DOB']))
          });


          CustomersService.requestImportCustomers(vm.parsedData)
            .then(onRequestImportCustomersSuccess)
            .catch(onRequestImportCustomersError);
        } else {
          vm.upload.file = null;
          if (errorFields) {
            vm.error += ' Please fix the invalid entries (' + errorFields.trim().slice(0, -1) + ').';
          }
          usSpinnerService.stop('spinner-1');
        }
      }
    }

    function getTimeToServer(date) {
      var dt = (new Date(date)).setHours(0, 0, 0, 0);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    }

    // Import csv data Callbacks
    function onRequestImportCustomersSuccess(response) {
      vm.upload.file = null;
      vm.error = null;
      usSpinnerService.stop('spinner-1');
      // Show import success message and clear form.
      Notification.success({
        message: response.message,
        title: '<i class="glyphicon glyphicon-ok"></i> The customer data imported successfully!'
      });
    }

    function onRequestImportCustomersError(response) {
      vm.upload.file = null;
      // Show import error message and clear form.
      Notification.error({
        message: response.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to import customer data',
        delay: 4000
      });
    }
  }
}());