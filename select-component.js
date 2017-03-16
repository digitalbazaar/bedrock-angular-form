/*!
 * Select component.
 *
 * Copyright (c) 2014-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brSelect', {
    bindings: {
      model: '=brModel',
      items: '<brItems',
      display: '&?brDisplayItem',
      compare: '&?brCompareItem'
    },
    transclude: {
      'br-select-help': '?brSelectHelp'
    },
    controller: Ctrl,
    templateUrl: requirejs.toUrl('bedrock-angular-form/select-component.html')
  });
}

/* @ngInject */
function Ctrl($attrs, $element, $scope) {
  var self = this;

  self.$onInit = function() {
    self.selection = {selected: undefined};

    self.options = defaultOptions(legacyEval($attrs.brOptions || {}));
    $attrs.$observe('brOptions', function() {
      self.options = defaultOptions(legacyEval($attrs.brOptions || {}));

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

      if('key' in self.options) {
        self.model = selected.item[self.options.key];
        return;
      }

      // default selects full item
      self.model = selected.item;
    }, true);
  };

  function legacyEval(expression) {
    // strip double parentheses
    return $scope.$eval(expression.replace(/{{|}}/g, ''));
  }

  function defaultOptions(options) {
    options = options || {};
    options.label = ('label' in options) ? options.label : 'Choose...';
    options.placeholder = ('placeholder' in options ?
      options.placeholder : (options.label + '...'));
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
