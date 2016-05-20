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
function factory($compile, $templateCache, $templateRequest) {
  return {
    restrict: 'E',
    scope: {
      group: '=brGroup',
      model: '=brModel'
    },
    link: function(scope, element, attrs) {
      var templateUrl = requirejs.toUrl(
        'bedrock-angular-form/form-group-directive.html');
      //$templateCache.remove(templateUrl);
      $templateRequest(templateUrl).then(function(data) {
        scope.$evalAsync(function() {
        var linked = $compile(data)(scope);
        element.append(linked);

        attrs.brOptions = attrs.brOptions || {};
        scope.options = scope.$eval(attrs.brOptions) || {};
        attrs.$observe('brOptions', function(value) {
          var options = scope.options = scope.$eval(value) || {};
          // TODO: grab vocab via identifier from options
          // TODO: use repeater in template to pass options to br-form-field(s)
        });
        });
      });
    }
  };
}

return {brFormGroup: factory};

});
