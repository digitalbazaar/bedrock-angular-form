/*!
 * Textarea directive.
 *
 * Copyright (c) 2014-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory(brFormUtilsService) {
  return {
    restrict: 'E',
    // compile prior to other directives to ensure directives to be
    // moved to the textarea element are moved prior to their compilation
    priority: 1,
    /* Note: Here we use a new child scope, not an isolate scope. This is
    because we need to transplant attribute-based directives from the
    `br-textarea` element to the inner `textarea` element, for example:

    br-textarea-ng-maxlength="{{expression to be evaluated in the outer scope}}"

    We need to access our own scope variables in expressions on the `textarea`
    element and can't "transclude attributes" for the other ones (to preserve
    their scope). We also don't want to force people to write more verbose
    `br-textarea` elements, so asking them to include `textarea` themselves
    with the attributes they want (and then we'd need to modify it further
    anyway) isn't an option. To help avoid shadowing parent scope variables,
    we only set scope variables under the `brTextAreaCtrl` property. */
    scope: true,
    transclude: {
      'br-textarea-help': '?brTextareaHelp',
      'br-textarea-validation-errors': '?brTextareaValidationErrors'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-form/textarea-directive.html'),
    compile: Compile,
    controller: Ctrl,
    controllerAs: 'brTextAreaCtrl'
  };

  function Compile(tElement, tAttrs) {
    var target = 'textarea';

    // transplant br-model as `ng-model` to target
    brFormUtilsService.moveAttr({
      element: tElement,
      attrs: tAttrs,
      attr: 'br-model',
      newAttr: 'ng-model',
      target: target
    });

    // backwards-compatibility
    // transplant validation to target
    brFormUtilsService.moveAttr({
      element: tElement,
      attrs: tAttrs,
      attr: [
        'required', 'ng-minlength', 'ng-maxlength', 'pattern', 'ng-pattern'],
      target: target
    });

    // transplant any directive prefixed with 'br-textarea-' to target
    brFormUtilsService.movePrefixedAttrs({
      element: tElement,
      attrs: tAttrs,
      prefix: 'brTextarea',
      target: target
    });
  }
}

/* @ngInject */
function Ctrl($attrs, $scope, $timeout) {
  var self = this;

  self.$onInit = function() {
    self.options = defaultOptions($scope.$eval($attrs.brOptions || {}));
    $attrs.$observe('brOptions', function() {
      self.options = defaultOptions($scope.$eval($attrs.brOptions || {}));
    });
  };

  // schedule changing toggle visibility using $timeout to ensure that
  // a mouse transition from the control content to the toggle won't
  // cause the toggle to quickly disappear and reappear
  var changeTogglePromise = null;

  self.showToggle = function() {
    $timeout.cancel(changeTogglePromise);
    self.showHelpToggle = true;
  };

  self.scheduleHideToggle = function() {
    $timeout.cancel(changeTogglePromise);
    changeTogglePromise = $timeout(function() {
      self.showHelpToggle = false;
    });
  };

  function defaultOptions(options) {
    options = options || {};
    options.placeholder = options.placeholder || options.label;
    options.rows = options.rows || '5';

    // prefix "fa-" to icon
    if(typeof options.icon === 'string' &&
      options.icon.indexOf('fa-') !== 0) {
      options.icon = 'fa-' + options.icon;
    }

    if(!('wrap' in options)) {
      options.wrap = 'on';
    }

    // backwards compatibility
    if('columns' in options) {
      options.classes = options.columns;
      if('textarea' in options.classes) {
        options.classes.content = options.classes.textarea;
      }
    }

    options.classes = angular.merge({
      helpToggle: 'br-help-toggle-top'
    }, options.classes || {});

    if(!('help' in options)) {
      options.help = true;
    }

    return options;
  }
}

return {brTextarea: factory};

});
