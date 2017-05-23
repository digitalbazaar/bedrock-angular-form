/*!
 * Form Utility service.
 *
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
import angular from 'angular';

var SNAKE_CASE_REGEXP = /[A-Z]/g;

/* @ngInject */
export default function factory() {
  var service = {};

  /**
   * Defaults for form components.
   */
  service.defaults = {
    theme: 'bootstrap'
    // theme: 'material'
  };

  /**
   * Moves an attribute (typically one that triggers a validation directive) to
   * a target element during the directive compilation phase.
   *
   * @param options the options to use:
   *          element the source element.
   *          attrs the attributes API for the element.
   *          attr the name (or array of names) of the attribute(s) to move
   *            (case should match the html presentation).
   *          [newAttr] if `attr` is a string, the new attribute name, defaults
   *            to `attr`.
   *          target the selector for finding the target element.
   */
  service.moveAttr = function(options) {
    var attr = options.attr;
    if(!angular.isArray(attr)) {
      attr = [attr];
    }
    attr.forEach(function(attr) {
      if(!(options.attrs.$normalize(attr) in options.attrs)) {
        return;
      }
      var newAttr = ('newAttr' in options) ? options.newAttr : attr;
      var el = options.element.find(options.target);
      el.attr(newAttr, options.element.attr(attr));
      // for backwards compatibility, don't remove br-model
      if(attr !== 'br-model') {
        options.element.removeAttr(attr);
      }
    });
  };

  /**
   * Moves all attributes with the given prefix a target element during the
   * directive compilation phase.
   *
   * @param options the options to use:
   *          element the source element.
   *          attrs the attributes API for the element.
   *          prefix the prefix to look for (normalized to camel case).
   *          target the selector for finding the target element.
   */
  service.movePrefixedAttrs = function(options) {
    // create a separate array of attributes to move to prevent
    // editing the attribute list while inspecting it
    var toMove = [];
    angular.forEach(options.element[0].attributes, function(attribute) {
      if(!attribute.specified) {
        return;
      }
      var attr = attribute.name;
      var normalized = options.attrs.$normalize(attr);
      if(hasAttrPrefix(normalized, options.prefix)) {
        toMove.push(angular.extend({
          attr: attr,
          newAttr: removeAttrPrefix(normalized, options.prefix)
        }, options));
      }
    });
    // move attributes
    angular.forEach(toMove, service.moveAttr);
  };

  // from Angular.js
  service.snake_case = function(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  };

  /**
   * Remove blank node ids to avoid conflicts when using copied values.
   */
  function removeBlankIds(target) {
    if(angular.isObject(target) && 'id' in target &&
      target.id.indexOf('_:') === 0) {
      delete target.id;
    }
    angular.forEach(target, function(value) {
      if(angular.isObject(value) || angular.isArray(value)) {
        removeBlankIds(value);
      }
    });
    return target;
  }

  /**
   * Copy a value and remove blank node ids.
   *
   * Used for values that have been loaded into a library and processing has
   * assigned blank node ids.
   *
   * @param options
   *          idOnly: if object, only copy id
   *
   * @return copy of value
   */
  service.copyValue = function(target, options) {
    if(angular.isObject(target) && options && options.idOnly) {
      if(target.id) {
        return removeBlankIds({id: target.id});
      }
      return {};
    }
    return removeBlankIds(angular.copy(target));
  };

  function hasAttrPrefix(attr, prefix) {
    return (
      attr.length > prefix.length &&
      attr.indexOf(prefix) === 0 &&
      attr[prefix.length] === attr[prefix.length].toUpperCase());
  }

  function removeAttrPrefix(attr, prefix) {
    var first = attr[prefix.length].toLowerCase();
    return service.snake_case(first + attr.substr(prefix.length + 1), '-');
  }

  return service;
}
