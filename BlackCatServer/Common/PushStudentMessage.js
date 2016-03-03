/**
 * Created by li on 2015/11/11.
 */

//向学生端发送

var BasePushmessage=require("./PushMessage/JPushBase");
var config=require("../Config/sysconfig").appconfiginfo;
var title=config.appname;
var alterinfo={
    ApplySuccess:"您已成功报名驾校，赶快开启学车之旅吧",
    ReservationSuccess:"您预约的课程已被接受，请到预约详情里查看",
    ReservationCancel:"您预约的课程被教练取消，请到预约详情里查看",
    CoachComment:"您预约的课程已经被教练评价，请到预约详情里查看评价内容",
    WalletUpdate:"您的积分有更新，进入我的钱包查看详情",
    NewVersion:config.appname+"有版本更新啦！"
};
var pushtype={
    ApplySuccess:"userapplysuccess",
    ReservationSuccess:"reservationsuccess",
    ReservationCancel:"reservationcancel",
    CoachComment:"reservationcoachcomment ",
    WalletUpdate:"walletupdate",
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
    BasePushmessage.pushMessagetoStudent(userid,title,msg_content,senddata,pushtype.SystemMsg,function(err,data){
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
    BasePushmessage.PushToStudent(alterinfo.NewVersion,title,undefined,senddata,apptype,pushtype.NewVersion,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })

}
// 发送钱包更新通知
exports.pushWalletUpdate=function(userid,callback){
    if(userid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid
    }
    BasePushmessage.PushToStudent(alterinfo.WalletUpdate,title,userid,senddata,BasePushmessage.SendPlatform.All,pushtype.WalletUpdate,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
// 发送教练评价通知
exports.pushCoachComment=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        reservationid:reservationid
    }
    BasePushmessage.PushToStudent(alterinfo.CoachComment,title,userid,senddata,BasePushmessage.SendPlatform.All,pushtype.CoachComment,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
// 用户注册成功
exports.pushApplySuccess=function(userid,callback){
    if(userid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid
    }
    BasePushmessage.PushToStudent(alterinfo.ApplySuccess,title,userid,senddata,BasePushmessage.SendPlatform.All,pushtype.ApplySuccess,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

//发送教练接受订单 预约成功
exports.pushReservationSuccess=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        reservationid:reservationid
    }
    BasePushmessage.PushToStudent(alterinfo.ReservationSuccess,title,userid,senddata,BasePushmessage.SendPlatform.All,pushtype.ReservationSuccess,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

// 发送教练取消订单消息

exports.pushReservationCancel=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        reservationid:reservationid
    }
    BasePushmessage.PushToStudent(alterinfo.ReservationCancel,title,userid,senddata,BasePushmessage.SendPlatform.All,pushtype.ReservationCancel,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

