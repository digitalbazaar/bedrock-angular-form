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
    bindings: {},
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

  var focusListener = function() {
    helpToggle.contentFocus = true;
    helpToggle.visible = true;
  };
  var blurListener = function() {
    helpToggle.contentFocus = false;
    if(!helpToggle.contentMouseOver) {
      helpToggle.scheduleHide();
    }
  };
  var contentElement;

  self.$postLink = function() {
    $attrs.$observe('brOptions', function() {
      self.options = self.defaultOptions($scope.$eval($attrs.brOptions || {}));
      var labelWords = (self.options.label || '').split(' ');
      self.firstLabelWord = labelWords[0] || '';
      labelWords.shift();
      self.restLabelWords = labelWords.join(' ');
    });

    // true = use capture (to capture events on child elements)
    contentElement = $element.find('.br-form-control-wrapper')[0];
    if(contentElement) {
      contentElement.addEventListener('focus', focusListener, true);
      contentElement.addEventListener('blur', blurListener, true);
    }
  };

  self.$onDestroy = function() {
    if(contentElement) {
      contentElement.removeEventListener('focus', focusListener, true);
      contentElement.removeEventListener('blur', blurListener, true);
    }
  };

  var helpToggle = self.helpToggle = {
    mouseOver: false,
    pressed: false,
    visible: false,
    helpVisible: false,
    contentMouseOver: false,
    contentFocus: false,
    showHelpPromise: null,
    hideHelpPromise: null
  };

  self.onMouseEnterContent = function() {
    helpToggle.contentMouseOver = true;
    helpToggle.visible = true;
  };

  self.onMouseLeaveContent = function() {
    helpToggle.contentMouseOver = false;
    if(!helpToggle.contentFocus) {
      helpToggle.scheduleHide();
    }
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
        if(!(helpToggle.pressed || helpToggle.mouseOver)) {
          helpToggle.helpVisible = false;
          if(!helpToggle.contentMouseOver) {
            helpToggle.visible = false;
          }
        }
      });
    }
  };

  helpToggle.scheduleHide = function() {
    $timeout.cancel(helpToggle.hideHelpPromise);
    // schedule changing toggle visibility using $timeout to ensure that
    // a mouse transition from the control content to the toggle won't
    // cause the toggle to quickly disappear and reappear
    helpToggle.hideHelpPromise = $timeout(function() {
      if(!(helpToggle.contentMouseOver || helpToggle.pressed ||
        helpToggle.mouseOver)) {
        helpToggle.visible = false;
      }
    });
  };

  // overridable default options
  self.defaultOptions = function(options) {
    options = options || {};
    return angular.merge({
      inline: false,
      help: !options.inline,
      helpTogglePosition: 'content',
      classes: {
        label: 'col-sm-3',
        content: 'col-sm-8',
        help: 'col-xs-offset-3 col-xs-8',
        validation: 'col-xs-offset-3 col-xs-8'
      }
    }, options);
  };

  var validation = self.validation = {};

  validation.isVisible = function() {
    var options = self.options;

    // do not show validation if field not in form
    if(!self.form || !('name' in options) || !self.form[options.name]) {
      return false;
    }

    // use `showValidation` option if given
    if('showValidation' in options) {
      if(!options.showValidation) {
        return false;
      }
      return (self.form[options.name].$touched &&
        self.form[options.name].$invalid);
    }
    // default: show if not inline, form submitted, and field invalid
    return (!options.inline &&
      self.form.$submitted && self.form[options.name].$invalid);
  };
}

return register;

});
