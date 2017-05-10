/*!
 * Select component.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* global requirejs */
define(['angular'], function(angular) {

'use strict';

function register(module) {
  module.component('brSelect', {
    require: {
      form: '?^form'
    },
    bindings: {
      model: '=brModel',
      items: '<brItems',
      // `brDisplayItem` is deprecated, use transclusion?
      display: '&?brDisplayItem',
      compare: '&?brCompareItem',
      onSelect: '&?brOnSelect'
    },
    transclude: {
      'br-select-help': '?brSelectHelp',
      'br-select-validation-errors': '?brSelectValidationErrors'
    },
    controller: Ctrl,
    templateUrl: requirejs.toUrl('bedrock-angular-form/select-component.html')
  });
}

/* @ngInject */
function Ctrl($attrs, $element, $scope, $timeout, $transclude) {
  var self = this;

  // TODO: A major rewrite of this component is called for once support for
  // ui-select is dropped; the md-autocomplete API is much simpler and the
  // watches and other complexities below can be dropped as a result of it

  self.$onInit = function() {
    self.selection = {selected: undefined};

    self.options = defaultOptions(legacyEval($attrs.brOptions || {}));
    $attrs.$observe('brOptions', function() {
      self.options = defaultOptions(legacyEval($attrs.brOptions || {}));

      if(self.options.theme !== 'material') {
        if(self.options.autofocus) {
          $element.find('.ui-select-match').attr('autofocus', 'autofocus');
        } else {
          $element.find('.ui-select-match').removeAttr('autofocus');
        }

        if(self.options.readonly) {
          $element.find('.ui-select-match').attr('readonly', 'readonly');
        } else {
          $element.find('.ui-select-match').removeAttr('readonly');
        }
      }
    });

    // set default compare item method
    if(!self.compare) {
      self.compare = function(items) {
        return items.item1 === items.item2;
      };
    }

    // update view items when items or display function changes
    $scope.$watch(function() {
      return self.items;
    }, updateViewItems, true);
    $attrs.$observe('brDisplayItem', function() {
      updateViewItems(self.items);
    });

    // when external model changes, update selection
    $scope.$watch(function() {
      return self.model;
    }, function(item1) {
      // find matching view item
      for(var i = 0; item1 && i < self.viewItems.length; ++i) {
        var viewItem = self.viewItems[i];
        var item2 = ('key' in self.options ?
          viewItem.item[self.options.key] : viewItem.item);
        if(self.compare({item1: item1, item2: item2})) {
          self.selection.selected = viewItem;
          return;
        }
      }

      // no match found
      self.selection.selected = undefined;
    }, true);

    // when selection changes, update external model
    $scope.$watch(function() {
      return self.selection.selected;
    }, function(selected) {
      if(selected === undefined) {
        self.model = undefined;
        return;
      }

      if('key' in self.options && selected && selected.item) {
        self.model = selected.item[self.options.key];
        return;
      }

      // default selects full item
      self.model = selected ? selected.item : undefined;
    }, true);
  };

  self.$postLink = function() {
    if(self.options.theme !== 'material') {
      return;
    }

    /* Note: Help and validation errors elements cannot be transcluded using
      the `ng-transclude` multislot mechanism so this custom code will
      perform the transclusion instead. The `md-autocomplete` component makes
      some internal template changes that somehow unanchor our slot identifiers
      thereby triggering an angular error "No parent directive that
      requires a transclusion found". To remedy this, we wait for a digest
      cycle to complete (via $timeout) to allow the `md-autocomplete` component
      to add its `md-input-container` where our transcluded slots appear. Then
      we find those slots manually and fill them. */
    $timeout(function() {
      // TODO: use .find()?
      var help = $element[0].querySelector(
        '[br-late-transclude=br-select-help]');
      if(help) {
        $transclude(function(clone) {
          angular.element(help).append(clone);
        }, help, 'br-select-help');
      }

      var errors = $element[0].querySelector(
        '[br-late-transclude=br-select-validation-errors]');
      if(errors) {
        $transclude(function(clone) {
          angular.element(errors).append(clone);
        }, errors, 'br-select-validation-errors');
      }
    });
  };

  self.filterItems = function(query) {
    if(!query) {
      return self.viewItems;
    }
    query = query.toLowerCase();
    return self.viewItems.filter(function(viewItem) {
      // TODO: need to allow `filterItems` to be passed in via API
      // when customizing item display with a template
      return viewItem.display.toLowerCase().indexOf(query) === 0;
    });
  };

  self.onSelectItem = function(viewItem) {
    var selected = viewItem ? viewItem.item : viewItem;
    if(self.onSelect) {
      self.onSelect({selected: selected});
    }
  };

  self.onFocus = function() {
    if(!self.options.disabled) {
      self.helpVisible = true;
    }
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

  function legacyEval(expression) {
    // strip double parentheses
    return $scope.$eval(expression.replace(/{{|}}/g, ''));
  }

  function defaultOptions(options) {
    options = options || {};
    if(options.theme !== 'material') {
      options.label = ('label' in options) ? options.label : 'Choose...';
      options.placeholder = ('placeholder' in options ?
        options.placeholder : (options.label + '...'));
    }
    options.autocomplete = (options.autocomplete !== false);
    options.tooltip = options.tooltip || {};

    // prefix "fa-" to icon
    if(typeof options.icon === 'string' &&
      options.icon.indexOf('fa-') !== 0) {
      options.icon = 'fa-' + options.icon;
    }

    // backwards compatibility
    if('columns' in options) {
      options.classes = options.columns;
      if('select' in options.classes) {
        options.classes.content = options.classes.select;
      }
    }

    if(!('help' in options)) {
      options.help = true;
    }

    return options;
  }

  function updateViewItems(items) {
    self.viewItems = [];
    if(items === undefined) {
      return;
    }

    items.forEach(function(item) {
      self.viewItems.push({
        item: item,
        display: display(item)
      });
    });
  }

  function display(item) {
    var rval = self.display({item: item});
    if(rval === undefined) {
      return '' + item;
    }
    return rval;
  }
}

return register;

});
