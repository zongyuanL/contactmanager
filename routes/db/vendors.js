var db = require('./schema.js');

exports.vendors = function (req, res) {
  return db.VendorsModel.find(function (err, entities) {
    if (!err) {
      res.json(entities);
    } else {
      console.log(err);
    }
  });
};

exports.vendor = function(req, res) {
  var id = req.params.id;
  if (id) {
    db.VendorsModel.findById(id, function (err, entity) {
      if (!err) {
        if (entity) {
          res.json({entity: entity, status: true});
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
  console.log("begin to add in api ");
    entity = new db.VendorsModel({
      name: req.body.name,
      phone: req.body.phone,
      code: req.body.code,
      address: req.body.address
    });
    console.log(entity);
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
    db.VendorsModel.findById(id, function (err, entity) {
      entity.name = req.body.name;
      entity.phone = req.body.phone;
      entity.code = req.body.code;
      entity.address = req.body.address;

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
    db.VendorsModel.findById(id, function (err, entity) {
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