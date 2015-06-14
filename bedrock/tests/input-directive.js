var bedrock = GLOBAL.bedrock;

bedrock.testInBrowser('br-input', function($injector) {

var chai = require('chai');
var expect = chai.expect;

describe('input-directive unit tests', function() {
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

  it('should create a text input with the proper attributes', function() {
    $scope.testOption = {
      type: 'text',
      icon: 'comment',
      name: 'testName',
      label: 'Test Label',
      placeholder: 'Test Placeholder'
    };

    // test setup
    element.append($compile(
      '<br-input \
        br-model="model.testModel" \
        br-options="testOption"> \
        Example help text. \
      </br-textarea>'
    )($scope));
    $scope.$apply();
    expect(element.find('label'), 'label should exist')
      .to.have.length.above(0);
    expect(element.find('label')
      .text().trim(), 'label should contain proper text')
      .to.equal('Test Label');
    expect(element.find('input'), 'input should exist')
      .to.have.length.above(0);
    expect(element.find('input')
      .attr('name'), 'Name Attribute').to.equal('testName');
    expect(element.find('input')
      .attr('placeholder'), 'Placeholder Attribute')
      .to.equal('Test Placeholder');
  });

  it('should transclude help text in legacy mode', function() {
    element.append($compile('<br-input>help</br-input>')($scope));
    $scope.$apply();
    expect(element.find('.help-block').text().trim()).to.equal('help');
  });

  it('should transclude help text', function() {
    element.append($compile(
      '<br-input><div name="br-input-help">help</div></br-input>')($scope));
    $scope.$apply();
    expect(element.find('.help-block').text().trim()).to.equal('help');
  });

  it('should transclude help text and ignore non-help content', function() {
    element.append($compile(
      '<br-input><div name="br-input-help">help</div>ignore</br-input>')(
        $scope));
    $scope.$apply();
    expect(element.find('.help-block').text().trim()).to.equal('help');
  });
}); // end unit tests

}); // end client mocha
