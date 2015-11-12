/**
 * Created by li on 2015/11/11.
 */
var express   = require('express');
var pushtest = express.Router();
var pushstudent=require("../Common/PushStudentMessage");

var BaseReturnInfo = require('../custommodel/basereturnmodel.js');

pushtest.get("/student/pushNewVersion",function(req,res){
    var apptype=req.query.apptype;
    pushstudent.pushNewVersion(apptype,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
pushtest.get("/student/walletupdate",function(req,res){
    var userid=req.query.userid;
    pushstudent.pushWalletUpdate(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});


pushtest.get("/student/pushCoachComment",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushstudent.pushCoachComment(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
pushtest.get("/student/pushApplySuccess",function(req,res){
    var userid=req.query.userid;

    pushstudent.pushApplySuccess(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/student/pushReservationSuccess",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushstudent.pushReservationSuccess(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/student/pushReservationCancel",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushstudent.pushReservationCancel(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});



module.exports = pushtest;