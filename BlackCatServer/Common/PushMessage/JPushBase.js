/**
 * Created by li on 2015/11/11.
 */
var JPush = require("jpush-sdk");
var pushConfig=require("../../Config/sysconfig").jpushCofig;

var studentClient = JPush.buildClient(pushConfig.Student.AppKey, pushConfig.Student.MasterSecret,30,pushConfig.is_debug);
var coachClient = JPush.buildClient(pushConfig.Coach.AppKey, pushConfig.Coach.MasterSecret,30,pushConfig.is_debug);

exports.SendPlatform={
    Ios:1,
    Android:2,
    All:3
}
var ios="ios";
var android="android";

exports.pushMessagetoCoach=function(userid,title,msg_content,data,type,callback){
    var senddata={
        data:data,
        type:type
    }
    try{
        coachClient.push().setPlatform(ios,android)
            .setAudience(userid? JPush.alias(userid):JPush.ALL)
            .setMessage(msg_content,title,"text",senddata)
            .send(function(err, res) {
                if (err) {
                    if (err instanceof JPush.APIConnectionError) {
                        console.log(err.message);
                        console.log(err.isResponseTimeout);
                    } else if (err instanceof  JPush.APIRequestError) {
                        console.log(err.message);
                    }
                    console.log(err.message);
                    return callback(err);
                } else {
                    console.log('Sendno: ' + res.sendno);
                    console.log('Msg_id: ' + res.msg_id);
                    return callback(null,"suceess");
                }
            });}
    catch(err){
        console.log(err);
        return callback(err);
    }
}
exports.pushMessagetoStudent=function(userid,title,msg_content,data,type,callback){
    var senddata={
        data:data,
        type:type
    }
    try{
        studentClient.push().setPlatform(ios,android)
            .setAudience(userid? JPush.alias(userid):JPush.ALL)
            .setMessage(msg_content,title,"text",senddata)
            .send(function(err, res) {
                if (err) {
                    if (err instanceof JPush.APIConnectionError) {
                        console.log(err.message);
                        console.log(err.isResponseTimeout);
                    } else if (err instanceof  JPush.APIRequestError) {
                        console.log(err.message);
                    }
                    console.log(err.message);
                    return callback(err);
                } else {
                    console.log('Sendno: ' + res.sendno);
                    console.log('Msg_id: ' + res.msg_id);
                    return callback(null,"suceess");
                }
            });}
    catch(err){
        console.log(err);
        return callback(err);
    }
}

exports.PushToStudent=function(alert,title,userid,data,platformtype,type,callback){
if(!pushConfig.is_push){
    return callback(null,"suceess");
}
    var senddata={
        data:data,
        type:type
    }
    var playform=[]
    if(platformtype==1){
        playform.push(ios);
    } else if(platformtype==2){
        playform.push(android);
    } else{
        playform.push(ios);
        playform.push(android);
    }
    try{
    studentClient.push().setPlatform(playform)
        .setAudience(userid? JPush.alias(userid):JPush.ALL)
        .setNotification(title, JPush.ios(alert,"sound.caf",1,null,senddata),
        JPush.android(alert,title, 3,senddata))
       // .setOptions(null)
        .send(function(err, res) {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message);
                    console.log(err.isResponseTimeout);
                } else if (err instanceof  JPush.APIRequestError) {
                    console.log(err.message);
                }
                console.log(err.message);
                return callback(err);
            } else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
                return callback(null,"suceess");
            }
        });}
    catch(err){
        console.log(err);
        return callback(err);
    }
}


exports.PushToCoach=function(alert,title,userid,data,platformtype,type,callback){
    if(!pushConfig.is_push){
        return callback(null,"suceess");
    }
    var senddata={
        data:data,
        type:type
    }
    var playform=[]
    if(platformtype==1){
        playform.push(ios);
    } else if(platformtype==2){
        playform.push(android);
    } else{
        playform.push(ios);
        playform.push(android);
    }
    console.log(userid)
    try{
        coachClient.push().setPlatform(playform)
            .setAudience(userid? JPush.alias(userid):JPush.ALL)
            .setNotification(title, JPush.ios(alert,"sound.caf",1,null,senddata),
            JPush.android(alert,title, 3,senddata))
            .send(function(err, res) {
                if (err) {
                    if (err instanceof JPush.APIConnectionError) {
                        console.log(err.message);
                        console.log(err.isResponseTimeout);
                    } else if (err instanceof  JPush.APIRequestError) {
                        console.log(err.message);
                    }
                    console.log(err.message);
                    return callback(err);
                } else {
                    console.log('Sendno: ' + res.sendno);
                    console.log('Msg_id: ' + res.msg_id);
                    return callback(null,"suceess");
                }
            });}
    catch(err){
        console.log(err);
        return callback(err);
    }
}

