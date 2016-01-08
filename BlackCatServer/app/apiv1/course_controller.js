/**
 * Created by v-lyf on 2015/9/6.
 */
// 处理教练课程相关信息
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var courseserver=require('../../Server/course_server');
require('date-utils');

// 获取教练某一天的课程安排
exports.GetCourseByCoach=function(req,res){
    var  coachid=req.query.coachid;
    var  date=req.query.date;
    if (coachid===undefined|| date===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    var now = new Date();
    var coursedate=new Date(date);
    //console.log(now.getDaysBetween(coursedate));
    // 只能获取七天内的课程信息
    if(now.getDaysBetween(coursedate)>7||now.getDaysBetween(coursedate)<0){
        return res.json(new BaseReturnInfo(0,"无法获取该时间段的课程安排",""));
    }
    courseserver.GetCoachCourse(coachid,date,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
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
    var subjectid = req.query.subjectid;
    var reservationstate = req.query.reservationstate;
    if(subjectid===undefined){
        subjectid=2;
    }
    if(reservationstate===undefined){
        reservationstate=0;
    }
  if(!req.userId){
      return res.json(
          new BaseReturnInfo(0,"无法验证权限",[]));
  }
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserver.getuserReservation(userid,subjectid,reservationstate,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
exports.getCourseDeatil=function(req,res){
    var courseid=req.params.courseid;
    courseserver.getCourseDeatil(courseid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}
// 用户取消预约
exports.userCancelReservation=function(req,res){
    var cancelinfo= {
        userid:req.body.userid,
        reservationid:req.body.reservationid,
        cancelreason:req.body.cancelreason,
        cancelcontent:req.body.cancelcontent
    };
    if (cancelinfo.userid === undefined
        ||cancelinfo.reservationid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(cancelinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };

    courseserver.userCancelReservation(cancelinfo,function(err,data){
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
        learningcontent:req.body.learningcontent,
        contentremarks:req.body.contentremarks
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

    courseserver.userfinishReservation(reservationinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

// 教练完成预约
exports.coachfinishReservation=function(req,res){
    var reservationinfo= {
        coachid:req.body.coachid,
        reservationid:req.body.reservationid,
        learningcontent:req.body.learningcontent,
        contentremarks:req.body.contentremarks


};
    if (reservationinfo.coachid === undefined
        ||reservationinfo.reservationid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(reservationinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };

    courseserver.userfinishReservation(reservationinfo,function(err,data){
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
        attitudelevel:req.body.attitudelevel,
        timelevel:req.body.timelevel,
        abilitylevel:req.body.abilitylevel,
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
    courseserver.userComment(commentinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 获取教练或者用户的评论
exports.getUserComment=function(req,res){
    var queryinfo= {
        userid:req.params.userid,
        type:req.params.type,
        index:req.params.index
    };
    if (queryinfo.userid === undefined
        ||queryinfo.type === undefined||
        queryinfo.index === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",[]));
    };
    courseserver.GetComment(queryinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
//获取用户同时段学员
exports.sameTimeStudents=function(req,res){
    var reservationid = req.params.reservationid;
    var index =req.params.index;
    var userid = req.userId;
    //|| userid===undefined
    if (reservationid===undefined|| index===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    courseserver.getSameTimeStudents(reservationid,userid,index,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));

    });
}
exports.sameTimeStudentsv2=function(req,res){
    var index =req.query.index;
    var coachid = req.query.coachid;
    var begintime=req.query.begintime;
    var endtime=req.query.endtime;
    courseserver.getSameTimeStudentsv2(coachid,begintime,endtime,index,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
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
        attitudelevel:req.body.attitudelevel,
        timelevel:req.body.timelevel,
        abilitylevel:req.body.abilitylevel,
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
    courseserver.coachComment(commentinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 教练获取某一天的上课信息
exports.getCoachDaysreservation=function(req,res){
    var  coachid=req.query.coachid;
    var  date=req.query.date;
    if (coachid===undefined|| date===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserver.getCoachDaysreservation(coachid,date,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}
// 教练获取没有处理预约申请
exports.getreservationapply=function(req,res){
    var  coachid=req.query.coachid;
    if (coachid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserver.getreservationapply(coachid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

};
// 获取我每个月的课程安排

exports.getmonthapplydata= function(req,res){
        var  coachid=req.query.coachid;
        var  year=req.query.year;
        var  month=req.query.month;
        if (coachid===undefined||year===undefined||month===undefined){
            return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
        }
        if(coachid!=req.userId){
            return res.json(
                new BaseReturnInfo(0,"无法确认请求用户",[]));
        };
        courseserver.getmonthapplydata(coachid,year,month,function(err,data){
            if (err){
                return res.json(new BaseReturnInfo(0,err,[]));
            }
            return res.json(new BaseReturnInfo(1,"",data));
        });

    };
// 教练获取所有的预约列表
exports.getCoachReservationList=function(req,res){
    var queryinfo= {
          coachid:req.query.coachid,
         reservationstate:req.query.reservationstate?req.query.reservationstate:0,
         index:req.query.index?req.query.index:1
}
    if (queryinfo.coachid===undefined|| queryinfo.index===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(queryinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserver.getCoachReservationList(queryinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}
// 提交教练的预约请求
exports.postCoachLeave=function(req,res){
    var leaveinfo={
        coachid:req.body.coachid,
        begintime:req.body.begintime,
        endtime:req.body.endtime
    }
    if (leaveinfo.coachid===undefined|| leaveinfo.begintime===undefined|| leaveinfo.endtime===undefined ){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    if(leaveinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    if(Date.now()>new Date(leaveinfo.begintime*1000)|| new Date(leaveinfo.begintime*1000)>new Date(leaveinfo.endtime*1000)){
        return res.json(new BaseReturnInfo(0,"该时段不能请假"));
    }
    courseserver.saveCoachLeaveInfo(leaveinfo ,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 学员获取预约详情
exports.userGetReservationInfo=function(req,res){
    var reservationid=req.params.reservationid;
    var userid=req.userId;
    if (reservationid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    courseserver.getUserReservationinfo(reservationid,userid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
//
// 教练获取预约详情
exports.coachGetReservationInfo=function(req,res){
    var reservationid=req.params.reservationid;
    var coachid=req.userId;
    if (reservationid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",{}));
    }
    courseserver.getCoachReservationinfo(reservationid,coachid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 教练处理订单 拒绝或者接受
exports.postCoachHandleInfo=function(req,res){

    var handleinfo= {
        coachid:req.body.coachid,
        reservationid:req.body.reservationid,
        handletype:req.body.handletype,
        cancelreason:req.body.cancelreason,
        cancelcontent:req.body.cancelcontent
    };
    if (handleinfo.coachid === undefined
        ||handleinfo.reservationid === undefined||
        handleinfo.handletype === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(handleinfo.coachid!=req.userId){
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
// 学生获取我所有的预约教练
exports.getMyCoachList=function(req,res){
    var userid=req.userId;
    courseserver.getMyCoachList(userid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
};



