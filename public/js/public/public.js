var HEADER_ARRAY = {
  "memberClass" :{
      "short":["memberClass.name", "memberClass.consumption", "memberClass.discount", "memberClass.activity"],
      "all":["memberClass.name", "memberClass.consumption", "memberClass.discount", "memberClass.activity"]},
  "member" :{
    "short":["member.phone","member.name","member.memberClass"],
      "all":["phone","member.name","member.gender","member.married","member.memberClass","member.consumption","member.children"]},
  "vendors":{
    "short":["vendors.name","vendors.code","vendors.phone","vendors.address"],
      "all":["vendors.name","vendors.code","vendors.phone","vendors.address"]},
  "activity":{
    "short":["activity.name","activity.description","common.status"],
      "all":["activity.name","activity.description","common.status"]},
  "commodity":{
    "short":["commodity.artic_number","commodity.name","commodity.vendors","commodity.price"],
      "all":["commodity.artic_number","commodity.name","commodity.vendors","commodity.cost","commodity.price","commodity.commodities"]},
  "activity":{
    "short":["activity.name","activity.description","activity.can_repeate","activity.can_duplicated","common.status"],
      "all":["activity.name","activity.description","activity.can_repeate","activity.can_duplicated","common.status"]},
};
var COMMODITY_ARTIC_NUMBER_LENGTH = 8;
var VENDORS_CODE_LENGTH = 4;
var ARTIC_NUMBER_LENGTH = 4;
var TYPE_LENGTH = 2;
function setScope($scope,T, commonFactory, modalId){
    $scope.modalId = modalId;
    $scope.modalName = "modalName." + modalId;
    $scope.activities = [{key: true, value: T.T("common.valid")}, {key: false, value: T.T("common.invalid")}];
    $scope.genders = [{key: "FEMALE", value: T.T("common.female")}, {key: "MALE", value: T.T("common.male")}];
    $scope.marrieds = [{key: true, value: T.T("common.married")}, {key: false, value: T.T("common.unmarried")}];
    $scope.yes_no =[{key: true, value: T.T("common.yes")}, {key: false, value: T.T("common.no")}];

    $scope.payments = [{key:'weChart', value:'微信'},
                      {key:'payPal', value:'支付宝'},
                      {key:'cash', value: '现金'},
                      {key:'creditCard',value:'信用卡'},
                      {key:'other',value:'其它'}];
    try{
        eval("setScopeForModal_"+ modalId +"($scope,T, commonFactory)");
    }catch(e){

    }
}

function setScopeForModal_member($scope,T, commonFactory){

    $scope.genders4children = [{key: "BOY", value: T.T("common.boy")}, {key: "GIRL", value: T.T("common.girl")}];
    $scope.ages4children = [{key:0,value:0}, {key:1,value:1}, {key:2,value:2}, {key:3,value:3}, {key:4,value:4},
                            {key:5,value:5}, {key:6,value:6}, {key:7,value:7}, {key:8,value:8}, {key:9,value:9},
                            {key:10,value:10}, {key:11,value:11}, {key:12,value:12}];
    var classes = [];

    commonFactory.list("memberClass").then(function(res) {
        var memberClasses = res.data;
        memberClasses.forEach(function( val, index ) {
            classes.push({id: val._id , name: val.name, discount: val.discount});
        });
    });
    $scope.memberClasses = classes;
}

function setScopeForModal_commodity($scope,T, commonFactory){
    $scope.commodityTypes = [{key:'XXS',value:'XXS'},{key:'XS',value:'XS'},{key:'S', value:'S'},
                        {key:'M', value:'M'},{key:'L', value:'L'},{key:'XL', value:'XL'},
                        {key:'XXL', value:'XXL'},{key:'F',value:'F'}];
    // $scope.commodityTypes = [ {key: T.T( "commodity.size.xxs.key"),value: T.T("commodity.size.xxs.value")},
    //                      {key:  T.T("commodity.size.xs.key"),  value: T.T("commodity.size.xs.value")},
    //                      {key:  T.T("commodity.size.s.key"),   value: T.T("commodity.size.s.value")},
    //                      {key:  T.T("commodity.size.m.key"),   value: T.T("commodity.size.m.value")},
    //                      {key:  T.T("commodity.size.l.key"),   value: T.T("commodity.size.l.value")},
    //                      {key:  T.T("commodity.size.xl.key"),  value: T.T("commodity.size.xl.value")},
    //                      {key:  T.T("commodity.size.xxl.key"), value: T.T("commodity.size.xxl.value")},
    //                      {key:  T.T("commodity.size.f.key"),   value: T.T("commodity.size.f.value")}];
    var vendorsList = [];
    commonFactory.list("vendors").then(function(res) {
        var entityList = res.data;
        entityList.forEach(function( val, index ) {
            vendorsList.push({key: val._id , value: val.name});
        });
    });
    $scope.vendors = vendorsList;
}
function setHeader(modalId,$scope){
  var headers = [];
  if(HEADER_ARRAY[modalId] && HEADER_ARRAY[modalId].short){
    angular.copy(HEADER_ARRAY[modalId].short, headers);
    headers.push("");
    $scope.headers = headers;
  }
}