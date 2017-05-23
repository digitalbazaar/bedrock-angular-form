/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* @ngInject */
export default function factory() {
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
