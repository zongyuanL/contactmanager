var mongoose = require('mongoose')
, Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/contact');
var mdb =mongoose.connection;
    mdb.on('error',function(err){
      console.log('连接错误:' + err);
    });
    mdb.once('open',function(){
      //一次打开记录
      console.log("opened");
    });
        mdb.once('connected',function(){
      //一次打开记录
      console.log("contected");
    });
