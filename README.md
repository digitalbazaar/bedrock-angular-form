# bedrock-angular-form

A [bedrock][] [AngularJS][] module that provides services and directives for
creating and handling forms.  A form can also be dynamically created with a
JSON based layout model.

Uses features from [bedrock-angular-alert][] and [bedrock-angular-resource][].

## Quick Examples

```html
<!-- ... TODO ... -->
<br-form
  br-model="model.data"
  br-groups="model.layout"
  br-options="{
    editable: false
  }"></br-form>
```

```js
// ... TODO ...
```

## Setup

```
bower install bedrock-angular-form
```

Installation of the module followed by a restart of your [bedrock][] server
is sufficient to make the module available to your application.

To manually add **bedrock-angular-form** as a dependency:

```js
angular.module('myapp', ['bedrock.form']);
```

## API

### br-datepicker

Show a date picker form component.

```html
<br-datepicker
  br-model="model.date"
  br-options="{
    format: 'yyyy/MM/dd',
    time: (24*60*60*1000 - 1),
    columns: {
      input: '...'
    }
  }"></br-datepicker>
```

### br-form

Display a form UI for a data model based on a layout.  The top level layout
is split into groups built with `br-form-group`.  Each group is composed of
many fields built with `br-form-field`.

```html
<br-form
  br-model="model.data"
  br-groups="model.layout"
  br-options="{
    editable: false
  }"></br-form>
```

See `brFormLibraryService` for how to create the `br-groups` data.

### br-form-field

Used by `br-form-group` to display a field.

TODO

### br-form-group

Used by `br-form` to display a group of fields.

TODO

### br-help-toggle

Helper to toggle help text.  Used with `br-track-state`.

```html
<form class="well form-vertical">
  <fieldset>
    <div class="form-group" br-property-path="label">
      <label for="name">Name</label>
      <div class="input-group">
        <span class="input-group-addon"><i class="fa fa-tag"></i></span>
        <input class="form-control" type="text" name="label"
          ng-model="model.identityLabel"
          br-track-state="model.help.identityLabel" />
        <span class="input-group-btn">
          <button class="btn btn-default"
            br-help-toggle="model.help.identityLabel">
            <i class="fa fa-question-circle"></i>
          </button>
        </span>
      </div>
      <p ng-show="model.help.identityLabel.show"
        class="help-block br-fadein br-fadeout">
        Enter your identity name.
      </p>
    </div>
  </fieldset>
</form>
```

### br-input

Show an input field form component.

```html
<br-input
  br-model="model.label"
  br-options="{
    icon: 'tag',
    name: 'label',
    label: 'Name',
    placeholder: 'Name'
  }">
  Please enter a name.
</br-input>
```

### br-input-watcher

Rate limited input watcher.

```html
<span br-input-watcher="model.search.input"
  br-input-watcher-state="model.search.state"
  br-input-change="search(input, state, callback)">
</span>
```

### br-radio-group

Show a radio group form component.

```html
<br-radio-group
  br-model="model.favoriteColor"
  br-group="[
    {label: 'Red', value: 'red'},
    {label: 'Blue', value: 'blue'},
    {label: 'Other', value: 'other'}
  ]"
  br-options="{
    inline: true,
    name: 'favoriteColor',
    label: 'Favorite Color'
  }">
  Please select your favorite color.
</br-radio-group>
```

### br-select

Show a select form component.

TODO: Note about br-display-item,

```html
<br-select
  br-model="model.type"
  br-items="model.types"
  br-display-item="item.label"
  br-options="{
    name: 'label',
    label: 'Type',
    key: 'id'
  }"></br-select>

```

### br-textarea

Show a textarea form component.

```html
<br-textarea
  br-model="model.comment"
  br-options="{
    icon: 'comment',
    name: 'comment',
    label: 'Comment',
    placeholder: 'Comment',
    rows: '3'
  }">
  Please enter a comment.
</br-textarea>
```

### br-track-state

See `br-help-toggle`.

### brFormLibraryService

`brFormLibraryService` provides helpers to manage vocabs that can be used to
create form layout data.

- **brFormLibraryService.create()**: Create a new
  `brFormLibraryService.Library`
- **Library.vocabs**: Map of all loaded vocabs indexed by id.
- **Library.hasVocabs**: Flag set if vocabs exist.
- **Library.properties**: Map of all loaded properties indexed by id.
- **Library.groups**: Map of all loaded groups indexed by id.
- **Library.hasGroups**: Flag set if groups exist.
- **Library.graph**: Flattened graph of all properties and groups.
- **Library.load(id)**: Load a vocab URI, expand and compact the data with a
  custom context, reframe in `@link` mode, then find all properties and
  property groups.

