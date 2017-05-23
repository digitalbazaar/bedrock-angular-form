/*!
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* @ngInject */
export default function factory() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      if(scope.brInputCtrl.options && scope.brInputCtrl.options.lowerCaseOnly) {
        ctrl.$parsers.push(function(value) {
          var transformed = value.toLowerCase();
          if(transformed !== value) {
            ctrl.$setViewValue(transformed);
            ctrl.$render();
          }
          return transformed;
        });
      }
    }
  };
}
