var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');
var formidable = require('formidable');
var fs = require('fs');
var trainingField = mongodb.TrainingFieldModel;
var qiniu = require('../../Common/qiniuUnit');


router.get('/', function(req, res, next) {
  //res.render('questionlist');
});

router.post('/register', register);
router.post('/upload', uploadFile);
router.get('/trainingFieldlist/:id', getTrainingField);

function getTrainingField(req, res) {
  console.log("get training filed from mongo");
  try{
    trainingField.getTrainingFieldList(req.params.id, function(err, trainingFields){
      console.log(err);
      res.json(trainingFields);
    });
  }catch(err)
  {
    console.log(err);
  }
}
function register(req, res){
  try
  {
    console.log('registering training field.');
    console.log(req.body);


    var fie = new trainingField ();
    fie.fieldname = req.body.fieldname;
    fie.driveschool = req.body.driveschool;
    fie.province = req.body.province;
    fie.city = req.body.city;
    fie.address = req.body.address;
    fie.responsible = req.body.responsible;
    fie.phone = req.body.phone;
    fie.capacity = req.body.capacity;
    fie.fielddesc = req.body.fielddesc;
    var subject = {subjectid:2, name:req.body.subject};
    fie.subject = [subject];    
    fie.pictures = [{id:1, originalpic:req.body.pictures}]

    fie.latitude= 40.096263;
    fie.longitude=116.127921 ;
    fie.loc.coordinates=[116.127921,40.096263];

    console.log("new field: " + fie);

    fie.save(function (err, fluffy) {
    
      if (!err){

          console.log("register field successful");
          res.contentType('json');
          res.send(JSON.stringify({ id: fluffy.idd, code:1 }));
          res.end();
        } else {
          console.log("register field failed: " + err);
          res.contentType('json');
          res.status(401);
            res.send(JSON.stringify({ status:"register field failed" , code:0}));
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

        var tmp_path = files.fieldImagefile.path;
        var target_path = 'data/upload/' + files.fieldImagefile.name;
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
