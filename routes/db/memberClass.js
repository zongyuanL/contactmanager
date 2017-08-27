var db = require('./schema.js');

exports.memberClasses = function (req, res) {
  return db.MemberClassModel.find(function (err, memberClasses) {
    if (!err) {
      res.json(memberClasses);
    } else {
      console.log(err);
    }
  });
};

exports.memberClass = function(req, res) {
  var id = req.params.id;
  if (id) {
    db.MemberClassModel.findById(id, function (err, memberClass) {
      if (!err) {
        if (memberClass) {
          res.json({entity: memberClass, status: true});
        } else {
          res.json({ status: false });
        }
      } else {
        console.log(err);
      }
    });
  }
};

exports.add = function(req, res) {
  console.log("begin to add in memberClass ");
    var entity = req.body;
    entity = new db.MemberClassModel({
        name: req.body.name,
        required_sum_of_consumption: req.body.required_sum_of_consumption,
        discount: req.body.discount,
        activity: req.body.activity
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
    db.MemberClassModel.findById(id, function (err, entity) {
      entity.name = req.body.name,
      entity.required_sum_of_consumption = req.body.required_sum_of_consumption,
      entity.discount = req.body.discount,
      entity.activity = req.body.activity
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
    db.MemberClassModel.findById(id, function (err, entity) {
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