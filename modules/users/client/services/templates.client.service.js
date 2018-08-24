(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('TemplateService', TemplateService);

  TemplateService.$inject = ['$resource'];

  function TemplateService($resource) {
    var Templates = $resource('/api/admin/templates/:templateId', { templateId: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Templates, {
    });

    return Templates;
  }
}());
