/*!
 * Form field directive.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
define(['angular', 'jsonld'], function(angular, jsonld) {

'use strict';

/* @ngInject */
function factory(brFormUtilsService) {
  return {
    restrict: 'E',
    scope: {
      library: '<?brLibrary',
      model: '=brModel',
      path: '<?brPath',
      property: '=brProperty'
    },
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: requirejs.toUrl('bedrock-angular-form/form-field.html'),
    link: function(scope, element, attrs, ctrl) {
      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        ctrl.options = scope.$eval(value) || {};
        if(ctrl.options.editable) {
          ctrl.valueSchema = null;
        } else {
          lookupValue();
        }
      });

      // property is for @id
      if(ctrl.property.property === 'id') {
        ctrl.propertyId = 'id';
        ctrl.schema = {
          label: 'ID',
          range: 'URL'
        };
      } else {
        ctrl.propertyId = ctrl.property.property.id;
        ctrl.schema = ctrl.property.property;
      }
      ctrl.propertyGroups = jsonld.getValues(ctrl.property, 'propertyGroup');
      ctrl.range = ctrl.schema.range;
      ctrl.value = ctrl.model;
      ctrl.valueSchema = null;
      ctrl.key = ctrl.propertyId;
      ctrl.rangeOptions = [];
      ctrl.selected = null;

      if(ctrl.property.rangeOption) {
        // build range options
        for(var i = 0; i < ctrl.property.rangeOption.length; ++i) {
          var opt = ctrl.property.rangeOption[i];
          var option = {
            label: opt.label,
            // FIXME: add support for non-idOnly values
            value: brFormUtilsService.copyValue(opt.value, {idOnly: true})
          };
          if(opt.propertyGroup) {
            option.propertyGroup = opt.propertyGroup;
          }
          ctrl.rangeOptions.push(option);
        }

        if(ctrl.property.rangeOptionCompareProperty) {
          // compare two range options for equality based on the given property
          ctrl.compare = function(item1, item2) {
            if(!angular.isObject(item1) || !angular.isObject(item2)) {
              return (item1 === item2);
            }
            return (item1[ctrl.property.rangeOptionCompareProperty] ===
              item2[ctrl.property.rangeOptionCompareProperty]);
          };
        } else {
          // compare two range options based on simple equality
          ctrl.compare = function(item1, item2) {
            return item1 === item2;
          };
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
          if(value === undefined) {
            initValue();
            return;
          }

          // update selection to matching range option
          for(var i = 0; i < ctrl.rangeOptions.length; ++i) {
            var option = ctrl.rangeOptions[i];
            if(ctrl.compare(option.value, value)) {
              ctrl.selected = option;
              ctrl.selected.value = value;
            }
          }
        });
      }

      // update path
      ctrl.path = ctrl.path ? ctrl.path.slice() : [];
      ctrl.path.push({
        property: ctrl.property
      });

      if(ctrl.value[ctrl.key] === undefined) {
        initValue();
      }

      function initValue() {
        if(!ctrl.property.optional && ctrl.rangeOptions.length === 1) {
          // auto-select only option
          ctrl.selected = ctrl.rangeOptions[0];
          ctrl.value[ctrl.key] = ctrl.selected.value;
          return;
        }

        if('value' in ctrl.property) {
          // use value from property description
          ctrl.value[ctrl.key] =
            // FIXME: add support for non-idOnly values
            brFormUtilsService.copyValue(ctrl.property.value, {idOnly: true});
        } else if('br:default' in ctrl.schema) {
          // use default from schema description
          ctrl.value[ctrl.key] =
            // FIXME: add support for non-idOnly values
            brFormUtilsService.copyValue(
              ctrl.schema['br:default'], {idOnly: true});
        } else {
          // use default value
          if(ctrl.range === 'Date') {
            ctrl.value[ctrl.key] = {
              type: 'xsd:dateTime',
              '@value': null
            };
          } else {
            ctrl.value[ctrl.key] = null;
          }
        }
      }

      // lookup value as needed for display
      function lookupValue() {
        if(ctrl.library && ctrl.schema.range === 'URL') {
          var id;
          if(angular.isString(ctrl.value[ctrl.key])) {
            id = ctrl.value[ctrl.key];
          } else if(angular.isObject(ctrl.value[ctrl.key]) &&
            Object.keys(ctrl.value[ctrl.key]).length === 1 &&
            'id' in ctrl.value[ctrl.key]) {
            id = ctrl.value[ctrl.key].id;
          }
          if(id) {
            ctrl.valueSchema = ctrl.library.classes[id] ||
              ctrl.library.properties[id];
          }
        }
      }
    }
  };
}

return {brFormField: factory};

});
