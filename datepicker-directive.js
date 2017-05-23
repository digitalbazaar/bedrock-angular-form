/*!
 * Date picker directive.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
var templateReplaced = false;

/* @ngInject */
export default function factory($filter, $templateCache, $timeout) {
  return {
    restrict: 'E',
    scope: {
      model: '=brModel'
    },
    controller: Ctrl,
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'bedrock-angular-form/datepicker-directive.html',
    compile: Compile
  };

  function Ctrl() {
    var self = this;
    self.calendarOpen = false;

    self.showCalendar = function() {
      var isOpen = self.calendarOpen;
      $timeout(function() {
        self.calendarOpen = !isOpen;
      });
    };

    self.hideCalendar = function($event) {
      // hide calendar and lose focus
      self.calendarOpen = false;
      if($event) {
        $timeout(function() {
          $event.target.blur();
        });
      }
    };
  }

  function Compile() {
    // TODO: move template to separate file

    // TODO: remove this and instead put a datepicker directive inside
    // a stackable and reimplement only the necessary bits of
    // datepicker-popup; this would also solve the need for lazy compile and
    // z-indexing issues at the same time -- it may be possible to achieve
    // this my just replacing other datepicker-related templates w/o any
    // extra code
    if(!templateReplaced) {
      var tpl =
        '\
      <div> \
        <ul br-lazy-compile="isOpen" br-lazy-compile-id="br-datepicker-popup" \
          class="dropdown-menu" ng-style="{ \
          display: (isOpen && \'block\') || \'none\', \
          top: position.top+\'px\', left: position.left+\'px\'}" \
          ng-keydown="keydown($event)"> \
          <li ng-transclude></li> \
          <li ng-if="showButtonBar" style="padding:10px 9px 2px"> \
            <span class="btn-group pull-left"> \
              <button type="button" class="btn btn-sm btn-info" \
                ng-click="select(\'today\')">{{getText(\'current\')}}</button> \
              <button type="button" class="btn btn-sm btn-danger" \
                ng-click="select(null)">{{getText(\'clear\')}}</button> \
            </span> \
            <button type="button" class="btn btn-sm btn-success pull-right" \
              ng-click="close()">{{ getText(\'close\') }}</button> \
          </li> \
        </ul> \
      </div>';
      $templateCache.put('template/datepicker/popup.html', tpl);
      templateReplaced = true;
    }
    return Link;
  }

  function Link(scope, element, attrs, ctrl) {
    // FIXME: temporary fix for angular memory leak:
    // https://github.com/angular/angular.js/issues/10509
    var formCtrl = element.inheritedData('$formController');
    if(formCtrl) {
      // clear reference to ngModelCtrl in parent form controller
      scope.$on('$destroy', function() {
        if(formCtrl.$$success) {
          delete formCtrl.$$success.date;
          delete formCtrl.$$success['date-disabled'];
        }
        if(formCtrl.$$error) {
          delete formCtrl.$$error.date;
          delete formCtrl.$$error['date-disabled'];
        }
      });
    }

    scope.$watch(function() {
      return ctrl.model;
    }, function(value) {
      if(value) {
        if(typeof value === 'string' ||
          (ctrl.options && ctrl.options.modelType === 'string')) {
          ctrl.date = new Date(value);
        } else {
          ctrl.date = value;
        }
      }
    });

    // when date changes, update model
    var dateFilter = $filter('date');
    ctrl.change = function() {
      if(ctrl.date) {
        if(ctrl.options.time) {
          // add time option
          ctrl.date = setTime(ctrl.date, ctrl.options.time);
        }
        if(ctrl.options.modelType === 'string') {
          if(ctrl.options.modelFormat) {
            // if modelTimezone is not specified, the timezone of the browser
            // will be used
            if(ctrl.options.modelTimezone) {
              ctrl.model = dateFilter(
                ctrl.date, ctrl.options.modelFormat,
                ctrl.options.modelTimezone);
            } else {
              ctrl.model = dateFilter(ctrl.date, ctrl.options.modelFormat);
            }
          } else {
            ctrl.model = dateFilter(ctrl.date, ctrl.options.format);
          }
        } else {
          ctrl.model = ctrl.date;
        }
      }
    };

    // handle options
    attrs.brOptions = attrs.brOptions || {};
    attrs.$observe('brOptions', function(value) {
      var options = ctrl.options = scope.$eval(value) || {};
      options.format = ('format' in options) ? options.format : 'yyyy-MM-dd';
      options.modelFormat =
        ('modelFormat' in options) ? options.modelFormat : null;
      options.placeholder = options.placeholder || '';
      options.inline = ('inline' in options) ? options.inline : false;
      options.modelType = ('modelType' in options) ? options.modelType : 'date';
      options.modelTimezone =
        ('modelTimezone' in options) ? options.modelTimezone : null;

      // prefix "fa-" to icon
      if(typeof options.icon === 'string' &&
        options.icon.indexOf('fa-') !== 0) {
        options.icon = 'fa-' + options.icon;
      }

      var columns = options.columns = options.columns || {};
      if(!('label' in columns)) {
        columns.label = 'col-sm-3';
      }
      if(!('input' in columns)) {
        columns.input = 'col-sm-8';
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

      ctrl.change();
    });
  }

  function setTime(date, time) {
    date = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    date.setTime(date.getTime() + time);
    return date;
  }
}
