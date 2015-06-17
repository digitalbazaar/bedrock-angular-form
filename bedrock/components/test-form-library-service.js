define([], function() {

'use strict';

/* @ngInject */
function factory(brFormLibraryService) {
  var service = {};

  service.CONTEXT = {
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
      comment: 'rdfs:comment',
      label: 'rdfs:label',
      value: 'rdf:value',
      Property: 'rdf:Property',
      PropertyGroup: 'br:PropertyGroup',
      URL: "rdfs:Resource",
      String: "rdfs:Literal",
      Date: "xsd:dateTime"
    }
  };

  var vocab = {
    "@context": [
      service.CONTEXT, {"t2": "urn:bedrock-test-2:"}
    ],
    "id": "t2:library-v1",
    "label": "Test #2 Property Library V1",
    "@graph": [
      {
        "id": "t2:test",
        "type": "owl:Ontology",
        "dc:abstract": "This document describes a number of classes and properties for use in testing the Bedrock vocab features.",
        "label": "Bedrock Test Vocabulary",
        "comment": "This document describes a number of classes and properties for use in testing the Bedrock vocab features."
      },

      {
        "id": "br:PropertyGroup",
        "type": "owl:Class",
        "label": "Property Group",
        "comment": "A group of related properties."
      },
      {
        "id": "br:layout",
        "type": "rdf:Property",
        "label": "PropertyGroup Layout",
        "comment": "An ordered list of Properties and PropertyGroups.",
        "domain": "br:PropertyGroup"
      },

      {
        "id": "t2:resource",
        "type": "rdf:Property",
        "label": "Test Resource URL",
        "comment": "A resource URL.",
        "domain": "schema:Thing",
        "range": "rdfs:Resource",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:resource2",
        "type": "rdf:Property",
        "label": "2nd Test Resource URL",
        "comment": "A resource URL.",
        "domain": "schema:Thing",
        "range": "rdfs:Resource",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:string",
        "type": "rdf:Property",
        "label": "Test String",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "rdfs:Literal",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:string2",
        "type": "rdf:Property",
        "label": "2nd Test String (w/ default)",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "rdfs:Literal",
        "vs:term_status": "unstable",
        "br:default": "default string2"
      },
      {
        "id": "t2:string3",
        "type": "rdf:Property",
        "label": "3nd Test String (w/o default)",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "rdfs:Literal",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:string4",
        "type": "rdf:Property",
        "label": "4th Test String (w/ default)",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "rdfs:Literal",
        "vs:term_status": "unstable",
        "br:default": "default string4"
      },
      {
        "id": "t2:date",
        "type": "rdf:Property",
        "label": "Test Date",
        "comment": "A date and time. The value MUST be expressed using an ISO-8601 date/time string.",
        "domain": "schema:Thing",
        "range": "xsd:dateTime",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:image",
        "type": "rdf:Property",
        "owl:sameAs": "schema:image",
        "label": "Test Image",
        "comment": "A image URL.",
        "domain": "schema:Thing",
        "range": "rdfs:Resource",
        "vs:term_status": "unstable"
      },

      {
        "id": "t2:kitchen-sink",
        "type": "br:PropertyGroup",
        "label": "Test #2 Kitchen Sink Properties",
        "comment": "A test of various properties.",
        "layout": [
          {
            "property": "t2:resource",
            "value": null
          },
          {
            "property": "t2:string",
            "value": "string default"
          },
          {
            "property": "t2:string2"
          },
          {
            "property": "t2:string4",
            "value": "override of string4 default"
          },
          {
            "property": "t2:image"
          },
          {
            "property": "t2:date",
            "value": {
              "type": "xsd:dateTime",
              "@value": "2014-10-29T12:00:00-04:00"
            }
          }
        ]
      }
    ]
  };

  service.getLibrary = function() {
    var library = brFormLibraryService.create();
    return library.load(vocab);
  };

  return service;
}

return {brTestFormLibraryService: factory};

});
