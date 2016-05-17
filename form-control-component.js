/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['angular'], function(angular) {

'use strict';

function register(module) {
  module.component('brFormControl', {
    require: {
      form: '?^form'
    },
    bindings: {
      showHelpToggle: '<?brFormControlShowHelpToggle',
      onHelpToggleShow: '&?brFormControlOnHelpToggleShow',
      onHelpToggleHide: '&?brFormControlOnHelpToggleHide'
    },
    transclude: {
      'br-form-control-content': 'brFormControlContent',
      'br-form-control-help': '?brFormControlHelp',
      'br-form-control-validation-errors': '?brFormControlValidationErrors'
    },
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-angular-form/form-control-component.html')
  });
}

/* @ngInject */
function Ctrl($attrs, $element, $scope, $timeout) {
  var self = this;

  // TODO: make configurable
  var SHOW_HELP_DELAY = 500;

  self.$onInit = function() {
    self.options = self.defaultOptions();
  };

  var errorElement;
  self.$postLink = function() {
    errorElement = $element.find('.br-form-control-validation-errors');

    $attrs.$observe('brOptions', function() {
      self.options = self.defaultOptions($scope.$eval($attrs.brOptions || {}));
    });
  };

  var validation = self.validation = {};

  validation.isVisible = function() {
    // do not show empty validation area
    if(!$.trim(errorElement.html())) {
      return false;
    }
    // use `showValidation` option if given
    var options = self.options;
    if('showValidation' in options) {
      if(!options.showValidation) {
        return false;
      }
      return (self.form[options.name].$touched &&
        self.form[options.name].$invalid);
    }
    // do not show validation if field not in form
    if(!self.form || !('name' in options) || !self.form[options.name]) {
      return false;
    }
    // default: show if not inline, form submitted, and field invalid
    return (!options.inline &&
      self.form.$submitted && self.form[options.name].$invalid);
  };

  var helpToggle = self.helpToggle = {
    mouseOver: false,
    pressed: false,
    visible: false,
    helpVisible: false,
    showHelpPromise: null
  };

  helpToggle.onClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    helpToggle.helpVisible = helpToggle.pressed = !helpToggle.pressed;
  };

  helpToggle.onMouseEnter = function() {
    helpToggle.mouseOver = true;
    if(!helpToggle.pressed) {
      helpToggle.visible = true;
      self.onHelpToggleShow();
      // FIXME: corners aren't correct because "br-help" classes have changed
      // button not pressed, show help after a short delay
      helpToggle.showHelpPromise = $timeout(function() {
        if(helpToggle.mouseOver) {
          helpToggle.helpVisible = true;
        }
      }, SHOW_HELP_DELAY);
    }
  };

  helpToggle.onMouseLeave = function() {
    helpToggle.mouseOver = false;
    $timeout.cancel(helpToggle.showHelpPromise);
    if(!helpToggle.pressed) {
      // delay hide help toggle to allow mouse transition from help toggle to
      // control content to happen without a quick disappear and reappear
      $timeout(function() {
        if(!helpToggle.pressed && !helpToggle.mouseOver) {
          helpToggle.visible = helpToggle.helpVisible = false;
          self.onHelpToggleHide();
        }
      });
    }
  };

  // overridable default options
  self.defaultOptions = function(options) {
    options = options || {};
    return angular.merge({
      inline: false,
      help: !options.inline,
      classes: {
        label: 'col-sm-3',
        content: 'col-sm-8',
        help: 'col-xs-offset-3 col-xs-8',
        validation: 'col-xs-offset-3 col-xs-8'
      }
    }, options);
  };
}

return register;

});
