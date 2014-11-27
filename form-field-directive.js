/*!
 * Form field directive.
 *
 * Copyright (c) 2014 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: {
      property: '=brProperty',
      model: '=brModel'
    },
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/app/components/form/form-field.html',
    link: function(scope, element, attrs, ctrl) {
      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        ctrl.options = scope.$eval(value) || {};
      });

      ctrl.propertyId = ctrl.property.property.id;
      ctrl.schema = ctrl.property.property;
      ctrl.range = ctrl.schema.range;
      ctrl.value = ctrl.model;
      ctrl.key = ctrl.propertyId;

      // build range options, if given
      ctrl.rangeOptions = [];
      if(ctrl.property.rangeOption) {
        ctrl.selected = null;
        for(var i = 0; i < ctrl.property.rangeOption.length; ++i) {
          var opt = ctrl.property.rangeOption[i];
          var option = {
            label: opt.label,
            value: angular.copy(opt.value)
          };
          if(opt.propertyGroup) {
            option.propertyGroup = opt.propertyGroup;
          }
          ctrl.rangeOptions.push(option);
        }

        // two-bind selected.value with ctrl.value[ctrl.key]
        scope.$watch(function() {
          return ctrl.selected;
        }, function(selected) {
          if(selected) {
            ctrl.value[ctrl.key] = selected.value;
          }
        });
        scope.$watch(function() {
          return ctrl.value[ctrl.key];
        }, function(value) {
          for(var i = 0; i < ctrl.rangeOptions.length; ++i) {
            var option = ctrl.rangeOptions[i];
            if(option.value === value) {
              ctrl.selected = option;
            }
          }
        });
      }

      // setup target for value storage
      if(ctrl.propertyId in ctrl.model) {
        // use value from model
      } else if('value' in ctrl.property) {
        // use value from property description
        ctrl.value[ctrl.key] = angular.copy(ctrl.property.value);
      } else if('br:default' in ctrl.schema) {
        // use default from schema description
        ctrl.value[ctrl.key] = angular.copy(ctrl.schema['br:default']);
      } else {
        // use default value
        if(ctrl.range === 'Date') {
          ctrl.value[ctrl.key] = {
            type: 'xsd:dateTime',
            '@value': new Date()
          };
        } else {
          ctrl.value[ctrl.key] = null;
        }
      }

      // special dateTime handling
      if(ctrl.range === 'Date') {
        // FIXME: due to compaction w/bedrock form context, data should always
        // be in expanded form and stored in @value, so remove this conditional
        if(!angular.isDate(ctrl.value[ctrl.key]) &&
          angular.isObject(ctrl.value[ctrl.key])) {
          ctrl.value = ctrl.value[ctrl.key];
          ctrl.key = '@value';
        }

        // ensure date is a date object
        // FIXME: add string model support to datepicker and remove conditional
        // below
        if(!angular.isDate(ctrl.value[ctrl.key])) {
          ctrl.value[ctrl.key] = new Date(ctrl.value[ctrl.key]);
        }
      }

      // auto-select only option
      if(!ctrl.property.optional && ctrl.rangeOptions.length === 1) {
        ctrl.selected = ctrl.rangeOptions[0];
        ctrl.value[ctrl.key] = ctrl.selected.value;
      }
    }
  };
}

return {brFormField: factory};

});
