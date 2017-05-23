/*!
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
import angular from 'angular';
import BrTestFormController from './test-form-controller.js';
import BrTestFormLibraryService from './test-form-library-service.js';

var module = angular.module(
  'bedrock-angular-form-test', ['bedrock.alert', 'bedrock.form']);

module.controller('brTestFormController', BrTestFormController);
module.service('brTestFormLibraryService', BrTestFormLibraryService);
