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
    templateUrl: requirejs.toUrl('bedrock-angular-form/form-static-directive'),
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
