// (function() {
//   'use strict';

//   angular.module('payments')
//     .controller('PaymentController1', PaymentController1);

//   PaymentController1.$inject = ['$scope', '$state', 'Authentication', 'Socket', 'PaymentService'];

//   function PaymentController1($scope, $state, Authentication, Socket, PaymentService) {
//     var vm = this;
//     var stripe = window.Stripe('pk_test_IrGex6iJf8pfb3IqsEmk1VyS');
//     var elements = stripe.elements();

//     var card = elements.create('card', {
//       style: {
//         base: {
//           iconColor: '#666EE8',
//           color: '#31325F',
//           lineHeight: '40px',
//           fontWeight: 300,
//           fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//           fontSize: '15px',

//           '::placeholder': {
//             color: '#CFD7E0'
//           }
//         }
//       }
//     });

//     card.mount('#card-element');

//     document.querySelector('form').addEventListener('submit', function(e) {
//       event.preventDefault();
//       stripe.createToken(card).then(function(result) {
//         if (result.error) {
//           // Inform the user if there was an error
//           var errorElement = document.getElementById('card-errors');
//           errorElement.textContent = result.error.message;
//         } else {
//           stripeTokenHandler(result.token.id);
//         }
//       });

//       function stripeTokenHandler(token) {
//         var form = document.getElementById('payment-form');
//         var payeeEmail = form.querySelector('input[name=cardholder-email]').value;
//         var payeeNo = form.querySelector('input[name=cardholder-mobile]').value;
//         var amount = 120;

//         PaymentService.get({
//           token: token,
//           email: payeeEmail,
//           amount: amount,
//           mobile: payeeNo
//         }).$promise;

//         var hiddenInput = document.createElement('input');
//         hiddenInput.setAttribute('type', 'hidden');
//         hiddenInput.setAttribute('name', 'stripeToken');
//         hiddenInput.setAttribute('value', token);
//         form.appendChild(hiddenInput);
//         // Submit the form
//         form.submit();
//       }

//     });
//   }
// }());
