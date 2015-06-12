/*!
 * Textarea directive.
 *
 * Copyright (c) 2014 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define(['angular'], function(angular) {

'use strict';

var SNAKE_CASE_REGEXP = /[A-Z]/g;

/* @ngInject */
function factory($parse) {
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
    /* jshint multistr: true */
    template: '\
      <div ng-class="{\'form-group\': !_brTextarea.options.inline}" \
        br-property-path="{{_brTextarea.options.name}}" \
        ng-style="{display: \
          (_brTextarea.options.inline ? \'inline-\' : \'\') + \'block\'}"> \
        <label ng-if="!_brTextarea.options.inline && \
            _brTextarea.options.label !== undefined" \
          class="{{_brTextarea.options.columns.label}} control-label" \
          for="{{_brTextarea.options.name}}" \
          >{{_brTextarea.options.label}}</label> \
        <div class="{{_brTextarea.options.columns.textarea}}" \
          ng-class="{ \
            \'input-group\': !_brTextarea.options.inline, \
            \'input-group-inline\': _brTextarea.options.inline}"> \
          <span ng-if="_brTextarea.options.icon" \
            class="input-group-addon"><i \
            class="fa {{_brTextarea.options.icon}}"></i></span> \
          <span ng-if="_brTextarea.options.image" \
            class="input-group-addon"><img \
            ng-src="{{_brTextarea.options.image}}"></img></span> \
          <textarea class="form-control {{_brTextarea.options.class}}" \
            rows="{{_brTextarea.options.rows}}" \
            name="{{_brTextarea.options.name}}" \
            placeholder="{{_brTextarea.options.placeholder}}" \
            ng-disabled="_brTextarea.options.disabled" \
            br-track-state="_brTextarea.help" \
            style="{{_brTextarea.options.style}}" \
            wrap="{{_brTextarea.options.wrap}}" \
            ng-class="{\'br-help-off\': _brTextarea.options.inline}" \
            ng-keypress="_brTextarea.localKeypress($event)"/> \
          <span ng-if="!_brTextarea.options.inline" class="input-group-btn"> \
            <button type="button" class="btn btn-default" \
              br-help-toggle="_brTextarea.help"> \
              <i class="fa fa-question-circle"></i> \
            </button> \
          </span> \
        </div> \
        <div ng-if="!_brTextarea.options.inline" \
          ng-show="_brTextarea.help.show" \
          class="{{_brTextarea.options.columns.help}} \
            help-block br-fadein br-fadeout"> \
          <div ng-transclude></div> \
        </div> \
      </div>',
    compile: Compile
  };

  function Compile(tElement, tAttrs) {
    // transplant br-model as `ng-model` on textarea
    moveAttr(tElement, tAttrs, 'br-model', 'ng-model');
    // transplant validation to textarea element
    ['required', 'ng-minlength', 'ng-maxlength', 'pattern', 'ng-pattern'].map(
      moveAttr.bind(null, tElement, tAttrs));
    // transplant any directive prefixed with 'br-textarea-' to the textarea
    angular.forEach(tElement[0].attributes, function(attribute) {
      if(!attribute.specified) {
        return;
      }
      var attr = attribute.name;
      var normalized = tAttrs.$normalize(attr);
      if(hasBrTextareaPrefix(normalized)) {
        moveAttr(tElement, tAttrs, attr, removeBrTextareaPrefix(normalized));
      }
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

  function moveAttr(tElement, tAttrs, attr, newAttr) {
    if(!(tAttrs.$normalize(attr) in tAttrs)) {
      return;
    }

    var el = tElement.find('textarea');
    if(typeof newAttr !== 'string') {
      newAttr = attr;
    }
    el.attr(newAttr, tElement.attr(attr));
    // for backwards compatibility, don't remove br-model
    if(attr !== 'br-model') {
      tElement.removeAttr(attr);
    }
  }

  function hasBrTextareaPrefix(attr) {
    return (
      attr.length > 7 &&
      attr.indexOf('brTextarea') === 0 &&
      attr[7] === attr[7].toUpperCase());
  }

  function removeBrTextareaPrefix(attr) {
    var first = attr[7].toLowerCase();
    var rval = snake_case(first + attr.substr(8), '-');
    return rval;
  }

  // from Angular.js
  function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }
}

return {brTextarea: factory};

});
