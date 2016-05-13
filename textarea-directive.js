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
function factory($parse, brFormUtilsService) {
  return {
    restrict: 'E',
    // compile prior to other directives to ensure directives to be
    // moved to the textarea element are moved prior to their compilation
    priority: 1,
    /* Note: Here we use a new child scope, not an isolate scope. This is
    because we need to transplant attribute-based directives from the
    `br-textarea` element to the inner `textarea` element, for example:

    ng-maxlength="{{expression to be evaluated in the outer scope}}"

    We need to access our own scope variables in expressions on the `textarea`
    element and can't "transclude attributes" for the other ones (to preserve
    their scope). We also don't want to force people to write more verbose
    `br-textarea` elements, so asking them to include `textarea` themselves
    with the attributes they want (and then we'd need to modify it further
    anyway) isn't an option. To help avoid shadowing parent scope variables,
    we only set scope variables under the `_brTextarea` property. */
    scope: true,
    transclude: true,
    templateUrl: requirejs.toUrl(
      'bedrock-angular-form/textarea-directive.html'),
    compile: Compile
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

    return function(scope, element, attrs) {
      scope._brTextarea = {};

      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        var options = scope.$eval(value) || {};
        scope._brTextarea.options = options;

        options.placeholder = options.placeholder || options.label;
        options.rows = options.rows || '5';

        // prefix "fa-" to icon
        if(typeof options.icon === 'string' &&
          options.icon.indexOf('fa-') !== 0) {
          options.icon = 'fa-' + options.icon;
        }

        var columns = options.columns = options.columns || {};
        if(!('label' in columns)) {
          columns.label =  'col-sm-3';
        }
        if(!('textarea' in columns)) {
          columns.textarea = 'col-sm-8';
        }
        if(!('help' in columns)) {
          columns.help = 'col-sm-offset-3 col-sm-8';
        }

        if(options.autofocus) {
          element.find('textarea').attr('autofocus', 'autofocus');
        } else {
          element.find('textarea').removeAttr('autofocus');
        }

        if(options.readonly) {
          element.find('textarea').attr('readonly', 'readonly');
        } else {
          element.find('textarea').removeAttr('readonly');
        }

        if(!('wrap' in options)) {
          options.wrap = 'on';
        }
      });

      var keypressFn = $parse(attrs.brKeypress);
      if(keypressFn === angular.noop) {
        scope._brTextarea.localKeypress = angular.noop;
      } else {
        scope._brTextarea.localKeypress = function(event) {
          return keypressFn(scope.$parent, {$event: event});
        };
      }
    };
  }
}

return {brTextarea: factory};

});
