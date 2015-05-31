var bedrock = GLOBAL.bedrock;

describe('br-input', function() {
  beforeEach(function() {
    bedrock.waitForAngular();
  });

  it('should transclude help text in legacy mode', function() {
    expect(bedrock.run(function($injector) {
      // base setup
      var result;
      var $compile = $injector.get('$compile');
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var element = $compile('<div></div>')($scope);

      // test setup
      element.append($compile('<br-input>help</br-input>')($scope));
      $scope.$apply();

      // expected result
      result = element.find('.help-block').text().trim();

      // clean up
      element.remove();
      return result;
    })).to.eventually.equal('help');
  });

  it('should transclude help text', function() {
    expect(bedrock.run(function($injector) {
      // base setup
      var result;
      var $compile = $injector.get('$compile');
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var element = $compile('<div></div>')($scope);

      // test setup
      element.append($compile(
        '<br-input><div name="br-input-help">help</div></br-input>')($scope));
      $scope.$apply();

      // expected result
      result = element.find('.help-block').text().trim();

      // clean up
      element.remove();
      return result;
    })).to.eventually.equal('help');
  });

  it('should transclude help text and ignore non-help content', function() {
    expect(bedrock.run(function($injector) {
      // base setup
      var result;
      var $compile = $injector.get('$compile');
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();
      var element = $compile('<div></div>')($scope);

      // test setup
      element.append($compile(
        '<br-input><div name="br-input-help">help</div>ignore</br-input>')(
          $scope));
      $scope.$apply();

      // expected result
      result = element.find('.help-block').text().trim();

      // clean up
      element.remove();
      return result;
    })).to.eventually.equal('help');
  });
});
