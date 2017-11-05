var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    mongoose.connect('mongodb://127.0.0.1:27017/contact');
var mdb =mongoose.connection;
    mdb.once('open',function(){
      //一次打开记录
      console.log("DataBase connection is opened");
    });
    mdb.once('connected',function(){
      //一次打开记录
      console.log("DataBase connection is contected");
    });

var ChildrenSchema =  new Schema({
    //parentId: { type:Schema.Types.ObjectId, ref: 'Member', require: true },
    name: { type: String, },
    gender: {type: String},
    age: {type: Number}
});
var ChildrenModel = mongoose.model('Children', ChildrenSchema);
exports.ChildrenModel = ChildrenModel;

var MemberSchema= new Schema({
    phone: { type: String, unique: true, require: true},
    name: { type: String, },
    gender: {type: String},
    married: {type: Boolean},
    children: [ChildrenSchema],
    memberClass: { type:Schema.Types.ObjectId, ref: 'MemberClass'},
    consumption: { type: Number, default: 0}
});
var MemberModel = mongoose.model('Member', MemberSchema);
exports.MemberModel = MemberModel;


var AccountSchema = new Schema({
    userName:{type:String, unique: true, require: true},
    name:{type:String},
    password:{type:String, require: true},
    type:{type:String}

});
var AccountModel = mongoose.model('Account', AccountSchema);
exports.AccountModel = AccountModel;


var MemberClassSchema= new Schema({
    name: { type: String,  unique: true, require: true },
    required_sum_of_consumption: { type: Number},
    discount: {type: Number},
    activity: {type: Boolean}
});
var MemberClassModel = mongoose.model('MemberClass', MemberClassSchema);

exports.MemberClassModel = MemberClassModel;

var vendorsSchema = new Schema({
    name: {type: String, unique: true, require: true},
    code: {type: String, unique: true, require: true},
    address: {type: String},
    phone: {type: String}
});
var VendorsModel = mongoose.model('Vendors', vendorsSchema);
exports.VendorsModel = VendorsModel;

var CommodityTypeSchema = new Schema({
    model_type: {
        type:'String'
        // enum:['01','02','03','04','05','06','07','00']
    },
    bar_code: {type: String},
    sum: {type: Number}
});
var CommodityTypeModel =  mongoose.model('CommodityType', CommodityTypeSchema);
exports.CommodityTypeModel = CommodityTypeModel;

var CommoditySchema = new Schema({
    name: {type: String},
    artic_number: {type: String,require:true},
    vendors: { type:Schema.Types.ObjectId, ref: 'Vendors'},
    cost: {type: Number},
    price: {type: Number},
    commodities:[CommodityTypeSchema]
});
var CommodityModel =  mongoose.model('Commodity', CommoditySchema);
exports.CommodityModel = CommodityModel;

var ActivitySchema = new Schema({
    code:{type: String, require: true},
    alias:{type: String, require: true},
    status: {type: Boolean},
    repeatable: {type: Boolean},
    duplicated: {type: Boolean},
    config: [{type: Number}]
});
var ActivityModel = mongoose.model('Activity',ActivitySchema);
exports.ActivityModel = ActivityModel;

var SaleCommoditySchema = new Schema({
    commodity_id: {type:Schema.Types.ObjectId, ref: 'Commodity' },
    quanity:{type: Number},
    size:{type:String},
    price:{type: Number}
});
var SalesCommodityModel =  mongoose.model('SalesCommodity', SaleCommoditySchema);
exports.SalesCommodityModel = SalesCommodityModel;


var SalesRecordSchema = new Schema({
    commodities: [SaleCommoditySchema],
    freeCommodities: [SaleCommoditySchema],
    member_id: {type:Schema.Types.ObjectId, ref: 'Member' },
    sale_date: {
        type: Date,
        default:Date.now},
    member_discount: {type: Number},
    activity_discount: {type: Number},
    activity_discount_price: {type: Number},
    adjust: {type: Number},
    final_price: {type: Number},
    payment:[{type:String}],
    backup:{type: String}
});
var SalesRecordModel =  mongoose.model('SalesRecord', SalesRecordSchema);
exports.SalesRecordModel = SalesRecordModel;

AccountModel.count(function(err, res){
  console.log("Start to initial admin");
  if(res>=1){
  console.log("Already initial admin");
    return;
  }

  var entity = new AccountModel({
    userName: 'admin',
    name: '系统管理员',
    password: 'sa123',
    type: 'admin'
  });
  entity.save(function(err){
    if(err){
      console.log("Failed to initial admin");
    }
  })

});

ActivityModel.count(function(err, res){
  console.log("Start to initial Activities");
  if(res==3){
  console.log("Already initial Activities");
    return;
  }
  ActivityModel.remove({},function(err, res){
    if(err){
      console.log("Failed to initial Activities");
    }else{
      insertActivity('AC_1','满额送',false,true,false,[1,1]);
      insertActivity('AC_2','累计折扣',true,false,false,[0.9, 0.8, 0.7]);
      insertActivity('AC_3','满额减',false,true,false,[520,52]);
    }
      console.log("End to initial Activities");
  })
})


function insertActivity(code, alias, status, repeatable, duplicated, config){
  var entity = new ActivityModel({
    code: code,
    alias: alias,
    status: status,
    repeatable: repeatable,
    duplicated: duplicated,
    config: config
  });
  entity.save(function(err){
    if(err){
      console.log("Failed to initial Activities");
    }
  })
}


//mongoose.connect('mongodb://localhost:27017/stock');



