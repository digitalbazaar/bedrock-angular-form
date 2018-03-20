# bedrock-angular-form ChangeLog

## 4.0.0 - 2018-03-19

### Changed
- **BREAKING**: Switch to material design.
- Remove bootstrap classes from main controls.
- Update datepicker to use material.

## 3.1.2 - 2017-10-23

### Fixed
- Add missing jsonld dependency by way of bedrock-angular-jsonld.

## 3.1.1 - 2017-09-08

### Fixed
- Remove legacy code.

## 3.1.0 - 2017-09-06

### Changed
- Remove single internal use of bedrock-angular-alert to
  avoid need for the dependency. Single use was for a
  configuration or network error that may occur when
  preloading vocabularies in the form library service.
  This is not useful information for a user nor is it
  recoverable; it has been moved to use console.error().

## 3.0.8 - 2017-08-18

### Fixed
- Evaluate `brOptions` in the context of the parent scope.

## 3.0.7 - 2017-08-10

### Fixed
- Use `querySelector` for CSS selector instead of jqLite `.find`
  which only supports tag names.

## 3.0.6 - 2017-06-05

### Fixed
- Remove angular `ui-select` dependency.

## 3.0.5 - 2017-06-05

### Changed
- Remove `ui-select` dependency.

## 3.0.4 - 2017-06-02

### Fixed
- Add angular-material.css.

## 3.0.3 - 2017-05-31

### Fixed
- Ensure all input element types are updated in br-input.

## 3.0.2 - 2017-05-30

### Fixed
- Update deps.

## 3.0.1 - 2017-05-30

### Fixed
- Add `bootstrap` dependency.

## 3.0.0 - 2017-05-26

### Changed
- **BREAKING**: Switch package manager from bower to npm.
- **BREAKING**: Replace requirejs/amd with ES6 import.
- Angular 1.6.x is required.

## 2.13.3 - 2017-05-04

## Fixed
- Set error class on field when validation is visible.
- Ensure `contentElement` is found when setting event handler.

## 2.13.2 - 2017-05-01

## Fixed
- Fix bug that briefly flashed validation input.
- Remove erroneous checking for presence of error html.

## 2.13.1 - 2017-03-16

### Fixed
- Fix the default `compare` function in the `brSelect` component.

## 2.13.0 - 2017-03-10

### Added
- Add `afterLabel` help toggle positioning option.

## 2.12.1 - 2017-02-15

### Fixed
- Fix bug where options are not specified as a literal.

## 2.12.0 - 2017-02-06

### Added
- Show validation errors by default in textarea directive.
- Add default validation text in textarea directive.

## 2.11.1 - 2016-12-01

### Fixed
- Remove obsolete `version` tag from bower.json.

## 2.11.0 - 2016-12-01

### Added
- Option to position help trigger near label for form controls.

## 2.10.0 - 2016-11-04

### Added
- Directive: `sameAs` validator.

## 2.9.3 - 2016-10-14

### Changed
- Expand use of options.lowerCaseOnly in br-input.

## 2.9.2 - 2016-09-13

### Fixed
- Default `Date` fields to null instead of `new Date()`.

## 2.9.1 - 2016-07-26

### Fixed
- Check for form existence when computing validation visibility.

## 2.9.0 - 2016-07-25

### Added
- Enable showValidation by default with br-input.

## 2.8.2 - 2016-07-25

### Fixed
- Use non-selector component when no range options are given.

## 2.8.1 - 2016-07-22

### Fixed
- Always create nodes (expanded form `@id`) for range URL properties.

## 2.8.0 - 2016-07-22

### Added
- Add `lowerCaseOnly` option (true by default) for email brInput types.

## 2.7.0 - 2016-07-20

### Fixed
- Merge queue bugs.

### Changed
- Added library parameter.
- Keep track of property path.
- Lookup schema for values as needed.
- Improve correctness of data while editing.
- Improve field display. (edge cases, objects with ids)
- Index Class types.
- Warn when loading vocab ids with different data.

### Added
- Add alternate to "collapsed". Layout objects can specify "hideHierarchy" and "hideHeader" for fine display control.
- Add "headerStyle" group option.
- Add vocab Displayer type to tie a PropertyGroup to an object type.

## 2.6.1 - 2016-07-14

### Fixed
- Fix help toggle for static form components.

## 2.6.0 - 2016-07-13

### Added
- Add modelTimezone option for date picker.

## 2.5.0 - 2016-06-28

### Added
- Add modelFormat option for date picker.

