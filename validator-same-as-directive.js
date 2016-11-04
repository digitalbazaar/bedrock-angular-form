/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.directive('brValidatorSameAs', factory);
}

/* @ngInject */
function factory() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      sameAs: '<brValidatorSameAs'
    },
    link: Link
  };

  function Link(scope, element, attrs, ctrl) {
    scope.$watch('sameAs', function() {
      ctrl.$validate();
    });

    ctrl.$validators.brValidatorSameAs = function(modelValue) {
      return scope.sameAs === modelValue;
    };
  }
}

return register;

});
