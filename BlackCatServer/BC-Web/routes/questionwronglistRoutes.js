var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');

var question = mongodb.QuestionModel;
var userinfo = mongodb.UserInfoModel;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('questionwronglist-new');
});

router.get('/UserInfo/:userid', getQuestionList);
router.get('/questionbyid/:id', getQuestionByID);
router.post('/addWrongQuestion', updateWrongQuestion);

function getQuestionList(req, res) {
  console.log("get question from mongo: " + req.params.userid);

  userinfo.FindByID(req.params.userid, function(err, questions){
    console.log(err);
    res.json(questions);
  });

  /*question.List(function(err, questions){
    console.log(err);
    res.json(questions);
  });*/
}

function getQuestionByID(req, res) {

  //try to add test data in userinfo.
  /*console.log("try to add userinfo.");
  try{
    var u = new userinfo();
    u.id = "560539bea694336c25c3acb9";
    u.kemusi_wronglist=[11064, 11067];
    u.save(function (err, fluffy) {
        if (err) return console.error(err);
        console.log("saved: " + fluffy.id);
      });    
  }catch(err){
    console.log(err);
  }*/

  console.log("get question from mongo by ID: " + req.params.id);
  question.FindByID(req.params.id, function(err, questions){
    console.log(err);
    res.json(questions);
  });

  console.log("get wrong question from mongo by UserID: " + req.params.id);

}

function updateWrongQuestion(req, res){
  console.log('update wrong question.');

  userinfo.FindByID(req.body.id, function(err, questions){
    if(!err){
      console.log('finded: ' + questions);
      if(questions == null){
        var u = new userinfo();
        u.id = req.body.id;
        u.kemuyi_wronglist = req.body.kemuyi_wronglist;
        u.kemusi_wronglist = req.body.kemusi_wronglist;
        u.save(function(err, result){
            if (!err){
                res.contentType('json');
                res.send(JSON.stringify({ id: result.id, code:1 }));
                res.end();
              } else {
                res.contentType('json');
                res.status(401);
                  res.send(JSON.stringify({ status:"add wrong question failed" , code:0}));
                  res.end();
              }
        });
      }else{
        //update
        var new_kemuyi_wronglist = questions.kemuyi_wronglist.concat(req.body.kemuyi_wronglist).unique();
        questions.kemuyi_wronglist = new_kemuyi_wronglist;
        var new_kemusi_wronglist = questions.kemusi_wronglist.concat(req.body.kemusi_wronglist).unique();
        questions.kemusi_wronglist = new_kemusi_wronglist;
        
        questions.save(function(err, result){
            if (!err){
                res.contentType('json');
                res.send(JSON.stringify({ id: result.id, code:1 }));
                res.end();
              } else {
                res.contentType('json');
                res.status(401);
                  res.send(JSON.stringify({ status:"add wrong question failed" , code:0}));
                  res.end();
              }
        });
      }
    }else{

    }
  });
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

module.exports = router;
