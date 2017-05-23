/*!
 * Radio Button Group directive.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* @ngInject */
export default function factory() {
  return {
    restrict: 'E',
    scope: {
      model: '=brModel',
      group: '=brGroup'
    },
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    transclude: true,
    templateUrl: 'bedrock-angular-form/radio-group-directive.html',
    link: function(scope, element, attrs, ctrl) {
      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        var options = ctrl.options = scope.$eval(value) || {};
        options.inline = ('inline' in options) ? options.inline : false;
        options.help = ('help' in options) ? options.help : true;

        var columns = options.columns = options.columns || {};
        if(!('label' in columns)) {
          columns.label = 'col-sm-3';
        }
        if(!('group' in columns)) {
          columns.group = 'col-sm-8';
        }
        if(!('help' in columns)) {
          columns.help = 'col-sm-offset-3 col-sm-8';
        }
      });
    }
  };
}
