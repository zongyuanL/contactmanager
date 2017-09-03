var mongoose = require('mongoose'),
    // mongoose.Promise = require(‘bluebird’),
    db = require('./schema.js');

exports.records = function (req, res) {
  return db.SalesRecordModel.find(function (err, members) {
    if (!err) {
      res.json(members);
    } else {
      console.log(err);
    }
  }).populate('memberClass');
};

exports.record = function(req, res) {
  var id = req.params.id;
  if (id) {
    db.SalesRecordModel.findById(id, function (err, member) {
      if (!err) {
        if (member) {
          res.json({entity: member, status: true});
        } else {
          res.json({ status: false });
        }
      } else {
        console.log(err);
      }
    }).populate('memberClass');
  }
};

exports.find = function(req, res) {
  var wherestr = {'phone' : req.params.phone};
  if (wherestr) {
    db.SalesRecordModel.find(wherestr, function (err, member) {
      if (!err) {
        if (member) {
          res.json({entity: member, status: true});
        } else {
          res.json({ status: false });
        }
      } else {
        console.log(err);
      }
    }).populate('memberClass');
  }
};

exports.add = function(req, res) {
    var record=req.body,
        entity = req.body,
        saleInfo = record.sale,
        commoditiesList = saleInfo.commodities,
        freeCommoditiesList = saleInfo.freeCommodities,
        member =  saleInfo.member,
        activity_discount = saleInfo.discountRatio,
        activity_discount_price = saleInfo.discountMoney,
        adjust = saleInfo.adjust,
        final_price = record.total_sum.toFixed(2),
        payments = record.payments,
        backup = record.backup,
        member_id ,
        member_discount = 1,
        payment = [],
        commodities = [],
        freeCommodities = [];
    if(member){
        member_id =  saleInfo.member._id != ""?saleInfo.member._id:null;
        member_discount = saleInfo.member.memberClass.discount;
    }
    for(var c in commoditiesList){
      var commodity = new db.SalesCommodityModel({
        commodity_id: commoditiesList[c]._id,
        quanity: parseInt(commoditiesList[c].sum),
        size: commoditiesList[c].size,
        price: parseFloat(commoditiesList[c].price)
      });
      commodities.push(commodity);
    };
    for(var c in freeCommoditiesList){
      var commodity = new db.SalesCommodityModel({
        commodity_id: freeCommoditiesList[c]._id,
        quanity: parseInt(freeCommoditiesList[c].sum),
        size: commoditiesList[c].size,
        price: parseFloat(freeCommoditiesList[c].price)
      });
      freeCommodities.push(commodity);
    };
    for(var p in payments){
        payment.push(p);
    }
    entity = new db.SalesRecordModel({
      commodities: commodities,
      freeCommodities: freeCommodities,
      member_id: member_id,
      member_discount: member_discount,
      sale_date: new Date(),
      activity_discount: activity_discount,
      activity_discount_price: activity_discount_price,
      adjust: adjust,
      final_price: final_price,
      payment:payment,
      backup:backup
    });
    var result= {};
    entity.save().then(function (doc) {
      result.doc = doc;
      return Promise.all(doc.commodities.map(function(row){
        // if(db.CommodityModel.find({_id:mongoose.Types.ObjectId(row.commodity_id),'commodities.model_type':row.size}))
        // return db.CommodityModel.find({_id:mongoose.Types.ObjectId(row.commodity_id),'commodities.model_type':row.size});
        return db.CommodityModel.update({_id:mongoose.Types.ObjectId(row.commodity_id),'commodities.model_type':row.size}
          ,{$inc:{'commodities.$.sum': -row.quanity}});
      }))
    }).then(function(rows){
        // console.log(rows);
        var doc = result.doc;
        return Promise.all(doc.freeCommodities.map(function(row){
          // if(db.CommodityModel.find({_id:mongoose.Types.ObjectId(row.commodity_id),'commodities.model_type':row.size})){
          // return db.CommodityModel.aggregate().unwind('commodities').match({_id:mongoose.Types.ObjectId(row.commodity_id),'commodities.model_type':row.size});
            return db.CommodityModel.update({_id:mongoose.Types.ObjectId(row.commodity_id),'commodities.model_type':row.size}
              ,{$inc:{'commodities.$.sum': -row.quanity}});
          // }
        }))
    }).then(function(){
      var doc = result.doc;
      if(member){
        return db.MemberModel.update({_id:mongoose.Types.ObjectId(doc.member_id)},{$inc:{'consumption': doc.final_price}});

      }
    }).then(function(){
      res.json(true);
    })
    .catch(function(){
      res.json(false);
    });


};

exports.edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    db.SalesRecordModel.findById(id, function (err, entity) {
      var children = req.body.children;
      var childrenList = [];
      for(var child in children){
        var childEntity = new db.ChildrenModel({
          gender: children[child].gender,
          age: children[child].age
        });
        childrenList.push(childEntity);
      };
      entity.name = req.body.name;
      entity.phone = req.body.phone;
      entity.gender = req.body.gender;
      entity.married = req.body.married;
      entity.memberClass = req.body.memberClass;
      entity.consumption = req.body.consumption;
      entity.children= childrenList;

      entity.save(function (err) {
        if (!err) {
          res.json(true);
        } else {
          res.json(false);
          console.log(err);
        }
      });
    });
  }
};

exports.delete = function (req, res) {
  var id = req.params.id;
  if (id) {
    db.SalesRecordModel.findById(id, function (err, entity) {
      entity.remove(function (err) {
        if (!err) {
          res.json(true);
        } else {
          console.log(err);
          res.json(false)
        }
      });
    });
  }
};