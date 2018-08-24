// (function () {
//   'use strict';

//   angular
//     .module('birthdaygreetings')
//     .run(menuConfig);

//   menuConfig.$inject = ['menuService'];

//   function menuConfig(menuService) {
//     // Set top bar menu items
//     menuService.addMenuItem('topbar', {
//       title: 'Birthday Greetings',
//       state: 'birthdaygreetings',
//       type: 'dropdown',
//       roles: ['user'],
//       order: 2
//     });

//     // Add the dropdown list item
//     menuService.addSubMenuItem('topbar', 'birthdaygreetings', {
//       title: 'Send Birthday greetings',
//       state: 'birthdaygreetings.list'
//     });
//   }
// }());
