/**
 * Created by v-lyf on 2015/9/6.
 */
// 处理教练课程相关信息
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var courseserver=require('../../Server/course_server');

// 获取教练某一天的课程安排
exports.GetCourseByCoach=function(req,res){
    var  coachid=req.query.coachid;
    var  date=req.query.date;
    if (coachid===undefined|| date===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    courseserver.GetCoachCourse(coachid,date,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

exports.postReservation=function(req,res){
    //console.log(req.body);
    var reservationinfo= {
        userid:req.body.userid,
        coachid:req.body.coachid,
        courselist:req.body.courselist,
        is_shuttle:req.body.is_shuttle,
        address : req.body.address,
        begintime:req.body.begintime,
        endtime:req.body.endtime
    };
    if (reservationinfo.userid === undefined
        ||reservationinfo.coachid === undefined ||reservationinfo.courselist === undefined
        ||reservationinfo.begintime === undefined ||reservationinfo.endtime === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(reservationinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    if(!reservationinfo.courselist||reservationinfo.courselist.length<=0){
        return res.json(
            new BaseReturnInfo(0,"课程不能为空",""));
    }
    courseserver.postReservation(reservationinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

exports.getuserresveration=function(req,res){
   var userid=req.query.userid;
  if(!req.userId){
      return res.json(
          new BaseReturnInfo(0,"无法验证权限",""));
  }
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    courseserver.getuserReservation(userid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
exports.getCourseDeatil=function(req,res){
    var courseid=req.params.courseid;
    courseserver.getCourseDeatil(courseid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}
// 用户取消预约
exports.userCancelReservation=function(req,res){
    var cancelinfo= {
        userid:req.body.userid,
        reservationid:req.body.reservationid,
    };
    if (cancelinfo.userid === undefined
        ||cancelinfo.reservationid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(reservationinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };

    courseserver.userCancelReservation(cancelinfo.reservationid,cancelinfo.userid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

//用户完成预约
exports.userfinishReservation=function(req,res){
    var reservationinfo= {
        userid:req.body.userid,
        reservationid:req.body.reservationid,
    };
    if (reservationinfo.userid === undefined
        ||reservationinfo.reservationid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(reservationinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };

    courseserver.userfinishReservation(reservationinfo.reservationid,reservationinfo.userid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

//用户投诉
exports.postUserComplaint=function(req,res){
    var complaintinfo= {
        userid:req.body.userid,
        reservationid:req.body.reservationid,
        reason:req.body.reason,
        complaintcontent:req.body.complaintcontent
    };
    if (complaintinfo.userid === undefined
        ||complaintinfo.reservationid === undefined||
        complaintinfo.reason === undefined ) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(complaintinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    courseserver.userComplaint(complaintinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 用户评论
exports.postUserComment=function(req,res){
    var commentinfo= {
        userid:req.body.userid,
        reservationid:req.body.reservationid,
        starlevel:req.body.starlevel,
        commentcontent:req.body.commentcontent
    };
    if (commentinfo.userid === undefined
        ||commentinfo.reservationid === undefined||
        commentinfo.starlevel === undefined||commentinfo.commentcontent === undefined ) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(commentinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    courseserver.userComment(complaintinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 教练评论
exports.postCoachComment=function(req,res){
    var commentinfo= {
        coachid:req.body.coachid,
        reservationid:req.body.reservationid,
        starlevel:req.body.starlevel,
        commentcontent:req.body.commentcontent
    };
    if (commentinfo.coachid === undefined
        ||commentinfo.reservationid === undefined||
        commentinfo.starlevel === undefined||commentinfo.commentcontent === undefined ) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(commentinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    courseserver.coachComment(complaintinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

// 教练处理订单 拒绝或者接受
exports.postCoachHandleInfo=function(req,res){
    var handleinfo= {
        coachid:req.body.coachid,
        reservationid:req.body.reservationid,
        handletype:req.body.handletype
    };
    if (handleinfo.coachid === undefined
        ||handleinfo.reservationid === undefined||
        handleinfo.handletype === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(commentinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    courseserver.coachHandleInfo(handleinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
