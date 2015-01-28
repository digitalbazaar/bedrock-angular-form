var bedrock = GLOBAL.bedrock;
var by = GLOBAL.by;

bedrock.on('init', function() {
  // locate elements by br-model
  by.addLocator('brModel', function(value, parent) {
    var using = parent || document;
    var query = "[br-model='" + value + "'] [ng-model]";
    return using.querySelectorAll(query);
  });

  // locate elements by br-datepicker
  by.addLocator('brDatepicker', function(value, parent) {
    var using = parent || document;
    var query = "[br-model='" + value + "'] input[ng-model]";
    return using.querySelectorAll(query);
  });

  // locate options from a select element by label (case-insensitive)
  by.addLocator('option', function(label, parent) {
    label = label.trim().toLowerCase();
    var using = parent || document;
    var options = using.querySelectorAll('option');
    return Array.prototype.filter.call(options, function(option) {
      return (option.textContent.trim().toLowerCase() === label);
    });
  });

  // locate selector button by br-model
  by.addLocator('brSelect', function(value, parent) {
    var using = parent || document;
    var query = "[br-model='" + value + "'] .ui-select-match";
    return using.querySelectorAll(query);
  });

  // locate selector input by br-model
  by.addLocator('brSelectInput', function(value, parent) {
    var using = parent || document;
    var query = "[br-model='" + value + "'] .ui-select-search";
    return using.querySelectorAll(query);
  });

  // locate radio button
  by.addLocator('brRadio', function(model, value, parent) {
    var using = parent || document;
    var query = "[br-model='" + model + "'] [ng-model][value='" + value + "']";
    return using.querySelectorAll(query);
  });
});
