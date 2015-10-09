/**
 * Created by metis on 2015-08-31.
 */

var mongodb = require('../models/mongodb.js');
var feedbackModel=mongodb.FeedBackModel;

exports.saveFeedback=function(feedbackinfo,callback){
  var feedback=new feedbackModel();
    feedback.feedbackmessage=feedbackinfo.feedbackmessage;
    feedback.userid=feedbackinfo.userid;
        feedback.appversion=feedbackinfo.appversion;
        feedback.mobileversion=feedbackinfo.mobileversion;
        feedback.network=feedbackinfo.network;
        feedback.resolution=feedbackinfo.resolution;
    feedback.save(function(err){
        if(err){
            return callback("保存反馈信息出错："+err);
        }
        return callback(null,"success");
    })
}
