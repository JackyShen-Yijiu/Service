var express = require('express');
var router = express.Router();
var mongodb = require('../models/mongodb');

var coach = mongodb.CoachModel;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('coachlist');
});

router.get('/coachlist', getCoachList);

function getCoachList(req, res) {
  console.log("get coach from mongo");
  coach.getCoachList(function(err, coaches){
    console.log(err);
    res.json(coaches);
  });
}

module.exports = router;
