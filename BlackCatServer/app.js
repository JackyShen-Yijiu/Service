var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var apijson=require('./API');

var routes = require('./routes/index');
var userroutes = require('./routes/users');

var v1 = express.Router();
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
app.use('/api/v1', v1);
app.use('/api/', v1);
//================================================ v1 api=================
//测试接口
v1.get('/test',routes.TestAPI);
// app版本信息
v1.get('/appversion/:type', routes.appVersion);
// 获取验证码
v1.get('/code/:mobile', userroutes.fetchCode);
//获取科目
v1.get('/userinfo/subject', userroutes.GetSubject);
// 获取车型
v1.get('/userinfo/carmodel', userroutes.GetCarModel);
//用户登录
v1.post('/userinfo/userlogin', userroutes.UserLogin);


//=======================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
