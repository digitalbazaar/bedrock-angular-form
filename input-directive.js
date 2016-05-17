/*!
 * Input directive.
 *
 * Copyright (c) 2014-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($parse, brFormUtilsService) {
  return {
    restrict: 'E',
    // compile prior to other directives to ensure directives to be
    // moved to the input element are moved prior to their compilation
    priority: 1,
    /* Note: Here we use a new child scope, not an isolate scope. This is
    because we need to transplant attribute-based directives from the
    `br-input` element to the inner `input` element, for example:

    br-input-ng-maxlength="{{expression to be evaluated in the outer scope}}"

    We need to access our own scope variables in expressions on the `input`
    element and can't "transclude attributes" for the other ones (to preserve
    their scope). We also don't want to force people to write more verbose
    `br-input` elements, so asking them to include `input` themselves with
    the attributes they want (and then we'd need to modify it further anyway)
    isn't an option. To help avoid shadowing parent scope variables, we
    only set scope variables under the `brInputCtrl` property. */
    scope: true,
    transclude: {
      'br-input-help': '?brInputHelp',
      'br-input-validation-errors': '?brInputValidationErrors'
    },
    templateUrl: requirejs.toUrl('bedrock-angular-form/input-directive.html'),
    compile: Compile,
    controller: Ctrl,
    controllerAs: 'brInputCtrl'
  };

  function Compile(tElement, tAttrs) {
    var target = 'input';

    // transplant br-model as `ng-model` to target
    brFormUtilsService.moveAttr({
      element: tElement,
      attrs: tAttrs,
      attr: 'br-model',
      newAttr: 'ng-model',
      target: target
    });

    // transplant validation to target
    brFormUtilsService.moveAttr({
      element: tElement,
      attrs: tAttrs,
      attr: [
        'required', 'ng-minlength', 'ng-maxlength', 'pattern', 'ng-pattern'],
      target: target
    });

    // transplant any directive prefixed with 'br-input-' to target
    brFormUtilsService.movePrefixedAttrs({
      element: tElement,
      attrs: tAttrs,
      prefix: 'brInput',
      target: target
    });

    // get input type (*must* be given as a literal), then update it directly
    // to ensure angular input directives see the change immediately (angular
    // input directives cache `type` early and don't check for changes)
    var options = $parse(tAttrs.brOptions || '{}')({});
    var input = tElement.find('input');
    input[0].type = options.type || 'text';
  }
}

/* @ngInject */
function Ctrl($attrs, $scope, $timeout) {
  var self = this;

  self.$onInit = function() {
    self.options = defaultOptions($scope.$eval($attrs.brOptions || {}));
    $attrs.$observe('brOptions', function() {
      // FIXME: only fixes initially, then fails again
      $timeout(function() {
        self.options = defaultOptions($scope.$eval($attrs.brOptions || {}));
      });
    });
  };

  function defaultOptions(options) {
    options = options || {};
    options.placeholder = options.placeholder || '';

    // prefix "fa-" to icon
    if(typeof options.icon === 'string' &&
      options.icon.indexOf('fa-') !== 0) {
      options.icon = 'fa-' + options.icon;
    }

    // backwards compatibility
    if('columns' in options) {
      options.classes = options.columns;
      if('input' in options.classes) {
        options.classes.content = options.classes.input;
      }
    }

    if(!('help' in options)) {
      options.help = true;
    }

    return options;
  }
}

return {brInput: factory};

});
