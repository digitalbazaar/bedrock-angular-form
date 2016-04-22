/*!
 * Static Form Field directive.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 */
define([], function() {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: true,
    transclude: {
      'br-input-help': '?brInputHelp',
      'br-form-static-content': '?brFormStaticContent'
    },
    /* jshint multistr: true */
    template: '\
      <div ng-class="{ \
        \'form-group\': !options.inline, \
        \'form-group-inline\': options.inline}" \
        br-property-path="{{options.name}}" \
        class="{{(options.inline && \
          options.columns.input) || \'\'}}" \
        ng-style="{display: \
          (options.inline ? \'inline-\' : \'\') + \'block\'}"> \
        <label ng-if="options.label !== undefined" \
          class="{{options.columns.label}} control-label" \
          for="{{options.name}}" \
          br-track-state="help" \
          ng-click="help.help.pressed=!help.help.pressed; \
            help.show=!options.help.show"> \
          <a ng-if="options.help" br-help-toggle="help"><i \
            class="fa fa-question-circle"></i></a> \
          <span ng-bind-html="options.label"></span></label> \
        <div class="input-group \
          {{(!options.inline && options.columns.input) || \'\'}}" \
          ng-class="{ \
            \'input-group-inline\': (options.inline && \
            options.columns.input)}"> \
          <p class="form-control-static" \
            ng-transclude="br-form-static-content"></p> \
        </div> \
        <div ng-if="options.help && help.show" \
          class="{{options.columns.help}} help-block br-fadein br-fadeout"> \
          <div ng-if="legacy" ng-transclude class="text-muted"></div> \
          <div class="text-muted" \
            ng-transclude="br-input-help"></div> \
        </div> \
      </div>',
    link: Link
  };

  function Link(scope, element, attrs) {
    var options = scope.options = {};

    // get options
    attrs.brOptions = attrs.brOptions || {};
    attrs.$observe('brOptions', function(value) {
      scope.options = options = scope.$eval(value) || {};
      options.inline = ('inline' in options) ? options.inline : false;
      // default to no help displayed in inline mode
      options.help = ('help' in options) ? options.help : !options.inline;

      var columns = options.columns = options.columns || {};
      if(!('label' in columns)) {
        columns.label =  'col-sm-3';
      }
      if(!('static' in columns)) {
        columns.static = 'col-sm-8';
      }
      if(!('help' in columns)) {
        columns.help = 'col-sm-offset-3 col-sm-8';
      }
    });
  }
}

return {brFormStatic: factory};

});
