# bedrock-angular-form ChangeLog

## [Unreleased]

## [2.2.0] - 2016-04-21

### Added
- `<br-input>` boolean option `static` that will use a `<p>` vs an `<input>`.
  Transcludes content from `<br-input-static>`.

### Changed
- More usage of `ng-bind-html` for labels.

## [2.1.2] - 2016-04-16

### Fixed
- Ensure inline inputs expand when columns are set.

## [2.1.1] - 2016-04-10

### Fixed
- Fix help animation flicker.

## [2.1.0] - 2016-04-10

### Added
- Support angular 1.5 multi-transclusion.

## [2.0.0] - 2016-04-09

### Changed
- Update to bedrock-angular 2.x.

## [1.5.3] - 2015-12-14

### Fixed
- Disable `getAll` based refresh for form library service; vocabs don't have
  a `getAll` collection end point.

## [1.5.2] - 2015-09-25

### Changed
- Improve showValidation option.

### Added
- "br:displayType" property to control how values are displayed.
- "pre" displayType for preformatted Strings.

## [1.5.1] - 2015-09-01

### Fixed
- Handle id vs object with id.

### Changed
- Implement parallel loading of vocabs.

### Added
- Support images via a contentType vocab param.
- Add option to prevent loading default vocabs.
- Add 'collapsed' option to not show properties.

## [1.5.0] - 2015-07-13

### Added
- Support displaying `id` (`@id`) via `br-form`.

### Fixed
- Add missing `bedrock.lazyCompile` angular dependency.
- Simplify angular expression conditionals.
- Remove unnecessary extra spacing via CSS.

## [1.4.1] - 2015-07-10

### Fixed
- Disable selected display when using `propertyGroup` override.

## [1.4.0] - 2015-07-10

### Added
- Support overriding `propertyGroup` for `property` in layout objects. When
  a `propertyGroup` defines its layout objects, it may now specify both
  a `property` and a `propertyGroup` to use to display the property's value.

## [1.3.1] - 2015-07-08

### Changed
- Simplified test output.

## [1.2.3] - 2015-05-31

### Added
- Future-proof support for transcluding multiple types of content.

## [1.2.2] - 2015-05-30

### Fixed
- Restore non-prefixed ng validator support.

## [1.2.1] - 2015-05-29

### Fixed
- Preserve proper scope when linking transplanted attributes.

## [1.2.0] - 2015-05-28

### Added
- Allow any attribute-based custom directive to be transplanted to the
  `input` element inside a `br-input` directive by prefixing it with
  `br-input-`.

## [1.1.0] - 2015-05-27

### Added
- Allow ng validators to be used on br-input.

## [1.0.0] - 2015-04-08

## 0.1.0 (up to early 2015)

- See git history for changes.

[Unreleased]: https://github.com/digitalbazaar/bedrock-angular-form/compare/2.2.0...HEAD
[2.2.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/2.1.2...2.2.0
[2.1.2]: https://github.com/digitalbazaar/bedrock-angular-form/compare/2.1.1...2.1.2
[2.1.1]: https://github.com/digitalbazaar/bedrock-angular-form/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.5.3...2.0.0
[1.5.3]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.5.2...1.5.3
[1.5.2]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.5.1...1.5.2
[1.5.1]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.4.1...1.5.0
[1.4.1]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.3.1...1.4.0
[1.3.1]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.2.2...1.3.1
[1.2.2]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/digitalbazaar/bedrock-angular-form/compare/0.1.0...1.0.0
