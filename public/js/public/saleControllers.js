'use strict';
function SaleCtrl($scope, $http, $modal, $location, $translate, $compile, T, commonFactory) {
  var modalId = $location.path().split('/')[2];
  $scope.modalId = modalId;
  $scope.modalName = "modalName." + modalId;
  initFormData();
  setScope($scope, T, commonFactory, modalId);
  $scope.$watch('form.record.sale', function(){
        var _num=0,_consumption=0,_sum=0;
        for(var idx in $scope.form.record.sale.commodities){
          var c = $scope.form.record.sale.commodities[idx];
          _num = _num + parseInt(c.sum);
          _consumption = _consumption + parseInt(c.sum)*parseFloat(c.price);
        }
        var _freeNum=0,_freeConsumption=0,_freeSum=0;
        for(var idx in $scope.form.record.sale.freeCommodities){
          var c = $scope.form.record.sale.freeCommodities[idx];
          _freeNum = _freeNum + parseInt(c.sum);
          _freeConsumption = _freeConsumption + parseInt(c.sum)*parseFloat(c.price);
        }
        $scope.form.record.total_quantity =  _num;
        $scope.form.record.total_consumption =  _consumption;
        $scope.form.record.total_free_quantity =  _freeNum;
        $scope.form.record.total_free_consumption =  _freeConsumption;
        _sum = _consumption;
        if($scope.form.record.sale.member){
          _sum = _sum * parseFloat($scope.form.record.sale.member.memberClass.discount);
        }
        $scope.form.record.total_sum = _sum;
        countActivitiesDiscount();
        _sum = _sum * $scope.form.record.sale.discountRatio;
        _sum = _sum - $scope.form.record.sale.discountMoney;
        var adjust = $scope.form.record.sale.adjust;
        var flag = 1;
        if(adjust){
          if(adjust.substring(0,1).indexOf("+")==0 || adjust.substring(0,1).indexOf("-")==0){
            flag = -1;
          }
          _sum = _sum - eval(adjust)*flag;
        }
        $scope.form.record.total_sum = _sum;

  },true);

  $scope.searchMember = function(){
    if(!$scope.form.record.memberPhone){
      return;
    }
    commonFactory.findMember($scope.form.record.memberPhone).then(function(res, err){
      $scope.no_such_member = false;
      $scope.form.record.sale.member = null;
      if(res.data['entity'].length >0 ){
        $scope.form.record.sale.member = res.data['entity'][0];
      } else {
        $scope.no_such_member = true;
      }
     });
  };

  $scope.searchCommodity = function(idx){
    var commodityCode = $scope.form.record.commodityCode;
    if(!commodityCode || commodityCode.length < COMMODITY_ARTIC_NUMBER_LENGTH){
      var message = T.T("common.need_to_input") + T.T("common.correct") + T.T("commodity.artic_number") + '.';
      var modalInstance = $modal.open({
          templateUrl: 'messageModal',
          controller: messageModalCtrl,
          resolve: {
            message: function() {
              return message;
            }
          }
      });
    }else{
      commonFactory.findCommodity(commodityCode).then(function(res, err){
        if(res.data['entity'].length >0 ){
          if(!$scope.form.record.sale.commodities) {
            $scope.form.record.sale.commodities = [];
          }
          var commodity = res.data['entity'][0];
          commodity.sum = 1;
          commodity.size = commodityCode.substring(COMMODITY_ARTIC_NUMBER_LENGTH);
          $scope.form.record.sale.commodities.push(commodity);
          commodityCode = '';
        } else {
            var message = T.T("sale.no_such_commodity") + "." + T.T("sale.question_to_sale");
            var modalInstance = $modal.open({
                templateUrl: 'addCommodityModal',
                resolve: {
                  message: function() {
                    return message;
                  }
                }
            });
          }
      });
    }
  };

  $scope.changeActivity =  function(activity){
    var selectedActivities = $scope.form.record.selectedActivities;
    var activities = $scope.activities;
    if(event.target.checked) {
        var duplicated = activity.duplicated;
        for(var ac in selectedActivities){
          if(ac != activity.code){
            var a = activities.find(function(el) {return el.code == ac;});
            if(!(duplicated && a.duplicated) && selectedActivities[ac]){
              selectedActivities[ac] = false ;
            }
          }
        }
    }
    countActivitiesDiscount();
  }

  $scope.sale = function(idx){
    var record = $scope.form.record,
        saleInfo = record.sale;
    commonFactory.add(modalId, record).then(function(res) {
      var message = "";
      if(res.data){
          message = T.T("sale.success");
          initFormData($scope);
      }else{
          message = T.T("sale.failed");
      }
      var modalInstance = $modal.open({
          templateUrl: 'messageModal',
          controller: messageModalCtrl,
          resolve: {
            message: function() {
              return message;
            }
          }
      });
    });
  };

  $scope.reset = function(){
      initFormData($scope);
  };
  $scope.removeMember = function () {
    $scope.form.record.memberPhone = null;
    $scope.form.record.sale.member = null;
  };

  $scope.deleteCommodity = function(idx){
      $scope.form.record.sale.commodities.splice(idx, 1);
  };
  $scope.deleteFreeCommodity = function(idx){
      $scope.form.record.sale.freeCommodities.splice(idx, 1);
  };
  $scope.toCommodity = function(idx, commodity){
      $scope.form.record.sale.commodities.push(commodity);
      $scope.form.record.sale.freeCommodities.splice(idx, 1);
  };
  $scope.toFreeCommodity = function(idx, commodity){
      $scope.form.record.sale.freeCommodities.push(commodity);
      $scope.form.record.sale.commodities.splice(idx, 1);
  };

  function countActivitiesDiscount(){
    var selectedActivities = $scope.form.record.selectedActivities,
        activities = $scope.activities,
        _total_quantity = parseInt($scope.form.record.total_quantity);
    if( _total_quantity <= 0 ){
      return;
    }
    $scope.form.record.sale.discountRatio = 1;
    $scope.form.record.sale.discountMoney = 0;
    if(selectedActivities['AC_1']){
      var activity = activities.find(function(el) {return el.code == 'AC_1';});
      var _index = 999;
      if(_total_quantity>= activity.config.length){
        _index = activity.config.length-1;
      } else {
        _index = _total_quantity-1;
      }
        $scope.form.record.sale.discountRatio = parseFloat(activity.config[_index]);
    }
    if(selectedActivities['AC_2']){
      var activity = activities.find(function(el) {return el.code == 'AC_2';});
      var _sum = parseFloat(activity.config[0]);
      var _discount = parseFloat(activity.config[1]);
      var _repeatable = activity.repeatable;
      var _total_sum = parseFloat($scope.form.record.total_sum);
      var times = parseInt(_total_sum/_sum);
      if(times >0 ){
        if(!_repeatable){
            times = 1;
        }
      }
      $scope.form.record.sale.discountMoney = _discount * times;
    }
    $scope.giftMessage="";
    if(selectedActivities['AC_3'] && $scope.form.record.sale.freeCommodities.length > 0){
      var activity = activities.find(function(el) {return el.code == 'AC_3';});
      var _quanity = parseFloat(activity.config[0]);
      var _gift = parseFloat(activity.config[1]);
      var configRatio = _quanity/_gift;
      var _repeatable = activity.repeatable;

      if((_repeatable && $scope.form.record.total_quantity/$scope.form.record.total_free_quantity<configRatio)
        ||(!_repeatable && $scope.form.record.total_free_quantity > _gift)){

        $scope.giftMessage = T.T("sale.giftOver");
      }

    }
  }

  function initFormData(){
    commonFactory.list('activity').then(function(res) {
      $scope.activities = res.data;
    });
    $scope.form = { record: {}};
    $scope.form.record = { sale: {}};
    if(!$scope.form.record.sale.commodities) {
        $scope.form.record.sale.commodities = [];
    }
    if(!$scope.form.record.sale.freeCommodities) {
        $scope.form.record.sale.freeCommodities = [];
    }
    $scope.form.record.total_quantity = 0;
    $scope.form.record.total_consumption = 0;
    $scope.form.record.total_free_quantity = 0;
    $scope.form.record.total_free_consumption = 0;
    $scope.form.record.total_sum = 0;
    $scope.form.record.selectedActivities = {};
    $scope.form.record.sale.adjust = 0;
    $scope.form.record.sale.discountRatio = 1;
    $scope.form.record.sale.discountMoney = 0;
  }
}

var messageModalCtrl = function($scope, $modalInstance, $window, $location, message) {

  $scope.message = message;

  $scope.closeMessage = function() {
    $modalInstance.dismiss('cancel');
  };
};
