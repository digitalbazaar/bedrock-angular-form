# bedrock-angular-form ChangeLog

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
