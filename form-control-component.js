/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';

export default {
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
  templateUrl: 'bedrock-angular-form/form-control-component.html'
};

/* @ngInject */
function Ctrl($attrs, $element, $scope, $timeout) {
  var self = this;

  // TODO: make configurable
  var SHOW_HELP_DELAY = 500;

  self.$onInit = function() {
    // TODO: should deprecate br-options and use specific attributes and
    // `ng-attr-` prefix as needed
    self.options = self.defaultOptions();
  };

  var focusListener = function() {
    helpToggle.contentFocus = true;
    helpToggle.helpVisible = true;
  };
  var blurListener = function() {
    helpToggle.contentFocus = false;
    helpToggle.helpVisible = false;
  };
  var contentElement;

  self.$postLink = function() {
    $attrs.$observe('brOptions', function() {
      self.options = self.defaultOptions(
        $scope.$parent.$eval($attrs.brOptions || {}));
      var labelWords = (self.options.label || '').split(' ');
      self.firstLabelWord = labelWords[0] || '';
      labelWords.shift();
      self.restLabelWords = labelWords.join(' ');
    });

    // wait until after a digest cycle that will handle `self.options.theme`
    // and cause elements to appear before attaching event listeners
    $timeout(function() {
      // true = use capture (to capture events on child elements)
      var theme = self.options.theme || 'default';
      contentElement = $element[0].querySelector(
        '.br-theme-' + theme + ' .br-form-control-wrapper');
      if(contentElement) {
        contentElement.addEventListener('focus', focusListener, true);
        contentElement.addEventListener('blur', blurListener, true);
      }
    });
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
      help: !options.inline
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
