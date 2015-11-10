var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');
var formidable = require('formidable');
var fs = require('fs');
var driveSchool = mongodb.DriveSchoolModel;
var qiniu = require('../../Common/qiniuUnit');

router.get('/', function(req, res, next) {
  //res.render('questionlist');
});

router.post('/register', register);
router.post('/upload', uploadFile);
router.get('/driveSchoollist', getDriveSchoolList);
router.get('/driveSchoollistinfo/:schoolid', getDriveSchoolinfo);

function getDriveSchoolinfo(req,res){
    var schoolid =req.params.schoolid;
    driveSchool.findById(new mongodb.ObjectId(schoolid),function(err,data){
      res.json(data);
    })
}

function getDriveSchoolList(req, res) {
  console.log("get coach from mongo");
  try{
    driveSchool.getDriverSchoolList(function(err, coaches){
      console.log(err);
      res.json(coaches);
    });
  }catch(err)
  {
    console.log(err);
  }
}

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
    sch.maxprice = req.body.maxprice;
    sch.minprice = req.body.minprice;
    
    sch.pictures_path = [req.body.pictures];
    sch.pictures = [{id:1, originalpic:req.body.pictures}]
    var latlng = req.body.latlng.split(",");
    sch.latitude= latlng[1];
    sch.longitude= latlng[0] ;
    sch.loc.coordinates=[latlng[0] ,latlng[1]];


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

          fs.unlink(tmp_path, function() {
              if (err){
                console.log(err);
                res.contentType('json');
                res.send(JSON.stringify({code:0 }));
                res.end();
              }

              qiniu.uploadFile(target_path, function(err, pathInQiniu){
                if(!err){
                  res.contentType('json');
                  res.send(JSON.stringify({code:1, pathInQiniu:pathInQiniu }));
                  res.end();
                }else{
                  res.contentType('json');
                  res.send(JSON.stringify({code:0}));
                  res.end();
                }

              });
          });
        });

        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //console.log(files.uploadedfile);

        //res.end(util.inspect({fields: fields, files: files}));
    });
 
    return;
}

module.exports = router;
