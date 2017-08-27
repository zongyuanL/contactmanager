exports.index = function(req, res) {
  res.render('index.html');
};

exports.p = function (req, res) {
  var name = req.params.name;
  res.render('p/' + name + '.html');
};

exports.ser = function (req, res) {
  var name = req.params.name;
  res.render('index.html');
};

exports.func = function (req, res) {
  var serviceName = req.params.serviceName;
  var functionName = req.params.functionName;
  res.render(serviceName +'/'+ functionName +'.html');
};


