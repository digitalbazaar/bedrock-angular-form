var bedrock = GLOBAL.bedrock;

bedrock.testInBrowser('br-input', function($injector) {

var chai = require('chai');
var expect = chai.expect;

describe('unit tests', function() {
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
