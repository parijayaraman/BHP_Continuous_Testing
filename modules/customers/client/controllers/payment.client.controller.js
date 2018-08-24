(function() {
  'use strict';

  angular.module('customers')
    .controller('PaymentController', PaymentController);

  PaymentController.$inject = ['$scope', '$uibModalInstance', '$uibModal', '$state', '$location', 'Authentication', 'Socket', 'PaymentService', 'PaymentAuthenticationService', 'PaymentOtpVerifyService', 'amount', 'customer', 'CustomersService', 'Notification', 'usSpinnerService'];

  function PaymentController($scope, $uibModalInstance, $uibModal, $state, $location, Authentication, Socket, PaymentService, PaymentAuthenticationService, PaymentOtpVerifyService, amount, customer, CustomersService, Notification, usSpinnerService) {
    var vm = this;
    vm.Authentication = Authentication;
    // $scope.cardError = false;
    $scope.otp = null;
    $scope.cardelement = null;
    $scope.amount = amount;
    $scope.customer = customer;
    $scope.carderrormsg = null;
    $scope.finalerrormsg = null;

    $scope.error = false;
    $scope.finalerror = false;
    $scope.isLoading = false;
    $scope.isPaymentLoading = false;

    var stripe;

    if (document.location.hostname == "localhost") {
      stripe = window.Stripe('pk_test_IrGex6iJf8pfb3IqsEmk1VyS'); // Development key
    } else {
      stripe = window.Stripe('pk_live_TM67Gs732JaAbOOlcJ5VvGYS'); // Production key
    }
    console.log("PERI stripe:", stripe);

    var elements = stripe.elements();
    // console.log(elements);
    var card = elements.create('card', {
      style: {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          lineHeight: '40px',
          fontWeight: 300,
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '15px',

          '::placeholder': {
            color: '#CFD7E0'
          }
        }
      }
    });

    angular.element(document).ready(function() {
      card.mount('#card-element');
    });

    card.on('change', function(event) {
      $scope.setOutcome(event);
    });

    $scope.setOutcome = function(result) {
      if (result.error) {
        $scope.error = true;
        $scope.carderrormsg = result.error.message;
        $scope.$apply();
      } else {
        $scope.error = false;
        $scope.carderrormsg = '';
        $scope.$apply();
      }
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.sendmail = function() {
      stripe.createToken(card).then(function(result) {
        if (result.error) {
          $scope.error = true;
          $scope.carderrormsg = result.error.message;
          $scope.$apply();
        } else {
          $scope.error = false;
          // usSpinnerService.spin('spinner-1');
          $scope.isLoading = true;
          PaymentAuthenticationService.get({}, function(response, getResponseHeaders) {
            Notification.success({
              message: response.message,
              title: '<i class="glyphicon glyphicon-ok"></i> Email OTP sent successfully!'
            });
            if (response.sent) {
              $scope.sent = true;
              $scope.isLoading = false;
            } else {
              $scope.sent = false;
            }
          }, function(response) {
            $scope.error = 'Failure in sending email';
            Notification.error({
              message: response.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Failed to send email ',
              delay: 4000
            });
          });
        }
      });
    };

    $scope.save = function(isValid) {
      var otp = this.otp;

      if (!otp) {
        $scope.finalerror = true;
        $scope.finalerrormsg = 'Please enter your valid OTP';
        return false;
      }

      stripe.createToken(card).then(function(result) {
        if (result.error) {
          $scope.error = true;
          $scope.carderrormsg = result.error.message;
          $scope.$apply();
        } else {
          $scope.error = false;
          PaymentOtpVerifyService.get({
            otp: otp
          }, function(response, getResponseHeaders) {
            if (response.status === 'valid') {
              // console.log('Valid OTP');
              // usSpinnerService.spin('spinner-2');
              $scope.isPaymentLoading = true;
              $scope.finalerror = false;
              $scope.status = true;
              stripeTokenHandler(result.token.id);
            } else {
              // console.log('Invalid OTP');
              $scope.status = false;
              $scope.finalerror = true;
              $scope.finalerrormsg = 'Please enter your valid OTP';
              return false;
            }
          });
        }
      });
    };

    function stripeTokenHandler(token) {
      var form = document.getElementById('payment-form');
      // var payeeNo = form.querySelector('input[name=cardholder-mobile]').value;
      var amount = $scope.amount;

      PaymentService.get({
        token: token,
        amount: amount
      }, function(response, getResponseHeaders) {
        // console.log(response.status);
        // console.log(response.charge);
        var txnId = response.charge;
        if (response.status === 'subscribed') {
          $uibModalInstance.close();
          // usSpinnerService.stop('spinner-2');
          $scope.isPaymentLoading = false;
          // alert('Subscription for 1 year is successful. Transaction Reference id is: ' + txnId);
          if (!customer) {
            $state.go('customers.settings.subscription', {}, {
              reload: true
            });
          }

          if (customer) {
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: '/modules/customers/client/views/payment-result.client.view.html',
              controller: 'PaymentResultController',
              resolve: {
                amount: function() {
                  return amount;
                },
                txnid: function() {
                  return txnId;
                },
                customer: function() {
                  return customer;
                },
                paid: function() {
                  return true;
                },
                activated: function() {
                  return true;
                },
                transactionerror: function() {
                  return false;
                }
              }
            });
          }

        }

        if (response.status === 'no') {
          $uibModalInstance.close();
          // alert('Payment Successful. Transaction Reference id is: ' + txnId);
          if (customer) {
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: '/modules/customers/client/views/payment-result.client.view.html',
              controller: 'PaymentResultController',
              resolve: {
                amount: function() {
                  return amount;
                },
                txnid: function() {
                  return txnId;
                },
                customer: function() {
                  return customer;
                },
                paid: function() {
                  return true;
                },
                activated: function() {
                  return true;
                },
                transactionerror: function() {
                  return false;
                }
              }
            });
          }
          if (!customer) {
            $state.go('customers.settings.subscription', {}, {
              reload: true
            });
          }
        }


        if (response.status === 'error') {
          $uibModalInstance.close();
          // alert('Payment Failure. The Error is: ' + response.message);
          if (customer) {
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: '/modules/customers/client/views/payment-result.client.view.html',
              controller: 'PaymentResultController',
              resolve: {
                amount: function() {
                  return null;
                },
                txnid: function() {
                  return null;
                },
                customer: function() {
                  return customer;
                },
                paid: function() {
                  return false;
                },
                activated: function() {
                  return false;
                },
                transactionerror: function() {
                  return true;
                }
              }
            });
            // $state.go('customers.birthdaylist');
          }
          if (!customer) {
            var modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: '/modules/customers/client/views/payment-result.client.view.html',
              controller: 'PaymentResultController',
              resolve: {
                amount: function() {
                  return null;
                },
                txnid: function() {
                  return null;
                },
                customer: function() {
                  return null;
                },
                paid: function() {
                  return false;
                },
                activated: function() {
                  return false;
                },
                transactionerror: function() {
                  return true;
                }
              }
            });
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
      $state.go('customers.birthdaylist');
    }
  }

}());