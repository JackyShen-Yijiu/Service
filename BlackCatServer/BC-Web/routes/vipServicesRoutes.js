var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');
var formidable = require('formidable');
var vipService = mongodb.VipServerModel;

router.post('/add', add);
router.get('/vipServiceList', getVIPServicesList);

function getVIPServicesList(req, res) {
  console.log("get vip services from mongo");
  try{
    vipService.getVIPServicesList(function(err, list){
      console.log(err);
      res.json(list);
    });
  }catch(err)
  {
    console.log(err);
  }
}

function add(req, res){
  try
  {
    console.log('add vip service.');
    console.log(req.body);


    var vip = new vipService ();
    vip.name = req.body.name;
    vip.color = req.body.color;
    

    console.log("new ct: " + vip);

    vip.save(function (err, fluffy) {
    
      if (!err){

          console.log("add vip service successful");
          res.contentType('json');
          res.send(JSON.stringify({ id: fluffy.idd, code:1 }));
          res.end();
        } else {
          console.log("add vip service: " + err);
          res.contentType('json');
          res.status(401);
            res.send(JSON.stringify({ status:"add vip service failed" , code:0}));
            res.end();
        }

      });
  }catch(err){
    console.log(err);
  }
}

module.exports = router;
