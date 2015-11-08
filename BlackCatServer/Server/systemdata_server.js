/**
 * Created by metis on 2015-08-31.
 */

var mongodb = require('../models/mongodb.js');
var feedbackModel=mongodb.FeedBackModel;
var headLineModel=mongodb.HeadLineNewsModel;
var courseWareModel=mongodb.CourseWareModel;

exports.saveFeedback=function(feedbackinfo,callback){
  var feedback=new feedbackModel();
    feedback.feedbackmessage=feedbackinfo.feedbackmessage;
    feedback.userid=feedbackinfo.userid;
        feedback.appversion=feedbackinfo.appversion;
        feedback.mobileversion=feedbackinfo.mobileversion;
        feedback.network=feedbackinfo.network;
        feedback.resolution=feedbackinfo.resolution;
    feedback.createtime=new Date();
    //console.log(feedback.createtime);
    feedback.save(function(err){
        if(err){
            return callback("保存反馈信息出错："+err);
        }
        return callback(null,"success");
    })
};
exports.getHeadLineNews=function(callback){
    headLineModel.find({"is_using":"true"})
        .limit(8)
        .sort({createtime: -1 })
        .exec(function(err,data){
            if(err){
                return callback("查询头条信息错误："+err);
            }
            return  callback (null ,data);
        })
};

exports.getCourseWare=function( queryinfo,callback){
    if (queryinfo.seqindex==0){
        queryinfo.seqindex=Number.MAX_VALUE;
    }
    //console.log(queryinfo)
    courseWareModel.find({"is_using":true,seqindex:{$lt:queryinfo.seqindex},"subject.subjectid":queryinfo.subjectid})
        .select("name pictures  videourl subject seqindex")
        .sort({"sqlindex" : -1})
        .limit(queryinfo.count)
        .exec(function(err,data){
            if(err){
                return callback("查询课件出错："+err);
            }
            return callback(null,data)
        })
};
