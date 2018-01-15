/*!
 * Date picker directive.
 *
 * Copyright (c) 2014-2018 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
export default {
  bindings: {
    model: '=brModel',
    options: '<?brOptions',
    isOpen: '<?brDatepickerIsOpen'
  },
  transclude: {
    'br-datepicker-help': '?brDatepickerHelp',
    'br-datepicker-validation-errors': '?brDatepickerValidationErrors'
  },
  controller: Ctrl,
  templateUrl: 'bedrock-angular-form/datepicker-component.html'
};

/* @ngInject */
function Ctrl() {
  const self = this;

  self.$onInit = function() {
    self.options = defaultOptions(self.options);
  };

  self.showCalendar = () => {
    self.isOpen = true;
  };

  self.hideCalendar = () => {
    self.isOpen = false;
  };

  function defaultOptions(options) {
    options = options || {};
    options.placeholder = options.placeholder || '';

    if(!('showValidation' in options)) {
      options.showValidation = true;
    }

    // prefix "fa-" to icon
    if(typeof options.icon === 'string' &&
      options.icon.indexOf('fa-') !== 0) {
      options.icon = 'fa-' + options.icon;
    }

    if(!('help' in options)) {
      options.help = !options.inline;
    }

    return options;
  }
}
