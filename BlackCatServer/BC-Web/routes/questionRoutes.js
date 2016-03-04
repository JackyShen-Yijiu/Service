var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb');

var question = mongodb.QuestionModel;
var userinfo = mongodb.UserInfoModel;
var cache=require("../../Common/cache")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('questionlist-new');
});

router.get('/randomquestion', function(req, res, next) {
  res.render("randomquestion");
});

router.get('/notquestion', function(req, res, next) {
  res.render("notquestion");
});

router.get('/questionlist/', getQuestionList);
router.get('/questionbyid/:id', getQuestionByID);


//获取我上一题的id
router.get('/getlastquestion/:userid', function(req,res){
  var userid=req.params.userid;

  if(userid!=undefined){
    cache.get("lastquestionid"+userid,function(err,data){
      console.log(err);
      res.json({"question":data});
    });

  }
  else {
    res.json({"question":-1});
  }
});

//
router.get('/finishquesitonidlist/:userid', function(req,res){
  var userid=req.params.userid;

  if(userid!=undefined){
    cache.get("finishquesitonidlist"+userid,function(err,data){
      console.log(err);
      if(data) {
        res.json({"finishquesitonidlist": data});
      }
      else {
        res.json({"finishquesitonidlist": []});
      }
    });

  }
  else {
    res.json({"finishquesitonidlist":[]});
  }
});
//获取我的 成绩单
router.get("/getmysocre",function(req,res){
  var  userid=req.query.userid;
  try {
    userinfo.fidOne({"id":userid})
        .select("kemuyi_score kemusi_score")
        .exec(function (err, scoredata) {
          if (err) {
            return res.json({status: err, code: 0});
          }
          if (!scoredata) {
            return res.json({status: "没有查询到成绩信息", code: 0});
          }
          return res.json({data: scoredata, code: 1});
        })
  }
  catch(e){
    return res.json({status: e.message, code: 0});
  }
})
router.post("/sendtestsocre",function(req,res){
  var userid=req.body.userid;
  var begintime=req.body.begintime;
  var endtime=req.body.endtime;
  var socre=req.body.socre;
  var subjectid=req.body.subjectid;  //1/4
  console.log(req.body);
  userinfo.FindByID(userid,function(err,questions) {
    if (!err) {
      //console.log('finded: ' + questions.id);
      if (!questions) {
        var u = new userinfo();
        u.id = userid;
        u.kemuyi_wronglist = [];
        u.kemusi_wronglist = [];
        u.kemuyi_score=[];
        u.kemusi_score=[];
        var tempsocre= {
          socre:socre,
          begintime:begintime,
          endtime:endtime,
          is_pass:socre>=90?1:0
            }
        if(subjectid==1){
          u.kemuyi_score=[tempsocre];
        }
        else {
          u.kemusi_score=[tempsocre];
        }
        u.save(function(err,data){
          if(err){
            res.send(JSON.stringify({ status:err , code:0}));
          }
          res.send(JSON.stringify({ status:"success" , code:0}));
        })
      } else {

        var tempsocre= {
          socre:socre,
          begintime:begintime,
          endtime:endtime,
          is_pass:socre>=90?1:0
        }
        if(questions.kemuyi_score===undefined){
          questions.kemuyi_score=[];
        }
        if(questions.kemusi_score===undefined){
          questions.kemusi_score=[];
        }

        if(subjectid==1){
          questions.kemuyi_score.push(tempsocre);
        }
        else {
          questions.kemusi_score.push(tempsocre);
        }

        questions.save(function(err,data){
          if(err){
            res.send(JSON.stringify({ status:err , code:0}));
          }
          res.send(JSON.stringify({ status:"success" , code:0}));
        })
      }
    } else {
      res.send(JSON.stringify({ status:"save socre failed" , code:0}));
    }
  })

})
function getQuestionList(req, res) {
  console.log("get question from mongo: " + req.params.id);
  question.List(function(err, questions){
    console.log(err);
    res.json(questions);
  });
}

function getQuestionByID(req, res) {
  console.log("get question from mongo by ID: " + req.params.id);
  var userid=req.query.userid;
  question.FindByID(req.params.id, function(err, questions){
    console.log(err);
     if(userid!=undefined){
       cache.set("lastquestionid"+userid,req.params.id,function(err,data){});
       cache.get("finishquesitonidlist"+userid,function(err,data){
         if(!data){
           cache.set("finishquesitonidlist"+userid,[req.params.id],function(err,data){});
         }
         if (data.indexOf(req.params.id)==-1){
           data.push(req.params.id);
           cache.set("finishquesitonidlist"+userid,data,function(err,data){});
         }
       });
     }
    res.json(questions);
  });
}


module.exports = router;
