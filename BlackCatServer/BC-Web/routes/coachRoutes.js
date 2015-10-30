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

  try{
    var coa = new coach ();
    coa.name = req.body.name;
    coa.validationstate = req.body.validationstate;
    coa.Gender = req.body.Gender;
    coa.province = req.body.province;
    coa.city = req.body.city;
    coa.address = req.body.address;
    coa.mobile = req.body.phone;
    coa.email = req.body.email;
    coa.password = req.body.password;
    coa.Seniority = req.body.Seniority;
    coa.idcardnumber = req.body.idcardnumber;
    coa.drivelicensenumber = req.body.drivelicensenumber;
    coa.coachnumber = req.body.coachnumber;
    coa.driveschool = req.body.driveschool;
    coa.driveschoolinfo = {name:req.body.driveschoolName, id:req.body.driveschool};
    coa.introduction = req.body.abs;
    coa.studentcount = req.body.studentcount;
    coa.passrate = req.body.passrate;
    coa.starlevel = req.body.starlevel;
    coa.worktimedesc = req.body.workingtime;
    coa.worktime = [{timeid:1, timespace:"8:00-9:00", begintime:"8:00", endtime:"9:00"}];
    coa.workweek = [1,2,3,4,5];
    coa.worktimespace = {begintimeint:8, endtimeint:17};
    coa.subject = req.body.subject;
    coa.is_shuttle = req.body.is_shuttle;
    coa.shuttlemsg = req.body.shuttlemsg;
    coa.carmodel = req.body.carmodel;
    coa.trainfield = req.body.trainfield;
    coa.trainfieldlinfo = {name:req.body.trainfieldName,id:req.body.trainfield};
    coa.platenumber = req.body.platenumber;
    coa.serverclasslist = req.body.serverclasslist;


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
  }catch(err){
    console.log(err);
  }
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
