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
})

module.exports = pushtest;