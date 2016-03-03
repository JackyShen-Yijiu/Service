var express = require('express');
var logType=require("../../custommodel/emunapptype").LogType;
var log=require("../../Common/systemlog");
var mongo=require("../../models/mongodb");
var feedback=mongo.FeedBackModel;
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
router.post('/userfeedback', function(req, res, next) {
  //console.log(req.hostname);
  console.log(req.body);
  var tempfeedback=new feedback();
  tempfeedback.createtime=new Date();
  tempfeedback.feedbacktype=3;
  tempfeedback.usefeedbackmessage=JSON.stringify(req.body);
  tempfeedback.save(function(err,data){
    res.redirect("/userAppFeedback.html")
  })

});

module.exports = router;
