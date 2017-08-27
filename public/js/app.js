angular.module('contacts', ['pascalprecht.translate', 'ngRoute', 'common.factory', 'T', 'contacts.filters', 'ui.bootstrap']).
  config(['$qProvider', '$routeProvider', '$locationProvider', '$translateProvider', function($qProvider, $routeProvider, $locationProvider, $translateProvider) {
    var lang = window.localStorage.lang||'cn';
    // $translateProvider.translations('en',i18n_en);
    // $translateProvider.translations('zh',i18n_zh);
    $qProvider.errorOnUnhandledRejections(false);
    $translateProvider.useStaticFilesLoader({
        prefix: '/i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage(lang);
    $routeProvider.
      when('/', {
        templateUrl: '/p/home',
      }).
      when('/s/memberClass', {
        templateUrl: '/s/member/classList',
        controller: CommonListCtrl,
      }).
      when('/s/member', {
        templateUrl: '/s/member/memberList',
        controller: CommonListCtrl,
      }).
      when('/s/vendors', {
        templateUrl: '/s/storage/vendorsList',
        controller: CommonListCtrl,
      }).
      when('/s/commodity', {
        templateUrl: '/s/storage/commodityList',
        controller: CommonListCtrl,
      }).
      when('/s/activity', {
        templateUrl: '/s/setting/activityList',
        controller: ActivityListCtrl,
      }).
      when('/s/sale', {
        templateUrl: '/s/sale/sale',
        controller: SaleCtrl,
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]).directive('textTransform',function(){
    var transformConfig = {
      uppercase: function(input){
        return input.toUpperCase();
      },
      capitalize: function(input){
        return input.replace(
          /([a-zA-Z])([a-zA-Z]*)/gi,
          function(matched, $1, $2){
            return $1.toUpperCase() +$2;
          });
      },
      lowercase: function(input){
        return input.toLowerCase();
      }
    };
    return {
      require: 'ngModel',
      link: function(scope, element, iAttrs, modelCtrl){
        var transform = transformConfig[iAttrs.textTransform];
        if(transform){
          modelCtrl.$parsers.push(function(input){
            return transform(input || "");
          });
          element.css("text-transform", iAttrs.textTransform);
        }
      }
    };
  });
