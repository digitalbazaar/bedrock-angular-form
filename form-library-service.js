/*!
 * Form library service.
 *
 * Copyright (c) 2014 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
define(['angular', 'jsonld'], function(angular, jsonld) {

'use strict';

/* @ngInject */
function factory(
  $rootScope, config, brAlertService, brRefreshService, brResourceService) {
  var service = {};

  // collection of all vocabs
  service.collection = new brResourceService.Collection();

  service._CONTEXT = {
    '@context': {
      id: '@id',
      type: '@type',
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      schema: "http://schema.org/",
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      br: 'urn:bedrock:',
      layout: {'@id': 'br:layout', '@type': '@id', '@container': '@list'},
      property: {'@id': 'br:property', '@type': '@id'},
      propertyGroup: {'@id': 'br:propertyGroup', '@type': '@id'},
      optional: {'@id': 'br:optional', '@type': '@xsd:boolean'},
      resource: {'@id': 'br:resource', '@type': '@id'},
      date: {'@id': 'br:date', '@type': 'xsd:dateTime'},
      domain: {'@id': 'rdfs:domain',  '@type': '@id'},
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
      comment: 'rdfs:comment',
      contentType: 'br:contentType',
      displayType: 'br:displayType',
      label: 'rdfs:label',
      value: 'rdf:value',
      Property: 'rdf:Property',
      PropertyGroup: 'br:PropertyGroup',
      Date: "xsd:dateTime",
      String: "rdfs:Literal",
      URL: "rdfs:Resource"
    }
  };

  // frames properties and property groups
  var FRAME = {
    '@context': service._CONTEXT['@context'],
    type: ['Property', 'PropertyGroup']
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
    // flattened graph of all properties and groups
    self.graph = {'@context': service._CONTEXT['@context'], '@graph': []};

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

  /* A private queue for ensuring vocabularies are merged in the order
  they are loaded; allows fetching to occur asynchronously prior to merging. */
  var mergeQueue = [];

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
    return promise.then(function(vocab) {
      return jsonld.promises.expand(vocab, options);
    }).then(function(vocab) {
      // compact with standard context
      return jsonld.promises.compact(
        vocab, service._CONTEXT, {skipExpansion: true});
    }).then(function(vocab) {
      mergeQueue.push({
        id: id,
        vocab: vocab
      });
      return _mergeVocabs();
    }).then(function() {
      return self.vocabs[id];
    });

    // Note: If an error occurs while any vocab is loading, the entire
    // library is considered defunct; it's not considered easy to recover
    // a library where one vocab fails to load.

    function _mergeVocabs() {
      if(mergeQueue.length === 0 || mergeQueue.length > 1) {
        return Promise.resolve();
      }

      // merge in new vocab w/o merging existing nodes
      var state = mergeQueue.pop();
      return jsonld.promises.merge(
        [self.graph, state.vocab], null, {mergeNodes: false})
        .then(function(merged) {
          state.graph = merged;
          // reframe merged data w/properties and groups filtered and linked
          return jsonld.promises.frame(merged, FRAME, {embed: '@link'});
        }).then(function(framed) {
          // store vocab and update graph
          self.vocabs[state.id] = state.vocab;
          self.hasVocabs = true;
          self.graph = state.graph;

          // build property and group indexes
          self.properties = {};
          self.groups = {};
          self.hasGroups = false;
          var nodes = jsonld.getValues(framed, '@graph');
          angular.forEach(nodes, function(node) {
            // raise conflict exception, overwrite silently?
            if(jsonld.hasValue(node, 'type', 'Property')) {
              self.properties[node.id] = node;
            } else if(jsonld.hasValue(node, 'type', 'PropertyGroup')) {
              self.groups[node.id] = node;
              self.hasGroups = true;
            }
          });
          return _mergeVocabs();
        });
    }
  };

  // register for system-wide refreshes
  brRefreshService.register(service.collection);

  // expose service to scope
  $rootScope.app.services.form = service;

  return service;
}

return {brFormLibraryService: factory};

});
