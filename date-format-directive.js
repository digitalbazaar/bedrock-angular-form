/*!
 * Date picker directive.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* @ngInject */
export default function factory($filter) {
  // FIXME: this directive is merely a bug fix for ui-bootstrap datepicker
  // rendering (enforces the date format and prevents date changes while
  // the input field is in focus); remove it once the bug is fixed
  // TODO: submit PR (that uses formatters, etc. instead of replacing $render)
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      var dateFormat = 'yyyy-MM-dd';
      var dateFilter = $filter('date');
      ctrl.$render = function() {
        if(element.is(':focus')) {
          return;
        }
        element.val(dateFilter(ctrl.$modelValue, dateFormat));
      };
      attrs.$observe('brDateFormat', function(value) {
        dateFormat = value;
      });
    }
  };
}
