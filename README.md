# bedrock-angular-form

An [AngularJS][] module that provides services and directives for creating and
handling forms.  A form can also be dynamically created with a JSON based
layout model.

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

TODO

### br-form-field

TODO

### br-form-group

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

TODO

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
