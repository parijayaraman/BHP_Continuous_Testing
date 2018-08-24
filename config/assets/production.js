'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/angular-material/angular-material.min.css',
        'public/lib/fontAwesome/css/font-awesome.min.css',
        'public/lib/textAngular/dist/textAngular.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/underscore/underscore.js',
        'public/javascripts/stripe.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-aria/angular-aria.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-material/angular-material.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/textAngular/dist/textAngular-rangy.min.js',
        'public/lib/textAngular/dist/textAngular-sanitize.min.js',
        'public/lib/textAngular/dist/textAngularSetup.js',
        'public/lib/textAngular/dist/textAngular.min.js',
        'public/lib/angular-csv-import/dist/angular-csv-import.min.js',
        'public/lib/chart.js/dist/Chart.min.js',
        'public/lib/angular-chart.js/dist/angular-chart.min.js',
        'public/lib/angular-spinner/dist/angular-spinner.min.js',
        'public/lib/papaparse/papaparse.min.js',
        'public/lib/angular-papa-promise/dist/angular-papa-promise.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/moment/min/moment-with-locales.min.js',
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
