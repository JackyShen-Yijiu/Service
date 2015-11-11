coachClient/**
 * Created by li on 2015/11/11.
 */

//向学生端发送

var BasePushmessage=require(".\PushMessage\JPushBase");
var title="一步学车";
var alterinfo={
    ApplySuccess:"您已成功报名驾校，赶快开启学车之旅吧",
    ReservationSuccess:"您预约的课程已被接受，请到预约详情里查看",
    ReservationCancel:"您预约的课程被教练取消，请到预约详情里查看",
    CoachComment:"您预约的课程已经被教练评价，请到预约详情里查看评价内容",
    WalletUpdate:"您的积分有更新，进入我的钱包查看详情"
};
var pushtype={
    ApplySuccess:"userapplysuccess",
    ReservationSuccess:"reservationsuccess",
    ReservationCancel:"reservationcancel",
    CoachComment:"reservationcoachcomment ",
    WalletUpdate:"walletupdate"
}

// 发送版本更新
exports.pushNewVersion=function(apptype,callback){

}
// 发送钱包更新通知
exports.pushWalletUpdate=function(userid,callback){
    if(userid===undefined){
        return "";
    }
    var senddata={
        userid:userid,
        type:pushtype.WalletUpdate
    }
    BasePushmessage.PushToStudent(alterinfo.WalletUpdate,title,userid,senddata,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
// 发送教练评价通知
exports.pushCoachComment=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return "";
    }
    var senddata={
        userid:userid,
        reservationid:reservationid,
        type:pushtype.CoachComment
    }
    BasePushmessage.PushToStudent(alterinfo.CoachComment,title,userid,senddata,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
// 用户注册成功
exports.pushApplySuccess=function(userid,callback){
    if(userid===undefined){
        return "";
    }
    var senddata={
        userid:userid,
        type:pushtype.ApplySuccess
    }
    BasePushmessage.PushToStudent(alterinfo.ApplySuccess,title,userid,senddata,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

//发送教练接受订单 预约成功
exports.pushReservationSuccess=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return "";
    }
    var senddata={
        userid:userid,
        reservationid:reservationid,
        type:pushtype.ReservationSuccess
    }
    BasePushmessage.PushToStudent(alterinfo.ReservationSuccess,title,userid,senddata,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

// 发送教练取消订单消息

exports.pushReservationCancel=function(userid,reservationid,callback){
    if(userid===undefined|| reservationid===undefined){
        return "";
    }
    var senddata={
        userid:userid,
        reservationid:reservationid,
        type:pushtype.ReservationCancel
    }
    BasePushmessage.PushToStudent(alterinfo.ReservationCancel,title,userid,senddata,function(err,data){
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}

