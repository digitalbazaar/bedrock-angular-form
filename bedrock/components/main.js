define([
  'angular',
  './test-form-controller',
  './test-form-library-service'
], function(angular, brTestFormController, brTestFormLibraryService) {

'use strict';

var module = angular.module(
  'bedrock-angular-form-test', ['bedrock.alert', 'bedrock.form']);

module.controller(brTestFormController);
module.service(brTestFormLibraryService);

return module.name;

});
