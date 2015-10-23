var express = require('express');
var router = express.Router();
var mongodb = require('../models/mongodb');

var question = mongodb.QuestionModel;
var userinfo = mongodb.UserInfoModel;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('questionwronglist');
});

router.get('/questionlist/', getQuestionList);
router.get('/questionbyid/:id', getQuestionByID);

function getQuestionList(req, res) {
  console.log("get question from mongo: " + req.params.id);
  question.List(function(err, questions){
    console.log(err);
    res.json(questions);
  });
}

function getQuestionByID(req, res) {

  //try to add test data in userinfo.
  /*console.log("try to add userinfo.");
  try{
    var u = new userinfo();
    u.id = "560539bea694336c25c3acb9";
    u.kemusi_wronglist=[11064, 11067];
    u.save(function (err, fluffy) {
        if (err) return console.error(err);
        console.log("saved: " + fluffy.id);
      });    
  }catch(err){
    console.log(err);
  }*/


  console.log("get wrong question from mongo by UserID: " + req.params.id);
  userinfo.FindByID(req.params.id, function(err, questions){
    console.log(err);
    res.json(questions);
  });
}

module.exports = router;
