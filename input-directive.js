/*!
 * Input directive.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* @ngInject */
export default function factory($parse, brFormUtilsService) {
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
    templateUrl: 'bedrock-angular-form/input-directive.html',
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
    var options =
      $parse(fixLegacyExpression(tAttrs.brOptions || '{}'))({}) || {};
    var input = tElement.find('input');
    input[0].type = options.type || 'text';
  }
}

/* @ngInject */
function Ctrl($attrs, $scope) {
  var self = this;

  self.$onInit = function() {
    self.options = defaultOptions(legacyEval($attrs.brOptions || {}));
    $attrs.$observe('brOptions', function() {
      self.options = defaultOptions(legacyEval($attrs.brOptions || {}));
    });
  };

  function legacyEval(expression) {
    // strip double parentheses
    return $scope.$eval(fixLegacyExpression(expression));
  }

  function defaultOptions(options) {
    options = options || {};
    // Note: deprecated, use `br-input-placeholder` instead
    options.placeholder = options.placeholder || '';

    if(!('showValidation' in options)) {
      options.showValidation = true;
    }

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
      options.help = !options.inline;
    }

    // email addresses are case insensitive, so force to lower case by default
    if(options.type === 'email' && !('lowerCaseOnly' in options)) {
      options.lowerCaseOnly = true;
    }

    return options;
  }
}

function fixLegacyExpression(expression) {
  return expression.replace(/{{|}}/g, '');
}
