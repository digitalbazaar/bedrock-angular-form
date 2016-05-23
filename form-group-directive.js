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
function factory($compile, $templateCache, $templateRequest, $timeout) {
  return {
    restrict: 'E',
    scope: {
      group: '=brGroup',
      model: '=brModel'
    },
    link: function(scope, element, attrs) {
      /* Default template fetch, compile, and link circumvention hack:

      When `$digest` is called on a scope, a "dirty" loop is run that first
      executes all previously scheduled asynchronous code and then it calls
      all registered watches to see if their current value has changed from
      the previous one.

      In so doing, it's possible that a change may trigger new directives to
      be created and linked. When these new directives are linked, their link
      functions often call, for example, `$observe` which will register new
      asynchronous code via `$evalAsync`. This increases the length of the
      `asyncQueue` -- and if the length is > 1 after running all of the watches
      in one iteration of the dirty loop, the dirty loop will not exit and
      instead execute again to run the async code.

      This process is problematic for this directive because by changing its
      parsed options via `$observe`, it recursively triggers new directives to
      be created and linked that will schedule more async code. The dirty loop
      will therefore continually execute until all of these recursive
      directives have been made available -- but this can easily take more
      iterations than the hard-coded maximum of 10 iterations of the digest
      loop, resulting in an exception being thrown and causing processing to
      cease.

      In order to remedy this problem, we must go around the default
      template fetching, compilation, and linking code. We manually fetch
      the template for this directive, compile its contents, and link it,
      after ensuring we've forced a new digest loop by using `$timeout`. */
      var templateUrl = requirejs.toUrl(
        'bedrock-angular-form/form-group-directive.html');
      $timeout(function() {
        $templateRequest(templateUrl).then(function(data) {
          var linked = $compile(data)(scope);
          element.append(linked);

          attrs.brOptions = attrs.brOptions || {};
          scope.options = scope.$eval(attrs.brOptions) || {};
          attrs.$observe('brOptions', function(value) {
            var options = scope.options = scope.$eval(value) || {};
            // TODO: grab vocab via identifier from options
            // TODO: use repeater in template to pass options to
            // br-form-field(s)
          });
        });
      });
    }
  };
}

return {brFormGroup: factory};

});
