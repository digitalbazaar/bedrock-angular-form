/*!
 * Form group directive.
 *
 * Copyright (c) 2014-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([], function() {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: {
      group: '=brGroup',
      model: '=brModel'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-form/form-group-directive.html'),
    link: function(scope, element, attrs) {
      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        var options = scope.options = scope.$eval(value) || {};
        // TODO: grab vocab via identifier from options
        // TODO: use repeater in template to pass options to br-form-field(s)
      });
    }
  };
}

return {brFormGroup: factory};

});
