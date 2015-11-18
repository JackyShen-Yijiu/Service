var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var BaseReturnInfo = require('./custommodel/basereturnmodel.js');
//var apijson=require('./API');
var apiRouterV1 = require('./routes/api_v1_router.js');
var apiRouterV2=require('./routes/api_v2_router.js');
var apipushtest=require('./routes/api_push_test.js');
var logType=require("./custommodel/emunapptype").LogType;
var log=require("./Common/systemlog");
require('oneapm');
//var domain = require('domain');


var app = express();

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');

  if (req.method.toUpperCase() === 'OPTIONS') {
    return res.end();
  }

  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//test git
//app.use('/', routes);
//app.use('/users', users);
//app.use('/api/v1', v1);
//app.use('/api/', v1);


//引入一个domain的中间件，将每一个请求都包裹在一个独立的domain中
//domain来处理异常
/*app.use(function (req,res, next) {
  var d = domain.create();
  //监听domain的错误事件
  d.on('error', function (err) {
    console.log(err);
    //
    res.statusCode = 500;
    res.json(new BaseReturnInfo(0,"服务器内部错误",""));
    //d.dispose();
    d.end(err.stack)
  });
  d.add(req);
  //d.add(res);
  d.run(next);
});*/
app.use('/api/v1', apiRouterV1);
app.use('/api/', apiRouterV1);
app.use('/api/v2', apiRouterV2);
app.use('/api/pushtest', apipushtest);


// catch 404 anid forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    log.writeLog(req, err, logType.err);
    res.json(new BaseReturnInfo(0, "服务器内部错误", ""));
    /*res.render('error', {
     message: err.message,
     error: {}
     });*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.status)
  log.writeLog(req,err,logType.err);
  res.json(new BaseReturnInfo(0,"服务器内部错误",""));
  /*res.render('error', {
    message: err.message,
    error: {}
  });*/
});


module.exports = app;
