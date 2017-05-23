/*
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var fs = require('fs');
var path = require('path');

require('bedrock-express');
require('bedrock-protractor');
require('bedrock-views');

var config = bedrock.config;
var dir = path.join(__dirname, '..');

// add bedrock-angular-form bower package
config.requirejs.bower.packages.push({
  path: dir,
  manifest: JSON.parse(fs.readFileSync(
    path.join(dir, 'bower.json'), {encoding: 'utf8'}))
});

// add test bower package
config.requirejs.bower.packages.push({
  path: path.join(__dirname, 'components'),
  manifest: {
    name: 'bedrock-angular-form-test-components',
    moduleType: 'amd',
    main: './main.js',
    dependencies: {
      angular: '~1.3.0'
    }
  }
});

config.views.paths.push(path.join(__dirname, 'views'));

bedrock.start();
