var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');

var driveSchool = mongodb.DriveSchoolModel;


router.get('/', function(req, res, next) {
  //res.render('questionlist');
});

router.post('/register', register);

function register(req, res){
  console.log('registering school.');
  console.log(req.body);


  var sch = new driveSchool ();
  sch.name = req.body.name;
  sch.address = req.body.address;
  sch.phone = req.body.contact;

  sch.latitude= 40.096263;
  sch.longitude=116.127921 ;
  sch.loc.coordinates=[116.127921,40.096263];
  sch.maxprice=5000;
  sch.minprice=3000;

  console.log("new school: " + sch);

  sch.save(function (err, fluffy) {
  
    if (!err){

        console.log("register school successful");
        res.contentType('json');
          res.send(JSON.stringify({ id: fluffy.idd, code:1 }));
          res.end();
      } else {
        console.log("register school failed: " + err);
        res.contentType('json');
        res.status(401);
          res.send(JSON.stringify({ status:"register school failed" , code:0}));
          res.end();
      }

    });
}

module.exports = router;
