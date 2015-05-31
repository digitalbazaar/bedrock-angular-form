/*
 * Bedrock Configuration.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var fs = require('fs');
var path = require('path');

module.exports = function(bedrock) {
  var prepare = path.join(__dirname, 'prepare.js');
  if(bedrock.config.protractor && fs.existsSync(prepare)) {
    var protractor = bedrock.config.protractor.config;
    // add protractor tests
    protractor.suites['bedrock-angular-form'] =
      path.join(__dirname, './tests/**/*.js');
    protractor.params.config.onPrepare.push(prepare);
  }

  // ignore angular-ui-select templates
  var ignore = bedrock.config.views.angular.optimize.templates.ignore;
  ignore.packages.push('ui-select');
};
