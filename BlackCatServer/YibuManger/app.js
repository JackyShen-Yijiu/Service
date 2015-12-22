var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var partials = require('express-partials');
var io = require('socket.io')();
var routes = require('./routes/index');
var admin = require('./routes/admin')(io);
var session=require("express-session");
var bodyParser = require('body-parser');
var RedisStore = require('connect-redis')(session);
//站点配置
var settings = require("./models/config/settings");
//验证器
var validat = require('./routes/validat');

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
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: settings.session_secret,
  store: new RedisStore({
    port: settings.redis_port,
    host: settings.redis_host,
    pass : settings.redis_psd,
    ttl: 1800 // 过期时间
  }),
  resave: true,
  saveUninitialized: true
}));
app.use('/', admin);
app.use('/admin', validat);
app.use('/admin', admin);


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
