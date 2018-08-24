(function(window) {
  'use strict';

  var applicationModuleName = 'birthday_app';

  var underscore = angular.module('underscore', []);
  underscore.factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
  }]);

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMaterial', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ui-notification', 'textAngular', 'ngCsvImport', 'chart.js', 'angularSpinner', 'papa-promise', 'underscore'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });

  angular.module('chart.js').config(function(ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['#FF5252', '#FF8A80'],
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: true
    });
  });

  angular.module('ngMaterial').config(function($mdThemingProvider) {
    // $mdThemingProvider
    //   .theme('default')
    //   .primaryPalette('teal') //  Valid themes are 'red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
    //   .accentPalette('pink')
    //   .warnPalette('red')
    //   .backgroundPalette('grey');

    $mdThemingProvider.definePalette('amazingPaletteName', {
      '50': '7094aa',
      '100': '7094aa',
      '200': '7094aa',
      '300': '7094aa',
      '400': '7094aa',
      '500': '7094aa',
      '600': '7094aa',
      '700': '7094aa',
      '800': '7094aa',
      '900': '7094aa',
      'A100': '7094aa',
      'A200': '7094aa',
      'A400': '7094aa',
      'A700': '7094aa',
      'contrastDefaultColor': 'light', // whether, by default, text (contrast)
      // on this palette should be dark or light

      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.definePalette('amazingAccentPaletteName', {
      '50': '4c837a',
      '100': '4c837a',
      '200': '4c837a',
      '300': '4c837a',
      '400': '4c837a',
      '500': '4c837a',
      '600': '4c837a',
      '700': '4c837a',
      '800': '4c837a',
      '900': '4c837a',
      'A100': '4c837a',
      'A200': '4c837a',
      'A400': '4c837a',
      'A700': '4c837a',
      'contrastDefaultColor': 'light', // whether, by default, text (contrast)
      // on this palette should be dark or light

      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });


    $mdThemingProvider.theme('default')
      .primaryPalette('amazingPaletteName')
      .accentPalette('amazingAccentPaletteName')
      .warnPalette('red')
      .backgroundPalette('grey');
  });

}(window));
