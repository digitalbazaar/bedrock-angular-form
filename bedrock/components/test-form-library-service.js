define([], function() {

'use strict';

/* @ngInject */
function factory(brFormLibraryService) {
  var service = {};

  service.CONTEXT = brFormLibraryService._CONTEXT;

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
        "id": "PropertyGroup",
        "type": "owl:Class",
        "label": "Property Group",
        "comment": "A group of related properties."
      },
      {
        "id": "br:layout",
        "type": "Property",
        "label": "PropertyGroup Layout",
        "comment": "An ordered list of Properties and PropertyGroups.",
        "domain": "PropertyGroup"
      },

      {
        "id": "t2:resource",
        "type": "Property",
        "label": "Test Resource URL",
        "comment": "A resource URL.",
        "domain": "schema:Thing",
        "range": "URL",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:resource2",
        "type": "Property",
        "label": "2nd Test Resource URL",
        "comment": "A resource URL.",
        "domain": "schema:Thing",
        "range": "URL",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:string",
        "type": "Property",
        "label": "Test String",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "String",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:string2",
        "type": "Property",
        "label": "2nd Test String (w/ default)",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "String",
        "vs:term_status": "unstable",
        "br:default": "default string2"
      },
      {
        "id": "t2:string3",
        "type": "Property",
        "label": "3nd Test String (w/o default)",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "String",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:string4",
        "type": "Property",
        "label": "4th Test String (w/ default)",
        "comment": "A string.",
        "domain": "schema:Thing",
        "range": "String",
        "vs:term_status": "unstable",
        "br:default": "default string4"
      },
      {
        "id": "t2:date",
        "type": "Property",
        "label": "Test Date",
        "comment": "A date and time. The value MUST be expressed using an ISO-8601 date/time string.",
        "domain": "schema:Thing",
        "range": "Date",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:image",
        "type": "Property",
        "owl:sameAs": "schema:image",
        "label": "Test Image",
        "comment": "A image URL.",
        "domain": "schema:Thing",
        "range": "URL",
        "vs:term_status": "unstable"
      },
      {
        "id": "t2:kitchen-sink",
        "type": "PropertyGroup",
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
              "type": "Date",
              "@value": "2014-10-29T12:00:00-04:00"
            }
          }
        ]
      }
    ]
  };

  service.getLibrary = function() {
    var library = brFormLibraryService.create();
    return library.load(vocab).then(function() {
      return library;
    });
  };

  return service;
}

return {brTestFormLibraryService: factory};

});
