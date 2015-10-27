var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');

var coach = mongodb.CoachModel;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('coachlist');
});

router.get('/coachlist', getCoachList);
router.post('/register', register);

function getCoachList(req, res) {
  console.log("get coach from mongo");
  coach.getCoachList(function(err, coaches){
    console.log(err);
    res.json(coaches);
  });
}

function register(req, res){
  console.log('registering coach.');
  console.log(req.body);


  var coa = new coach ();
  coa.name = req.body.name;
  coa.address = req.body.address;
  coa.mobile = req.body.contact;
  coa.email = req.body.email;
  coa.password = req.body.password;
  coa.Seniority = req.body.Seniority;
  coa.Seniority = req.body.Seniority;
  coa.drivinglicensenumber = req.body.drivinglicensenumber;
  coa.trainfield = "561724502ab613ec10384e0c";//req.body.trainfield;
  coa.Gender = req.body.Gender;


  coa.latitude= 40.096263;
  coa.longitude=116.127921 ;
  coa.loc.coordinates=[116.127921,40.096263];


  console.log("new coach: " + coa);

  coa.save(function (err, fluffy) {
  
    if (!err){

        console.log("register coach successful");
        res.contentType('json');
          res.send(JSON.stringify({ id: fluffy.idd, code:1 }));
          res.end();
      } else {
        console.log("register coach failed: " + err);
        res.contentType('json');
        res.status(401);
          res.send(JSON.stringify({ status:"register coach failed" , code:0}));
          res.end();
      }

    });
}

module.exports = router;
