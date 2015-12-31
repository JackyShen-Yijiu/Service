var express = require('express');
var logType=require("../../custommodel/emunapptype").LogType;
var log=require("../../Common/systemlog");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  log.writewebsitedowmlog(req,logType.website);
  res.render('index', { title: 'Express' });
});
router.get('/ybxc', function(req, res, next) {
  //console.log(req.hostname);
  log.writewebsitedowmlog(req,logType.website);
  res.render('ybxc', { title: 'Express' });
});

module.exports = router;
