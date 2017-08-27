'use strict';
function ActivityListCtrl($scope, $modal, $location, $translate, $compile, T, commonFactory) {
  var modalId = $location.path().split('/')[2];
  $scope.modalId = modalId;
  $scope.modalName = "modalName." + modalId;
  setHeader(modalId,$scope);
  $scope.form = { add: {}};
  commonFactory.list(modalId).then(function(res) {
    $scope.activities = res.data;
  });

  $scope.update = function(idx, c) {
    $scope.activities[idx].repeatable = $("#repeatable_" + idx).prop('checked');
    $scope.activities[idx].status = $("#status_" + idx).prop('checked');
    $scope.activities[idx].duplicated = $("#duplicated_" + idx).prop('checked');
    commonFactory.update(modalId, c._id, $scope.activities[idx]).then(function(ress, err) {
      var message =  T.T("modalName." + modalId) + "[ " + $scope.activities[idx].alias + " ]" +T.T("common.update");
      if(err){
        message = message +  T.T("common.failed");
      }else{
        message = message +  T.T("common.success");
      }
      console.log(message);
      var modalInstance = $modal.open({
        templateUrl: 'messageModal',
        controller: messageModalCtrl,
        resolve: {
            message: function() {
              return message
            }
          }
      });
    });
  };
}

var messageModalCtrl = function($scope, $modalInstance, $window, $location, message) {

  $scope.message = message;

  $scope.closeMessage = function() {
    $modalInstance.dismiss('cancel');
    $window.location.reload();
  };
};
