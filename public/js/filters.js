angular.module("contacts.filters", []).
  filter('capitalise', function() {
    return function(input) {
      if(input != null) {
        return input.toUpperCase();
      }
    }
  }).filter('cfl', function() {
    return function(input) {
      if(input != null) {
        return input.substring(0,1).toUpperCase() + input.substring(1).toLowerCase();
      }
    }
  }).filter('lower', function() {
    return function(input) {
      if(input != null) {
        return input.toLowerCase();
      }
    }
  }).filter('percent', function() {
    return function(input) {
      if(input != null) {
        return input*100 + '%';
      }
    }
  }).filter("T", ['$translate', function($translate) {
    return function(key) {
        if(key){
            return $translate.instant(key);
        }
    };
}]);