## 2.4.6 - 2016-06-24

### Fixed
- Properly display form validation errors.

## 2.4.5 - 2016-06-13

### Fixed
- Don't reset library data on each vocab load. Fixes loading of multiple
  vocabs.

### Changed
- Properties and groups from multiple vocabs are merged into one collection in
  the library. Log an info message when the same id is used with identical
  data. Log a warning when the same id has different data.

## 2.4.4 - 2016-06-03

### Fixed
- Static directive template URL typo.

## 2.4.3 - 2016-05-30

### Fixed
- Fix left border radius bug when br-form-control-wrapper is
  not first child but is last.

## 2.4.2 - 2016-05-23

### Fixed
- Fix angular digest iteration bug with form groups.

## 2.4.1 - 2016-05-21

### Fixed
- Remove '{{' and '}}' from br-options expressions for
  br-input, br-textarea, and br-select. It now causes a
  parse error when it was previously required; removal
  should not change old behavior.

## 2.4.0 - 2016-05-19

### Added
- New br-form-control component to provide common functionality
  for form controls like help and validation areas.

### Fixed
- Add missing classes to ui-select in br-select.

## 2.3.4 - 2016-05-10

### Added
- Bedrock template optimization rules.

## 2.3.3 - 2016-05-05

### Fixed
- Remove broken ng-multi-transclude support.

## 2.3.2 - 2016-05-01

### Fixed
- Ensure all prefixed attributes are moved.

## 2.3.1 - 2016-04-22

### Fixed
- Remove invalid `_brInput.legacy` check to re-enable legacy br-input help syntax.

## 2.3.0 - 2016-04-21

### Added
- `<br-form-static>` directive for a properly styled static content form field.

### Removed
- `<br-input>` `static` support. The dual `br-input` and static usage caused
  initialization problems.

## 2.2.0 - 2016-04-21

### Added
- `<br-input>` boolean option `static` that will use a `<p>` vs an `<input>`.
  Transcludes content from `<br-input-static>`.

### Changed
- More usage of `ng-bind-html` for labels.

## 2.1.2 - 2016-04-16

### Fixed
- Ensure inline inputs expand when columns are set.

## 2.1.1 - 2016-04-10

### Fixed
- Fix help animation flicker.

## 2.1.0 - 2016-04-10

### Added
- Support angular 1.5 multi-transclusion.

## 2.0.0 - 2016-04-09

### Changed
- Update to bedrock-angular 2.x.

## 1.5.3 - 2015-12-14

### Fixed
- Disable `getAll` based refresh for form library service; vocabs don't have
  a `getAll` collection end point.

## 1.5.2 - 2015-09-25

### Changed
- Improve showValidation option.

### Added
- "br:displayType" property to control how values are displayed.
- "pre" displayType for preformatted Strings.

## 1.5.1 - 2015-09-01

### Fixed
- Handle id vs object with id.

### Changed
- Implement parallel loading of vocabs.

### Added
- Support images via a contentType vocab param.
- Add option to prevent loading default vocabs.
- Add 'collapsed' option to not show properties.

## 1.5.0 - 2015-07-13

### Added
- Support displaying `id` (`@id`) via `br-form`.

### Fixed
- Add missing `bedrock.lazyCompile` angular dependency.
- Simplify angular expression conditionals.
- Remove unnecessary extra spacing via CSS.

## 1.4.1 - 2015-07-10

### Fixed
- Disable selected display when using `propertyGroup` override.

## 1.4.0 - 2015-07-10

### Added
- Support overriding `propertyGroup` for `property` in layout objects. When
  a `propertyGroup` defines its layout objects, it may now specify both
  a `property` and a `propertyGroup` to use to display the property's value.

## 1.3.1 - 2015-07-08

### Changed
- Simplified test output.

## 1.2.3 - 2015-05-31

### Added
- Future-proof support for transcluding multiple types of content.

## 1.2.2 - 2015-05-30

### Fixed
- Restore non-prefixed ng validator support.

## 1.2.1 - 2015-05-29

### Fixed
- Preserve proper scope when linking transplanted attributes.

## 1.2.0 - 2015-05-28

### Added
- Allow any attribute-based custom directive to be transplanted to the
  `input` element inside a `br-input` directive by prefixing it with
  `br-input-`.

## 1.1.0 - 2015-05-27

### Added
- Allow ng validators to be used on br-input.

## 1.0.0 - 2015-04-08

## 0.1.0 (up to early 2015)

- See git history for changes.
