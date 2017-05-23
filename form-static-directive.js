/*!
 * Static Form Field directive.
 *
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 */
/* @ngInject */
export default function factory() {
  return {
    restrict: 'E',
    scope: true,
    transclude: {
      'br-form-static-content': '?brFormStaticContent',
      'br-form-static-help': '?brFormStaticHelp'
    },
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'bedrock-angular-form/form-static-directive.html',
    link: function(scope, element, attrs, ctrl) {
      attrs.brOptions = attrs.brOptions || {};
      attrs.$observe('brOptions', function(value) {
        var options = ctrl.options = scope.$eval(value) || {};
        options.inline = ('inline' in options) ? options.inline : false;
        options.help = ('help' in options) ? options.help : !options.inline;

        var columns = options.columns = options.columns || {};
        if(!('label' in columns)) {
          columns.label = 'col-sm-3';
        }
        if(!('content' in columns)) {
          columns.content = 'col-sm-8';
        }
        if(!('help' in columns)) {
          columns.help = 'col-sm-offset-3 col-sm-8';
        }
      });
    }
  };
}
