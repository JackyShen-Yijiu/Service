var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');
var formidable = require('formidable');
var fs = require('fs');
var driveSchool = mongodb.DriveSchoolModel;


router.get('/', function(req, res, next) {
  //res.render('questionlist');
});

router.post('/register', register);
router.post('/upload', uploadFile);

function register(req, res){
  try
  {
    console.log('registering school.');
    console.log(req.body);


    var sch = new driveSchool ();
    sch.name = req.body.name;
    sch.province = req.body.province;
    sch.city = req.body.city;
    sch.address = req.body.address;
    sch.phone = req.body.phone;
    sch.responsible = req.body.responsible;
    sch.hours = req.body.hours;  
    sch.website = req.body.website;
    sch.email = req.body.email;
    sch.introduction = req.body.introduction;
    sch.coachcount = req.body.coachcount;
    sch.carcount = req.body.carcount;
    sch.schoollevel = req.body.schoollevel;
    sch.studentcount = req.body.studentcount;
    sch.passingrate = req.body.passingrate;
    sch.hotindex = req.body.hotindex;
    sch.registertime = req.body.registertime;
    sch.businesslicensenumber = req.body.businesslicensenumber;
    sch.organizationcode = req.body.organizationcode;
    
    sch.pictures_path = [req.body.picPath];

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
  }catch(err){
    console.log(err);
  }
}

 function uploadFile(req, res) {
    console.log('uploading file');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log('err: ' + err);

        var tmp_path = files.uploadedfile.path;
        var target_path = 'data/upload/' + files.uploadedfile.name;
        console.log("tmp_path： " + tmp_path);
        console.log("target_path " + target_path);

        fs.rename(tmp_path, target_path, function(err) {
          console.log(err);
          if (err) throw err;

          console.log("store file in : " + target_path);

          /*fs.unlink(tmp_path, function() {
              if (err) throw err;
              res.send(JSON.stringify({code:1 }));
              res.end();
          });*/
        });

        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //console.log(files.uploadedfile);

        //res.end(util.inspect({fields: fields, files: files}));
    });
 
    return;
}

module.exports = router;
