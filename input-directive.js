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
function factory(brFormUtilsService) {
  return {
    restrict: 'E',
    require: '?^form',
    // compile prior to other directives to ensure directives to be
    // moved to the input element are moved prior to their compilation
    priority: 1,
    /* Note: Here we use a new child scope, not an isolate scope. This is
    because we need to transplant attribute-based directives from the
    `br-input` element to the inner `input` element, for example:

    ng-maxlength="{{expression to be evaluated in the outer scope}}"

    We need to access our own scope variables in expressions on the `input`
    element and can't "transclude attributes" for the other ones (to preserve
    their scope). We also don't want to force people to write more verbose
    `br-input` elements, so asking them to include `input` themselves with
    the attributes they want (and then we'd need to modify it further anyway)
    isn't an option. To help avoid shadowing parent scope variables, we
    only set scope variables under the `_brInput` property. */
    scope: true,
    transclude: {
      'br-input-help': '?brInputHelp',
      'br-input-validation-errors': '?brInputValidationErrors'
    },
    templateUrl: requirejs.toUrl('bedrock-angular-form/input-directive.html'),
    compile: Compile
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

    return {
      pre: preLink,
      post: postLink
    };
  }

  function preLink(scope, element, attrs, ctrl) {
    scope._brInput = {};
    scope._brInput.form = ctrl;

    attrs.brOptions = attrs.brOptions || {};
    updateOptions(scope, element, attrs.brOptions);
  }

  function postLink(scope, element, attrs, ctrl) {
    var errorElement = element.find('[name="br-input-validation-errors"]');

    scope._brInput.showValidation = function() {
      // do not show empty validation area
      if(!$.trim(errorElement.html())) {
        return false;
      }
      // use `showValidation` option if given
      var options = scope._brInput.options || {};
      if('showValidation' in options) {
        if(!options.showValidation) {
          return options.showValidation;
        }
        return ctrl[options.name].$touched && ctrl[options.name].$invalid;
      }
      // do not show validation if field not in form
      if(!ctrl || !('name' in options) || !ctrl[options.name]) {
        return false;
      }
      // default: show if not inline, form submitted, and field invalid
      return (!options.inline &&
        ctrl.$submitted && ctrl[options.name].$invalid);
    };

    attrs.$observe('brOptions', function(value) {
      updateOptions(scope, element, value);
    });
  }

  function updateOptions(scope, element, value) {
    var options = scope.$eval(value) || {};
    scope._brInput.options = options;

    // update type directly to ensure angular input directives see the change
    // immediately (angular input directives cache `type` early and don't
    // check for changes)
    var input = element.find('input');
    input[0].type = options.type = options.type || 'text';

    options.inline = ('inline' in options) ? options.inline : false;
    options.placeholder = options.placeholder || '';
    // default to no help displayed in inline mode
    options.help = ('help' in options) ? options.help : !options.inline;

    // prefix "fa-" to icon
    if(typeof options.icon === 'string' &&
      options.icon.indexOf('fa-') !== 0) {
      options.icon = 'fa-' + options.icon;
    }

    var columns = options.columns = options.columns || {};
    if(!('label' in columns)) {
      columns.label =  'col-sm-3';
    }
    if(!('input' in columns)) {
      columns.input = 'col-sm-8';
    }
    if(!('help' in columns)) {
      columns.help = 'col-sm-offset-3 col-sm-8';
    }
    if(!('validation' in columns)) {
      columns.validation = 'col-sm-offset-3 col-sm-8';
    }

    if('maxLength' in options) {
      input.attr('maxlength', options.maxLength);
    } else {
      input.removeAttr('maxlength');
    }

    if('autocomplete' in options) {
      input.attr('autocomplete', options.autocomplete);
    } else {
      input.removeAttr('autocomplete');
    }

    if(options.autofocus) {
      input.attr('autofocus', 'autofocus');
    } else {
      input.removeAttr('autofocus');
    }

    if(options.readonly) {
      input.attr('readonly', 'readonly');
    } else {
      input.removeAttr('readonly');
    }
  }
}

return {brInput: factory};

});
