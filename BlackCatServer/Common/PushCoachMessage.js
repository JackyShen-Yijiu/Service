/**
 * Created by li on 2015/11/12.
 */

var BasePushmessage=require("./PushMessage/JPushBase");
var title="一步学车—教练端";
var alterinfo={
    AuditSuccess:"您提交的验证申请已通过，可以接受预约订单啦",
    AuditFailed:"您提交的审核申请没有通过，请重新提交",
    NewReservation:"您有新的预约消息，请查收",
    ReservationCancel:"您的预约被学员取消，请查看详情",
    NewComment:"您有新的预约评论请查看",
    WalletUpdate:"您的积分有更新，进入我的钱包查看详情",
    NewVersion:"一步学车教练端有版本更新啦！"
};
var pushtype={
    AuditSuccess:"auditsuccess",
    AuditFailed:"auditfailed",
    NewReservation:"newreservation",
    ReservationCancel:"reservationcancel",
    NewComment:"newcomment ",
    WalletUpdate:"walletupdate",
    NewVersion:"newversion"
}

// 发送版本更新
exports.pushNewVersion=function(apptype,callback){

    console.log(apptype);
    if(apptype===undefined ||(apptype!=2&&apptype!=1)){
        return callback("参数数据");
    }
    var senddata={
        type:pushtype.NewVersion
    }
    BasePushmessage.PushToCoach(alterinfo.NewVersion,title,undefined,senddata,apptype,function(err,data){
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
        userid:userid,
        type:pushtype.WalletUpdate
    }
    BasePushmessage.PushToCoach(alterinfo.WalletUpdate,title,userid,senddata,BasePushmessage.SendPlatform.All,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
// 发送教练评价通知
exports.pushStudentComment=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        reservationid:reservationid,
        type:pushtype.NewComment
    }
    BasePushmessage.PushToCoach(alterinfo.NewComment,title,userid,senddata,BasePushmessage.SendPlatform.All,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
// 验证成功
exports.pushAuditSuccess=function(userid,callback){
    if(userid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        type:pushtype.AuditSuccess
    }
    BasePushmessage.PushToCoach(alterinfo.AuditSuccess,title,userid,senddata,BasePushmessage.SendPlatform.All,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
// 验证失败
exports.pushAuditFailed=function(userid,callback){
    if(userid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        type:pushtype.AuditFailed
    }
    BasePushmessage.PushToCoach(alterinfo.AuditFailed,title,userid,senddata,BasePushmessage.SendPlatform.All,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

//新的订单过来
exports.pushNewReservation=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return callback("参数数据");
    }
    var senddata={
        userid:userid,
        reservationid:reservationid,
        type:pushtype.NewReservation
    }
    BasePushmessage.PushToStudent(alterinfo.NewReservation,title,userid,senddata,BasePushmessage.SendPlatform.All,function(err,data){
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
        reservationid:reservationid,
        type:pushtype.ReservationCancel
    }
    BasePushmessage.PushToStudent(alterinfo.ReservationCancel,title,userid,senddata,BasePushmessage.SendPlatform.All,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}