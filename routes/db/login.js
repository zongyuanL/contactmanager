var db = require('./schema.js');




exports.login = function(req, res) {
  var name = req.body.username;
  var pass = req.body.password;
  if (name && pass) {
    db.AccountModel.find({userName: name, password: pass}, function (err, data) {
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
