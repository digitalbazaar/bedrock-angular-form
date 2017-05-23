/*!
 * Form directive.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* @ngInject */
export default function factory() {
  return {
    restrict: 'E',
    scope: {
      groups: '=brGroups',
      library: '<?brLibrary',
      model: '=brModel',
      path: '<?brPath'
    },
    templateUrl: 'bedrock-angular-form/form-directive.html',
    link: function(scope, element, attrs) {
      scope.path = scope.path || [];
      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        var options = scope.options = scope.$eval(value) || {};
        // TODO: grab vocab via identifier from options
        // TODO: pass options to br-form-groups via repeater in template
      });
    }
  };
}
