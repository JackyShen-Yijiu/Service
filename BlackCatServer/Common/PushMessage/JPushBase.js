/**
 * Created by li on 2015/11/11.
 */
var JPush = require("jpush-sdk");
var pushConfig=require("../../Config/sysconfig").jpushCofig;

var studentClient = JPush.buildClient(pushConfig.Student.AppKey, pushConfig.Student.MasterSecret);
var coachClient = JPush.buildClient(pushConfig.Coach.AppKey, pushConfig.Coach.MasterSecret,30,pushConfig.is_debug);

exports.SendPlatform={
    Ios:1,
    Android:2,
    All:3
}



exports.PushToStudent=function(alert,title,userid,data,platform,callback){
    var ios=(platform==2)?null:"ios";
    var android=(platform==1)?null:"android";
    console.log("test")
    studentClient.push().setPlatform(ios, android)
        .setAudience(userid? JPush.alias(userid):JPush.ALL)
        .setNotification(title, JPush.ios(alert,"sound.caf",1,null,data), JPush.android(alert,title, 3,data
        ))
       /// .setOptions(null)
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
                callback(null,"suceess");
            }
        });
}


exports.PushToCoach=function(alert,title,userid,data,callback){
    coachClient.push().setPlatform('ios', 'android')
        .setAudience(userid? JPush.alias(userid):JPush.ALL)
        .setNotification(title, JPush.ios(alert,"sound.caf",1,null,data), JPush.android(alert,title, 3,data
        ))
        .setOptions(null)
        .send(function(err, res) {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message);
                    console.log(err.isResponseTimeout);
                } else if (err instanceof  JPush.APIRequestError) {
                    console.log(err.message);
                }
                return callback(err);
            } else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
                callback(null,"suceess");
            }
        });
}

