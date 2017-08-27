var express = require('express'),
    app = express(),
    routes = require('./routes'),
    // api = require('./routes/api'),
    sale = require('./routes/db/sale'),
    activity = require('./routes/db/activity'),
    commodities = require('./routes/db/commodity'),
    vendors = require('./routes/db/vendors'),
    member = require('./routes/db/member'),
    memberClass = require('./routes/db/memberClass'),
   // dbModel = require('./routes/db/schema'),
    server = require('http').createServer(app);

app.configure(function() {
  app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
  app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
  app.locals.pretty = true;
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'secret!' }));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use('/i18n', express.static(__dirname + '/i18n'));
  app.use('/images', express.static(__dirname + '/images'));
  app.use('/components', express.static(__dirname + '/components'));
  app.use(app.router);
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
});

app.get('/', routes.index); // main page
app.get('/p/:name', routes.p); //redirect routes
// app.get('/cm', routes.cm); // main page
// app.get('/cm/:name', routes.cm); //redirect routes

// app.get('/member', routes.member); // main page
// app.get('/member/:name', routes.member); //redirect routes

app.get('/s/:name', routes.ser); //redirect routes
app.get('/s/:serviceName/:functionName', routes.func); //redirect routes

app.get('/api/memberClass', memberClass.memberClasses); //look at all
app.get('/api/memberClass/:id', memberClass.memberClass); //look at one
app.post('/api/memberClass', memberClass.add); //add contact
app.put('/api/memberClass/:id', memberClass.edit); //edit&update contact
app.delete('/api/memberClass/:id', memberClass.delete); //delete contact

app.get('/api/member', member.members); //look at all
app.get('/api/member/:id', member.member); //look at one
app.get('/api/member/tel/:phone', member.find); //look at one
app.post('/api/member', member.add); //add contact
app.put('/api/member/:id', member.edit); //edit&update contact
app.delete('/api/member/:id', member.delete); //delete contact

app.get('/api/vendors', vendors.vendors); //look at all
app.get('/api/vendors/:id', vendors.vendor); //look at one
app.post('/api/vendors', vendors.add); //add contact
app.put('/api/vendors/:id', vendors.edit); //edit&update contact
app.delete('/api/vendors/:id', vendors.delete); //delete contact

app.get('/api/commodity', commodities.commodities); //look at all
app.get('/api/commodity/:id', commodities.commodity); //look at one
app.get('/api/commodity/code/:code', commodities.find); //look at one
app.post('/api/commodity', commodities.add); //add contact
app.put('/api/commodity/:id', commodities.edit); //edit&update contact
app.delete('/api/commodity/:id', commodities.delete); //delete contact

app.get('/api/activity', activity.activities); //look at all
app.get('/api/activity/:id', activity.activity); //look at one
// app.post('/api/commodity', commodities.add); //add contact
app.put('/api/activity/:id', activity.edit); //edit&update contact
// app.delete('/api/commodity/:id', commodities.delete); //delete contact

app.get('/api/sale', sale.records); //look at all
app.get('/api/sale/:id', sale.record); //look at one
app.post('/api/sale', sale.add); //add contact


// app.get('/api/:nodalName', function(){
//   var modal  = require('./routes/db/’+ modalName'),
//    return modal.list;
// })
// app.post('/api/:modalName', function(){
//   var modal  = require('./routes/db/’+ modalName'),
//    return modal.add;
// });

server.listen(app.get('port'), app.get('ipaddr'), function(){
  console.log("Express server up and running for the API on port " + app.get('port') + " on IP " + app.get('ipaddr'));
});