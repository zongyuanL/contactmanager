var db = require('./schema.js');

exports.commodities = function (req, res) {
  return db.CommodityModel.find(function (err, entities) {
    if (!err) {
      res.json(entities);
    } else {
      console.log(err);
    }
  }).populate('vendors');
};

exports.commodity = function(req, res) {
  var id = req.params.id;
  if (id) {
    db.CommodityModel.findById(id, function (err, data) {
      if (!err) {
        if (data) {
          res.json({entity: data, status: true});
        } else {
          res.json({ status: false });
        }
      } else {
        console.log(err);
      }
    }).populate('vendors');
  }
};

exports.find = function(req, res) {
  var c_code = req.params.code;
  if (c_code) {
    db.VendorsModel.find({code: c_code.substring(0,4)}, function (err, vendorLists) {
      db.CommodityModel.find({vendors: {$in: vendorLists}, artic_number: c_code.substring(4,8)}, function (err, data) {
          if (!err) {
            if (data) {
              res.json({entity: data, status: true});
            } else {
              res.json({ status: false });
            }
          } else {
            console.log(err);
          }
      })
    });
  }
};

exports.add = function(req, res) {
    var entity = req.body;
    var commodities = req.body.commodities;
    var commodityList = [];
    for(var obj in commodities){
      var commodityEntity = new db.CommodityTypeModel({
        model_type: commodities[obj].model_type,
        sum: commodities[obj].sum
      });
      commodityList.push(commodityEntity);
    };
    entity = new db.CommodityModel({
        name: req.body.name,
        artic_number: req.body.artic_number,
        vendors: req.body.vendors,
        cost: req.body.cost,
        price: req.body.price,
        commodities: commodityList
    });
    console.log(entity);
    entity.save(function (err) {
      if (!err) {
        console.log("end to add with no err for memberClass");
        res.json(true);
      } else {
        console.log("Error in add memberClass:"+ err);
        res.json(false);
      }
    });
    return res.jsonp(req.body);
};

exports.edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    db.CommodityModel.findById(id, function (err, entity) {
      var commodities = req.body.commodities;
      var commodityList = [];
      for(var commodity in commodities){
        var commodityEntity = new db.CommodityTypeModel({
          model_type: commodities[commodity].model_type,
          sum: commodities[commodity].sum
        });
        commodityList.push(commodityEntity);
      };
      entity.name = req.body.name,
      entity.artic_number = req.body.artic_number,
      entity.vendors = req.body.vendors,
      entity.cost = req.body.cost,
      entity.price = req.body.price,
      entity.commodities = commodityList
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
    db.CommodityModel.findById(id, function (err, entity) {
      entity.remove(function (err) {
        if (!err) {
          res.json(true);
        } else {
          res.json(false)
          console.log(err);
        }
      });
    });
  }
};