One way to use this is to have static context and vocab files on your site
and use `Library.load()` to load the vocab.

## Layout Format

The form layout is created using JSON-LD.  There are a number of custom and
common properties used in a vocab document to define properties and how they
are combined into form groups.

Properties have some common properties and the `rdfs:range` as a type.
Forms use the property types to know what type of field to display.

Propety groups have labels and comments used for display as well as a
ordered list of properties to display with options.

An example context `https://example.com/contexts/example-v1.jsonld`:

```js
{
  "@context": {
    "id": "@id",
    "type": "@type",
    "dc": "http://purl.org/dc/terms/",
    "dc11": "http://purl.org/dc/elements/1.1/",
    "dcterms": "http://purl.org/dc/terms/",
    "owl": "http://www.w3.org/2002/07/owl#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "schema": "http://schema.org/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    ...

    "owl:sameAs": {"@type": "@id"},

    "br": "urn:bedrock:",

    "layout": {"@id": "br:layout", "@type": "@id", "@container": "@list"},
    "property": {"@id": "br:property", "@type": "@id"},
    "propertyGroup": {"@id": "br:propertyGroup", "@type": "@id"},
    "optional": {"@id": "br:optional", "@type": "@xsd:boolean"},
    "resource": {"@id": "br:resource", "@type": "@id"},
    "date": {"@id": "br:date", "@type": "xsd:dateTime"},
    "domain": {"@id": "rdfs:domain",  "@type": "@vocab"},
    "range": {"@id": "rdfs:range", "@type": "@vocab"},
    "rangeOption": {
      "@id": "br:rangeOption",
      "@container": "@list"
    },
    "rangeOptionCompareProperty": {
      "@id": "br:rangeOptionCompareProperty",
      "@type": "@vocab"
    },
    "comment": "rdfs:comment",
    "label": "rdfs:label",
    "value": "rdf:value",
    "Property": "rdf:Property",
    "PropertyGroup": "br:PropertyGroup",
    "URL": "rdfs:Resource",
    "String": "rdfs:Literal",
    "Date": "xsd:dateTime",

    "ex": "https://example.com/schema/",
    "testId": "ex:testId",
    "testDate": {"@id" : "ex:testDate", "@type": "xsd:dateTime"},
    ...
  }
}
```

An example vocab `https://example.com/vocabs/example-v1.jsonld`:

```js
{
  "@context": "../contexts/example-v1.jsonld",
  "id": "https://example.com/vocabs/example-v1",
  "label": "Example Vocabulary",
  "@graph": [
    {
      "id": "https://example.com/schema/testId",
      "type": "Property",
      "label": "Test ID",
      "comment": "A test identifier.",
      "domain": "schema:Thing",
      "range": "String"
    },
    {
      "id": "https://example.com/schema/testDate",
      "type": "Property",
      "label": "Test Date",
      "comment": "A test date.",
      "domain": "schema:Thing",
      "range": "Date"
    },
    ...
    {
      "id": "https://example.com/schema/examplePropertyGroup",
      "type": "PropertyGroup",
      "label": "Example Group",
      "comment": "The custom properties for an example layout group.",
      "layout": [
        {
          "property": "https://example.com/schema/testId"
        },
        {
          "property": "https://example.com/schema/testDate"
        }
      ]
    }
    ...
  ]
}
```

## Constants

- **monthNames**: Names of months: `['January', 'February', ..., 'December']`
- **monthNumbers**: Numbers of months: `['01', '02', ..., '12']`
- **monthLabels**: Month labels suitable for a `br-select`: `[{index: 1, label: '01 - January', ...]`
- **years**: Next 10 years suitable for expiration use: `[2015, 2016, ..., 2024]`
- **countries**: Countries in sorted display order: `[..., {code: 'XY', name: 'Xxx Yyy'}, ...]`

[bedrock]: https://github.com/digitalbazaar/bedrock
[bedrock-angular]: https://github.com/digitalbazaar/bedrock-angular
[bedrock-angular-alert]: https://github.com/digitalbazaar/bedrock-angular-alert
[bedrock-angular-resource]: https://github.com/digitalbazaar/bedrock-angular-resource
[AngularJS]: https://github.com/angular/angular.js
