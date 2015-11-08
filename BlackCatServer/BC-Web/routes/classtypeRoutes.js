var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');
var formidable = require('formidable');
var fs = require('fs');
var classType = mongodb.ClassTypeModel;


router.get('/', function(req, res, next) {
  //res.render('questionlist');
});

router.post('/register', register);
router.get('/classTypelist/:id', getClassTypeList);

function getClassTypeList(req, res) {
  console.log("get coach from mongo");
  try{
    classType.getClassTypeList(req.params.id, function(err, coaches){
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
    console.log('registering training field.');
    console.log(req.body);


    var ct = new classType ();
    ct.classname = req.body.classname;
    ct.schoolid = req.body.schoolid;
    ct.begindate = req.body.begindate;
    ct.enddate = req.body.enddate;
    ct.is_using = req.body.is_using;
    ct.is_vip = req.body.is_vip;
    //var carmodel_name = req.body.carmodel_name;
    //var carmodel_code = req.body.carmodel_code;
    //ct.carmodel = {modelsid:1,name:carmodel_name,code:carmodel_code};
    ct.carmodel = req.body.carmodel;
    ct.cartype = req.body.cartype;
    ct.applycount = req.body.applycount;
    ct.classdesc = req.body.classdesc;
    ct.vipserverlist = req.body.vipserverlist;
    ct.price = req.body.price;
    ct.onsaleprice = req.body.onsaleprice;    
    ct.classchedule = req.body.classchedule;
   

    console.log("new ct: " + ct);

    ct.save(function (err, fluffy) {
    
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


module.exports = router;
