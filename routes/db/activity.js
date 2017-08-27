var db = require('./schema.js');


// var ActivitySchema = new Schema({
//     code:{tye: String, require: true},
//     config: [{key:String, value: Number}]
// });

exports.activities = function (req, res) {
  return db.ActivityModel.find(function (err, entities) {
    if (!err) {
      res.json(entities);
    } else {
      console.log(err);
    }
  });
};

exports.activity = function(req, res) {
  var id = req.params.id;
  if (id) {
    db.ActivityModel.findById(id, function (err, data) {
      if (!err) {
        if (data) {
          res.json({entity: data, status: true});
        } else {
          res.json({ status: false });
        }
      } else {
        console.log(err);
      }
    });
  }
};

// exports.add = function(req, res) {
//     var entity = req.body;
//     var commodities = req.body.commodities;
//     var commodityList = [];
//     for(var obj in commodities){
//       var commodityEntity = new db.CommodityTypeModel({
//         model_type: commodities[obj].model_type,
//         sum: commodities[obj].sum
//       });
//       commodityList.push(commodityEntity);
//     };
//     entity = new db.CommodityModel({
//         name: req.body.name,
//         artic_number: req.body.artic_number,
//         vendors: req.body.vendors,
//         cost: req.body.cost,
//         price: req.body.price,
//         commodities: commodityList
//     });
//     console.log(entity);
//     entity.save(function (err) {
//       if (!err) {
//         console.log("end to add with no err for memberClass");
//         res.json(true);
//       } else {
//         console.log("Error in add memberClass:"+ err);
//         res.json(false);
//       }
//     });
//     return res.jsonp(req.body);
// };

exports.edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    db.ActivityModel.findById(id, function (err, entity) {

      entity.code = req.body.code,
      entity.alias = req.body.alias,
      entity.status = req.body.status,
      entity.repeatable = req.body.repeatable,
      entity.duplicated = req.body.duplicated,
      entity.config = req.body.config
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


// exports.delete = function (req, res) {
//   var id = req.params.id;
//   if (id) {
//     db.CommodityModel.findById(id, function (err, entity) {
//       entity.remove(function (err) {
//         if (!err) {
//           res.json(true);
//         } else {
//           res.json(false)
//           console.log(err);
//         }
//       });
//     });
//   }
// };