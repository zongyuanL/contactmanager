var db = require('./schema.js');

exports.members = function (req, res) {
  return db.MemberModel.find(function (err, members) {
    if (!err) {
      res.json(members);
    } else {
      console.log(err);
    }
  }).populate('memberClass');
};

exports.member = function(req, res) {
  var id = req.params.id;
  if (id) {
    db.MemberModel.findById(id, function (err, member) {
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
    db.MemberModel.find(wherestr, function (err, member) {
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

// phone: { type: String, unique: true, require: true ,index: true},
//     name: { type: String, },
//     gender: {type: String},
//     married: {type: Boolean},
//     children: {type: String},
//     level: { type:Schema.Types.ObjectId, ref: 'MemberClass'},
//     sum_of_consumption: { type: Number}

exports.add = function(req, res) {
  console.log("begin to add in api ");
    var entity = req.body;
    var children = req.body.children;
    var childrenList = [];
    for(var child in children){
      var childEntity = new db.ChildrenModel({
        gender: children[child].gender,
        age: children[child].age
      });
      childrenList.push(childEntity);
    };
    entity = new db.MemberModel({
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      married: req.body.married,
      children: childrenList,
      memberClass: req.body.memberClass,
      consumption: req.body.consumption
    });
    entity.save(function (err) {
      if (!err) {
        console.log("end to add with no err");
        res.json(true);
      } else {
        console.log(err);
        res.json(false);
      }
    });
    return res.jsonp(req.body);
};

exports.edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    db.MemberModel.findById(id, function (err, entity) {
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
    db.MemberModel.findById(id, function (err, entity) {
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

