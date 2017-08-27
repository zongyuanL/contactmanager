'use strict';
angular.module("common.factory", []).
  factory('commonFactory', function($http){
    return {
      add: function(model,obj) {
        return $http.post('/api/'+ model+'/', obj);
      },
      list: function(model) {
        return $http.get('/api/' + model+ '/');
      },
      get: function(model, id) {
        return $http.get('/api/'+ model + '/' + id);
      },
      update: function(model, id, obj) {
        return $http.put('/api/'+model+'/' + id, obj);
      },
      delete: function(model, id) {
        return $http.delete('/api/'+model+'/' + id);
      },
      findMember: function(phone){
        return $http.get('/api/member/tel/'+ phone);
      },
      findCommodity: function(code){
        return $http.get('/api/commodity/code/'+ code);
      }
    }
  });

angular.module("T", []).
  factory('T', ['$translate', function($translate) {
    var T = {
        T:function(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        }
    }
    return T;
}]);