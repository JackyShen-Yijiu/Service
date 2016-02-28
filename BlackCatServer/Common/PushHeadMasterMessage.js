/**
 * Created by v-yaf_000 on 2015/12/11.
 */
/**
 * Created by li on 2015/11/11.
 */

//向校长端发送

var BasePushmessage=require("./PushMessage/JPushBase");
var config=require("../Config/sysconfig").appconfiginfo;
var title=config.appname+"--校长端";
var alterinfo={
    ApplySuccess:"有新的学员报名你的驾校,请查看",
    Complaint:"收到新的投诉消息，请查看",
    NewVersion:config.appname+"有版本更新啦！"
};
var pushtype={
    ApplySuccess:"userapplysuccess",
    Complaint:"newcomplaint",
    NewVersion:"newversion",
    SystemMsg:"systemmsg"
}
// 发送系统消息
exports.pushSystemMessage=function(userid,title,msg_content,callback){
    if(title===undefined|| msg_content===undefined){
        return callback("参数错误");
    }
    var senddata={
        userid:userid,
        title:title,
        msg_content:msg_content
    }
    BasePushmessage.pushMessagetoHeadMaster(userid,title,msg_content,senddata,pushtype.SystemMsg,function(err,data){
        if(err){

            return callback(err);
        }
        return callback(null,data);
    })
}
// 发送版本更新
exports.pushNewVersion=function(apptype,callback){

    console.log(apptype);
    if(apptype===undefined ||(apptype!=2&&apptype!=1)){
        return callback("参数数据");
    }
    var senddata={

    }
    BasePushmessage.PushToHeadMaster(alterinfo.NewVersion,title,undefined,senddata,apptype,pushtype.NewVersion,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })

}


// 发送用户注册
exports.pushStudentApply=function(userid,studentid,callback){
    if(userid===undefined|| studentid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        studentid:studentid
    }
    BasePushmessage.PushToHeadMaster(alterinfo.ApplySuccess,title,userid,senddata,
        BasePushmessage.SendPlatform.All,pushtype.ApplySuccess,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

exports.pushComplaintToHeadMaster=function(userid,reservationid,callback){
    if(userid===undefined||reservationid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        reservationid:reservationid
    }
    BasePushmessage.PushToHeadMaster(alterinfo.Complaint,title,userid,senddata,
        BasePushmessage.SendPlatform.All,pushtype.Complaint,function(err,data){
            if(err){
                return callback(err);
            }
            return callback(null,data);
        })
}

