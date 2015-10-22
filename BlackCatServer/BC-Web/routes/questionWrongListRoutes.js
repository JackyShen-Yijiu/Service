var express = require('express');
var router = express.Router();
var mongodb = require('../models/mongodb');

var question = mongodb.QuestionModel;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("User id is: ");
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
  console.log("get question from mongo by ID: " + req.params.id);
  question.FindByID(req.params.id, function(err, questions){
    console.log(err);
    res.json(questions);
  });
}

module.exports = router;
