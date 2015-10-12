var express = require('express');
var router = express.Router();
var coach = require('../models/coach');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('coachlist');
});

router.get('/coachlist', getCoachList);

function getCoachList(req, res) {

  coach.getCoachList(function(err, coaches){
    res.json(coaches);
  });
}

module.exports = router;
