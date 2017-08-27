'use strict';
function CommonListCtrl($scope, $modal, $location, $translate, $compile, T, commonFactory) {
  var modalId = $location.path().split('/')[2];
  $scope.modalId = modalId;
  $scope.modalName = "modalName." + modalId;
  setHeader(modalId,$scope);
  $scope.columnSort = { sortColumn: 'name', reverse: false };
  console.log("begin to list in ListCtrl for " + modalId);
  commonFactory.list(modalId).then(function(res) {
    $scope.resuletList = res.data;
  });

  $scope.switching = function(lang){
        $translate.use(lang);
        window.localStorage.lang = lang;
        window.location.reload();
    };
  $scope.cur_lang = $translate.use();

  //Add contact modal
  $scope.add = function() {
    console.log("begin to add in ListCtrl for "+ modalId);
    var modalInstance = $modal.open({
      templateUrl: 'addModal',
      controller: addModalCtrl
    });
  };

  $scope.view = function(c) {
    var id = c._id;
    var modalInstance = $modal.open({
      templateUrl: 'viewModal',
      controller: viewModalCtrl,
      resolve: {
        entity: function() {
          return commonFactory.get(modalId, id);
        }
      }
    });
  };

  $scope.edit = function(c) {
    var id = c._id;
    var modalInstance = $modal.open({
      templateUrl: 'editModal',
      controller: editModalCtrl,
      resolve: {
        entity: function() {
          return commonFactory.get(modalId, id);
        }
      }
    });
  };

  $scope.delete = function(c) {
    var id = c._id;
    var modalInstance = $modal.open({
      templateUrl: 'deleteModal',
      controller: deleteModalCtrl,
      resolve: {
        entity: function() {
          return commonFactory.get(modalId, id);
        }
      }
    });
  }
}

  function toUnfold(event){
    $(event.target.parentElement.children).removeClass('hidden');
    $(event.target).addClass('hidden');
    $(event.target).parents('.form-group').next().addClass('hidden');
  }

  function toFold (event){
    $(event.target.parentElement.children).removeClass('hidden');
    $(event.target).addClass('hidden');
    $(event.target).parents('.form-group').next().removeClass('hidden');
  }


var addModalCtrl = function($scope, $http, $modalInstance, $window, $location, $compile, T, commonFactory) {
  var modalId = $location.path().split('/')[2];
  $scope.form = { add: {}};
  setScope($scope, T, commonFactory, modalId);
  $scope.toUnfold = function(){
    toUnfold(event);
  };
  $scope.toFold = function(){
    toFold(event);
  };

  $scope.addChild = function(){
    if(!$scope.form.add.children) {
      $scope.form.add.children = [];
    }
    $scope.form.add.children.push({gender:"",age:""});
  };
  $scope.deleteChild = function(idx){
      $scope.form.add.children.splice(idx, 1);
  };

  $scope.addCommodity = function(){
    if(!$scope.form.add.commodities) {
      $scope.form.add.commodities = [];
    }
    $scope.form.add.commodities.push({model_type:"",sum:0});
  };
  $scope.deleteCommodity = function(idx){
      $scope.form.add.commodities.splice(idx, 1);
  };


  $scope.addEntity = function() {
    console.log("begin to add in AddCtrl for :" + modalId);
    commonFactory.add(modalId, $scope.form.add).then(function(res) {
      $modalInstance.close($window.location.reload());
      });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
};

var viewModalCtrl = function($scope, $modalInstance, $location, entity) {
  var modalId = $location.path().split('/')[2];
  $scope.modalId = modalId;
  $scope.modalName = "modalName." + modalId;
  // var headers = HEADER_ARRAY[modalId].all;
  // $scope.allheaders = headers;
  // $scope.allheaders = ["name", "consumption", "discount", "Activty"];
  $scope.entity = entity.data["entity"];

  $scope.close = function() {
    $modalInstance.dismiss('cancel');
  };
};

var editModalCtrl = function($scope, $modalInstance, $window, $location, $compile, T, entity, commonFactory) {
  var modalId = $location.path().split('/')[2];
  setScope($scope, T, commonFactory, modalId);
  $scope.form = {};
  // var headers = HEADER_ARRAY[modalId].all;
  // $scope.allheaders = headers;
  $scope.form.edit = entity.data["entity"];
  $scope.name = entity.data["entity"].name;

  $scope.editEntity = function() {
    commonFactory.update(modalId, entity.data["entity"]._id, $scope.form.edit).then(function() {
      $modalInstance.close($window.location.reload());
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  }

  $scope.toUnfold = function(){
    toUnfold(event);
  };
  $scope.toFold = function(){
    toFold(event);
  };

  $scope.addChild = function(){
    if(!$scope.form.edit.children) {
      $scope.form.edit.children = [];
    }
    $scope.form.edit.children.push({gender:"",age:""});
  };
  $scope.deleteChild = function(){
    $scope.form.edit.children.splice(idx, 1);
  };

  $scope.addCommodity = function(){
    if(!$scope.form.edit.commodities) {
      $scope.form.edit.commodities = [];
    }
    $scope.form.edit.commodities.push({model_type:"",sum:0});
  };
  $scope.deleteCommodity = function(idx){
      $scope.form.edit.commodities.splice(idx, 1);
  };
};

var deleteModalCtrl = function($scope, $modalInstance, $window, $location, entity, commonFactory) {
  var modalId = $location.path().split('/')[2];
  $scope.modalId = modalId;
  $scope.modalName = "modalName." + modalId;
  $scope.name = entity.data['entity'].name;

  $scope.deleteEntity = function() {
    commonFactory.delete(modalId, entity.data["entity"]._id).then(function() {
      $modalInstance.close();
      commonFactory.list(modalId).then(function(res) {
        return $scope.resuletList = res.data;
      });
      $window.location.reload();
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel')
  };
};