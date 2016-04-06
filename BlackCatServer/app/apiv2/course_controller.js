/**
 * Created by v-yaf_000 on 2016/3/25.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var courseserverv2=require('../../Server/course_serverv2');
var mobileVerify = /^1\d{10}$/;

// 教练获取某一天 按时段的上课信息
exports.getCoachDayTimelysreservation=function(req,res){
    var  coachid=req.query.coachid;
    var  date=req.query.date;
    if (coachid===undefined|| date===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getCoachDayTimelysreservation(coachid,date,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

};

// 教练预约列表中的学员详情
exports.getstudentdetialinfo=function(req,res){
    var  userid=req.query.userid;
    if (userid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    courseserverv2.getstudentdetialinfo(userid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}
// 教练获取待确认完成列表
exports.getUConfirmCourse=function(req,res){
    var  coachid=req.query.coachid;
    if (coachid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getUConfirmCourse(coachid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
};
// 获取待预约学员列表
exports.getUreservationUserList=function(req,res){
    var  coachid=req.query.coachid;
    var subjectid=req.query.subjectid;  // 预约学员的科目  -1 全部 2 科目二 3科目三
    if (coachid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getUreservationUserList(coachid,subjectid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}
// 获取我的 学员
exports.getMyStudentList=function(req,res){
    var  coachid=req.query.coachid;
    var subjectid=req.query.subjectid;  // 预约学员的科目   1 科目一 2 科目二 3科目三 4 科目四
    var studentstate=req.query.studentstate;  // 0 全部学员 1在学学员 2未考学员 3约考学员 4补考学员  5通过学员
    var index=req.query.index?req.query.index:1;
    var count=req.query.count?req.query.count:10;
    if (coachid===undefined||
        subjectid===undefined||
        studentstate===undefined
    ){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(parseInt(subjectid)>4||parseInt(subjectid)<1){
        return res.json(new BaseReturnInfo(0,"科目状态出错",[]));
    }
    if(parseInt(studentstate)>5||parseInt(subjectid)<0){
        return res.json(new BaseReturnInfo(0,"获取考试状态出错",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getMyStudentList(coachid,subjectid,studentstate,index,count,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
};
// 获取我的学员数量
exports.getMyStudentCount=function(req,res){
    var  coachid=req.query.coachid;
    var subjectid=req.query.subjectid;  // 预约学员的科目   1 科目一 2 科目二 3科目三 4 科目四
    if (coachid===undefined||
        subjectid===undefined
    ){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(parseInt(subjectid)>4||parseInt(subjectid)<1){
        return res.json(new BaseReturnInfo(0,"科目状态出错",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getMyStudentCount(coachid,subjectid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}

//获取评论统计
exports.getCoachSummary=function(req,res){
    var  coachid=req.query.coachid;
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getCoachSummary(coachid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}
// 统计教练的学员考试信息
exports.getExamSummaryInfo=function(req,res){
    var  coachid=req.query.coachid;
    var index=req.query.index?req.query.index:1;
    var count=req.query.count?req.query.count:10;
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getExamSummaryInfo(coachid,index,count,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}
// 获取考试学员列表
exports.getExamStudentList=function(req,res){
    var  coachid=req.query.coachid;
    var subjectid=req.query.subjectid;
    var examdate=req.query.examdate;
    var examstate=req.query.examstate;  //0 全部学员 1 通过学员 2 未通过学员 3 漏靠学员
    if (coachid===undefined||subjectid===undefined||
        examdate===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getExamStudentList(coachid,subjectid,examdate,examstate,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}
// 教练登录手机号验证
exports.coachMobileVerification=function(req,res){
    var mobile = req.query.mobile;

    if (mobile === undefined) {
        //req.log.warn({err: 'no mobile in query string'});
        return res.json(
            new BaseReturnInfo(0,"手机号错误",""));
    }
    var number = mobileVerify.exec(mobile);
    if (number != mobile) {
        return res.status(400).json(
            new BaseReturnInfo(0,"手机号错误","")
        );
    }
    //  console.log("fetchCode mobile:"+mobile)
    courseserverv2.coachMobileVerification(mobile,function(err){
        if(err){
            return  res.json(
                new BaseReturnInfo(0,err,""));
        }
        else
        {
            return  res.json(
                new BaseReturnInfo(1,"","send success"));
        }
    });
}

exports.coachLoginBycode=function(req,res){
    var userinfo={
        mobile:req.body.mobile,
        smscode:req.body.smscode
    }
    if (userinfo.mobile===undefined||userinfo.smscode === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",""));
    }
    courseserverv2.studentLoginByCode(userinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}