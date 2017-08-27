var mongoose = require('mongoose')
, Schema = mongoose.Schema;
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

var ContactSchema= new Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    skype: { type: String }
});
var ContactModel = mongoose.model('Contact', ContactSchema);

exports.contacts = function (req, res) {
  console.log("begin to list ~~~");
  return ContactModel.find(function (err, contacts) {
    console.log("get:" + contacts);

    if (!err) {
      console.log("end to list with no err");
      res.json(contacts);
    } else {
      console.log(err);
    }
  });

  console.log("end to list ~~~");
};

exports.contact = function(req, res) {
  var id = req.params.id;
  if (id) {
    ContactModel.findById(id, function (err, contact) {
      if (!err) {
        if (contact) {
          res.json({contact: contact, status: true});
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
    var contact = req.body;
    contact = new ContactModel({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      skype: req.body.skype
    });
    console.log(contact);
    contact.save(function (err) {
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
    ContactModel.findById(id, function (err, contact) {
      contact.name = req.body.name,
      contact.phone = req.body.phone,
      contact.email = req.body.email,
      contact.facebook = req.body.facebook,
      contact.twitter = req.body.twitter,
      contact.skype = req.body.skype
      contact.save(function (err) {
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
    ContactModel.findById(id, function (err, contact) {
      contact.remove(function (err) {
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