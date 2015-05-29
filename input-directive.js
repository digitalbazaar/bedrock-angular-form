/*!
 * Input directive.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define(['angular'], function(angular) {

'use strict';

var SNAKE_CASE_REGEXP = /[A-Z]/g;

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    // compile prior to other directives to ensure directives to be
    // moved to the input element are moved prior to their compilation
    priority: 1,
    scope: {
      model: '=brModel'
    },
    transclude: true,
    /* jshint multistr: true */
    template: '\
      <div ng-class="{ \
        \'form-group\': !options.inline, \
        \'form-group-inline\': options.inline}" \
        br-property-path="{{options.name}}" \
        class="{{(options.inline && options.columns.input) || \'\'}}" \
        ng-style="{display: \
          (options.inline ? \'inline-\' : \'\') + \'block\'}"> \
        <label ng-if="options.label !== undefined" \
          class="{{options.columns.label}} control-label" \
          for="{{options.name}}">{{options.label}}</label> \
        <div class="input-group \
          {{(!options.inline && options.columns.input) || \'\'}}"> \
          <span ng-if="options.icon" \
            class="input-group-addon"><i \
            class="fa {{options.icon}}"></i></span> \
          <span ng-if="options.image" \
            class="input-group-addon"><img \
            ng-src="{{options.image}}"></img></span> \
          <input class="form-control" \
            type="{{options.type}}" \
            name="{{options.name}}" \
            placeholder="{{options.placeholder}}" \
            ng-model="model" \
            ng-disabled="options.disabled" \
            br-track-state="help" \
            ng-class="{\'br-help-off\': !options.help}"/> \
          <span ng-if="options.loading" \
            class="br-spinner-inside-input"> \
            <i class="fa fa-refresh fa-spin text-muted"></i> \
          </span> \
          <span ng-if="options.help" class="input-group-btn"> \
            <button type="button" class="btn btn-default" \
              br-help-toggle="help"> \
              <i class="fa fa-question-circle"></i> \
            </button> \
          </span> \
        </div> \
        <div ng-if="options.help" ng-show="help.show" \
          class="{{options.columns.help}} help-block br-fadein br-fadeout"> \
          <div ng-transclude></div> \
        </div> \
      </div>',
    compile: Compile
  };

  function Compile(tElement, tAttrs) {
    // transplant validation to input element
    ['required', 'ng-minlength', 'ng-maxlength', 'pattern', 'ng-pattern'].map(
      moveAttrToInput.bind(null, tElement, tAttrs));
    // transplant any directive prefixed with 'br-input-' to the input element
    angular.forEach(tElement[0].attributes, function(attribute) {
      if(!attribute.specified) {
        return;
      }
      var attr = attribute.name;
      var normalized = tAttrs.$normalize(attr);
      if(hasBrInputPrefix(normalized)) {
        moveAttrToInput(
          tElement, tAttrs, attr, removeBrInputPrefix(normalized));
      }
    });

    return function(scope, element, attrs) {
      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        var options = scope.options = scope.$eval(value) || {};
        options.inline = ('inline' in options) ? options.inline : false;
        options.type = options.type || 'text';
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

        if('maxLength' in options) {
          element.find('input').attr('maxlength', options.maxLength);
        } else {
          element.find('input').removeAttr('maxlength');
        }

        if('autocomplete' in options) {
          element.find('input').attr('autocomplete', options.autocomplete);
        } else {
          element.find('input').removeAttr('autocomplete');
        }

        if(options.autofocus) {
          element.find('input').attr('autofocus', 'autofocus');
        } else {
          element.find('input').removeAttr('autofocus');
        }

        if(options.readonly) {
          element.find('input').attr('readonly', 'readonly');
        } else {
          element.find('input').removeAttr('readonly');
        }
      });
    };
  }

  function moveAttrToInput(tElement, tAttrs, attr, newAttr) {
    if(!(tAttrs.$normalize(attr) in tAttrs)) {
      return;
    }

    var input = tElement.find('input');
    if(newAttr === undefined) {
      newAttr = attr;
    }
    input.attr(newAttr, tElement.attr(attr));
    tElement.removeAttr(attr);
  }

  function hasBrInputPrefix(attr) {
    return (
      attr.length > 7 &&
      attr.indexOf('brInput') === 0 &&
      attr[7] === attr[7].toUpperCase());
  }

  function removeBrInputPrefix(attr) {
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

return {brInput: factory};

});
