/*!
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* globals expect */
var bedrock = GLOBAL.bedrock;

bedrock.testInBrowser('textarea-directive', function($injector) {

  var $compile = $injector.get('$compile');
  var $rootScope = $injector.get('$rootScope');
  var $scope, element;

  beforeEach(function() {
    $scope = $rootScope.$new();
    element = $compile('<div></div>')($scope);
  });

  afterEach(function() {
    element.remove();
  });

  it('should create a textarea with the proper attributes', function() {
    $scope.testOption = {
      icon: 'comment',
      name: 'testName',
      label: 'Test Label',
      placeholder: 'Test Placeholder',
      rows: '3',
      wrap: 'hard'
    };

    // test setup
    element.append($compile(
      '<br-textarea \
        br-model="model.testModel" \
        br-options="testOption"> \
        Example help text. \
      </br-textarea>'
    )($scope));

    /*
    element.append($compile(
      '<br-textarea \
        br-model="model.testModel" \
        br-options="{ \
          icon: \'comment\', \
          name: \'testName\', \
          label: \'Test Label\', \
          placeholder: \'Test Placeholder\', \
          rows: \'3\', \
          wrap: \'hard\' \
        }"> \
        Example help text. \
      </br-textarea>'
    )($scope));
    */

    $scope.$apply();
    expect(element.find('label'), 'label should exist')
      .to.have.length.above(0);
    expect(element.find('label')
      .text().trim(), 'label should contain proper text')
      .to.equal('Test Label');
    expect(element.find('textarea'), 'textarea should exist')
      .to.have.length.above(0);
    expect(element.find('textarea')
      .attr('name'), 'Name Attribute').to.equal('testName');
    expect(element.find('textarea')
      .attr('placeholder'), 'Placeholder Attribute')
      .to.equal('Test Placeholder');
    expect(element.find('textarea')
      .attr('rows'), 'Rows Attribute').to.equal('3');
    expect(element.find('textarea')
      .attr('wrap'), 'Wrap Attribute').to.equal('hard');
  });

});
