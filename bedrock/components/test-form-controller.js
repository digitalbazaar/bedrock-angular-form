define([], function() {

'use strict';

/* @ngInject */
function factory(brTestFormLibraryService) {
  var self = this;
  
  self.doc = {
    "@context": brTestFormLibraryService.CONTEXT,
    "t2:string": "foo"
  };

  brTestFormLibraryService.getLibrary().then(function(library) {
    console.log('library loaded', library);
  });
}

return {brTestFormController: factory};

});
