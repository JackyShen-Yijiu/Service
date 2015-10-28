var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');
var formidable = require('formidable');
var fs = require('fs');
var coach = mongodb.CoachModel;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('coachlist');
});

router.get('/coachlist', getCoachList);
router.post('/register', register);
router.post('/upload', uploadFile);

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
  coa.idcardnumber = req.body.idcardnumber;
  coa.drivinglicensenumber = req.body.drivinglicensenumber;
  coa.coachnumber = req.body.coachnumber;
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

function uploadFile(req, res) {
  try{
    console.log('uploading file');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log('err: ' + err);

        var tmp_path = files.coachImagefile.path;
        var target_path = 'data/upload/' + files.coachImagefile.name;
        console.log("tmp_path： " + tmp_path);
        console.log("target_path " + target_path);

        fs.rename(tmp_path, target_path, function(err) {
          console.log(err);
          if (err) throw err;

          console.log("store file in : " + target_path);

          fs.unlink(tmp_path, function() {
              if (err){
                console.log(err);
                res.contentType('json');
                res.send(JSON.stringify({code:0 }));
                res.end();
              }
              res.contentType('json');
              res.send(JSON.stringify({code:1 }));
              res.end();
          });
        });

        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //console.log(files.uploadedfile);

        //res.end(util.inspect({fields: fields, files: files}));
    });
  }
  catch(err){
    console.log(err);
  }
 
    return;
}

module.exports = router;
