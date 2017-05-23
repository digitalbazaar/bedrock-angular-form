/*!
 * Form library service.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
import angular from 'angular';
import jsonld from 'jsonld';

/* @ngInject */
export default function factory(
  $rootScope, config, brAlertService, brResourceService) {
  var service = {};

  // collection of all vocabs
  service.collection = new brResourceService.Collection();

  service._CONTEXT = {
    '@context': {
      id: '@id',
      type: '@type',
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      schema: 'http://schema.org/',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      br: 'urn:bedrock:',
      layout: {'@id': 'br:layout', '@type': '@id', '@container': '@list'},
      property: {'@id': 'br:property', '@type': '@id'},
      propertyGroup: {'@id': 'br:propertyGroup', '@type': '@id'},
      optional: {'@id': 'br:optional', '@type': '@xsd:boolean'},
      resource: {'@id': 'br:resource', '@type': '@id'},
      date: {'@id': 'br:date', '@type': 'xsd:dateTime'},
      domain: {'@id': 'rdfs:domain', '@type': '@id'},
      range: {'@id': 'rdfs:range', '@type': '@vocab'},
      rangeOption: {
        '@id': 'br:rangeOption',
        '@container': '@list'
      },
      rangeOptionCompareProperty: {
        '@id': 'br:rangeOptionCompareProperty',
        '@type': '@vocab'
      },
      collapsed: {'@id': 'br:collapsed', '@type': 'xsd:boolean'},
      hideHeader: {'@id': 'br:hideHeader', '@type': 'xsd:boolean'},
      hideHierarchy: {'@id': 'br:hideHierarchy', '@type': 'xsd:boolean'},
      headerStyle: {'@id': 'br:headerStyle', '@type': '@vocab'},
      GroupLabel: 'br:GroupLabel',
      PathLabel: 'br:PathLabel',
      comment: 'rdfs:comment',
      contentType: 'br:contentType',
      displayType: 'br:displayType',
      label: 'rdfs:label',
      value: 'rdf:value',
      Property: 'rdf:Property',
      PropertyGroup: 'br:PropertyGroup',
      Class: 'rdfs:Class',
      Date: 'xsd:dateTime',
      String: 'rdfs:Literal',
      URL: 'rdfs:Resource',
      Displayer: 'br:Displayer',
      displayerFor: {'@id': 'br:displayerFor', '@type': '@id'}
    }
  };

  // frames properties and property groups
  var FRAME = {
    '@context': service._CONTEXT['@context'],
    type: ['Class', 'Displayer', 'Property', 'PropertyGroup']
  };

  service.create = function(options) {
    return new Library(options);
  };

  function Library(options) {
    var self = this;
    options = options || {};

    // all loaded vocabs
    self.vocabs = {};
    self.hasVocabs = false;
    // all properties from all loaded vocabs
    self.properties = {};
    // all groups from all loaded vocabs
    self.groups = {};
    self.hasGroups = false;
    // all classes from all loaded vocabs
    self.classes = {};
    // all displayers
    self.displayers = {};
    // flattened graph of all properties and groups
    self.graph = {'@context': service._CONTEXT['@context'], '@graph': []};

    /* A private queue for ensuring vocabularies are merged in the order
    they are loaded; allows fetching to occur asynchronously prior to
    merging. */
    self._mergeQueue = [];

    // TODO: move code below to `load` function and change load API so
    // `load` may only be called once per library (and must be called
    // to initialize it) ... and the options must include all vocabs
    // that are to be loaded (or the `options.loadVocabs` flag is
    // set which will load everything from the config); this change is
    // necessary to create a consistent view of a library

    // preload configured vocabs
    if(config.data.forms && options.loadVocabs !== false) {
      Promise.all((config.data.forms.vocabs || []).map(function(id) {
        var options = {};
        if(typeof id !== 'string') {
          options.vocab = id;
          id = id.id;
        }
        return self.load(id, options);
      })).catch(function(err) {
        brAlertService.add('error', err);
      }).then(function() {
        $rootScope.$apply();
      });
    }
  }

  Library.prototype.load = function(id, options) {
    var self = this;
    options = angular.extend({}, options || {});
    if(typeof id !== 'string') {
      throw new Error('id must be a string.');
    }

    var promise;
    if('vocab' in options) {
      promise = Promise.resolve(options.vocab);
    } else {
      promise = service.collection.get(id);
      if(!('base' in options)) {
        // expand with base to resolve relative context urls
        options.base = id;
      }
    }

    promise = promise.then(function(vocab) {
      return jsonld.promises.expand(vocab, options);
    }).then(function(vocab) {
      // compact with standard context
      return jsonld.promises.compact(
        vocab, service._CONTEXT, {skipExpansion: true});
    });

    return new Promise(function(resolve, reject) {
      self._mergeQueue.push({
        id: id,
        promise: promise,
        resolve: resolve,
        reject: reject
      });
      if(self._mergeQueue.length === 1) {
        _mergeVocab();
      }
    }).then(function() {
      return self.vocabs[id];
    });

    /**
     * Check if two partial JSON-LD objects are equal. Only uses basic JSON
     * comparisons and assumes similar compacted data. Special equality
     * function needed in order to ignore blank node ids.
     */
    function _equals(o1, o2) {
      // TODO: track object stack to avoid loops
      if(o1 === o2) {
        return true;
      }
      if(typeof o1 !== typeof o2) {
        return false;
      }
      var i;
      if(angular.isArray(o1)) {
        for(i = 0; i < o1.length; ++i) {
          if(!_equals(o1[i], o2[i])) {
            return false;
          }
        }
        return true;
      }
      if(angular.isObject(o1)) {
        var key;
        var seen = {};
        for(key in o1) {
          if(key === 'id' && o1[key].indexOf('_:') === 0) {
            continue;
          }
          if(!(key in o2) || !_equals(o1[key], o2[key])) {
            return false;
          }
          seen[key] = true;
        }
        for(key in o2) {
          if(key === 'id' && o2[key].indexOf('_:') === 0) {
            continue;
          }
          if(!(key in seen)) {
            return false;
          }
        }
        return true;
      }
      return false;
    }

    // Note: If an error occurs while any vocab is loading, the entire
    // library is considered defunct; it's not considered easy to recover
    // a library where one vocab fails to load.

    function _mergeVocab() {
      // merge in new vocab w/o merging existing nodes
      var state = self._mergeQueue[0];
      return state.promise.then(function(vocab) {
        state.vocab = vocab;
      }).then(function() {
        return jsonld.promises.merge(
          [self.graph, state.vocab], null, {mergeNodes: false});
      }).then(function(merged) {
        state.graph = merged;
        // reframe merged data w/properties and groups filtered and linked
        return jsonld.promises.frame(merged, FRAME, {embed: '@link'});
      }).catch(function(err) {
        self._mergeQueue.shift();
        state.reject(err);
        throw err;
      }).then(function(framed) {
        // store vocab and update graph
        if(state.id in self.vocabs) {
          if(_equals(state.vocab, self.vocabs[state.id])) {
            // console.info('Duplicate vocab ID with equal data:',
            //  state.id, 'data:', state.vocab);
          } else {
            console.warn(
              'Duplicate vocab ID with conflicting data:',
              state.id, 'old:', self.vocabs[state.id], 'new:', state.vocab);
          }
        }
        self.vocabs[state.id] = state.vocab;
        self.hasVocabs = true;
        self.graph = state.graph;

        // build property and group indexes
        var nodes = jsonld.getValues(framed, '@graph');
        angular.forEach(nodes, function(node) {
          // raise conflict exception, overwrite silently?
          if(jsonld.hasValue(node, 'type', 'Property')) {
            if(node.id in self.properties) {
              if(_equals(node, self.properties[node.id])) {
                // console.info('Duplicate property ID with equal data:',
                //  node.id, 'vocab:', state.id, 'data:', node);
              } else {
                console.warn(
                  'Duplicate property ID with conflicting data:',
                  node.id, 'vocab:', state.id,
                  'old:', self.properties[node.id], 'new:', node);
              }
            }
            self.properties[node.id] = node;
          } else if(jsonld.hasValue(node, 'type', 'PropertyGroup')) {
            if(node.id in self.groups) {
              if(_equals(node, self.groups[node.id])) {
                // console.info('Duplicate group ID with equal data:',
                //  node.id, 'vocab:', state.id, 'data:', node);
              } else {
                console.warn(
                  'Duplicate group ID with conflicting data:',
                  node.id, 'vocab:', state.id,
                  'old:', self.groups[node.id], 'new:', node);
              }
            }
            self.groups[node.id] = node;
            self.hasGroups = true;
          } else if(jsonld.hasValue(node, 'type', 'Class')) {
            if(node.id in self.classes) {
              if(_equals(node, self.classes[node.id])) {
                // console.info('Duplicate class ID with equal data:',
                //  node.id, 'vocab:', state.id, 'data:', node);
              } else {
                console.warn(
                  'Duplicate class ID with conflicting data:',
                  node.id, 'vocab:', state.id,
                  'old:', self.classes[node.id], 'new:', node);
              }
            }
            self.classes[node.id] = node;
          } else if(jsonld.hasValue(node, 'type', 'Displayer')) {
            if(node.id in self.displayers) {
              if(_equals(node, self.displayers[node.id])) {
                // console.info('Duplicate class ID with equal data:',
                //  node.id, 'vocab:', state.id, 'data:', node);
              } else {
                console.warn(
                  'Duplicate displayer ID with conflicting data:',
                  node.id, 'vocab:', state.id,
                  'old:', self.displayers[node.id], 'new:', node);
              }
            }
            self.displayers[node.id] = node;
          } else {
            console.warn('Unknown type:',
              node.id, 'vocab:', state.id, 'node:', node);
          }
        });

        self._mergeQueue.shift();
        state.resolve();

        // more to merge
        if(self._mergeQueue.length > 0) {
          _mergeVocab();
        }
      });
    }
  };

  // TODO: does refresh make sense for vocabs?
  // register for system-wide refreshes
  // brRefreshService.register(service.collection);

  // expose service to scope
  $rootScope.app.services.form = service;

  return service;
}
