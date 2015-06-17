define([], function() {

'use strict';

/* @ngInject */
function factory($scope, brTestFormLibraryService) {
  var self = this;

  self.doc = {
    "@context": brTestFormLibraryService.CONTEXT,
    "urn:bedrock-test-2:string": "foo"
  };
  self.groups = [];

  brTestFormLibraryService.getLibrary().then(function(library) {
    console.log('library loaded', library);
    self.library = library;
    self.groups = [library.groups['urn:bedrock-test-2:kitchen-sink']];
    $scope.$apply();
  });
}

return {brTestFormController: factory};

});
