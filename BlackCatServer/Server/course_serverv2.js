/**
 * Created by v-yaf_000 on 2016/3/25.
 */
var mongodb = require('../models/mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var userfcode= mongodb.UserFcode;
var appTypeEmun=require("../custommodel/emunapptype");
var cache=require("../Common/cache");
var jwt = require('jsonwebtoken');
var secretParam= require('./jwt-secret').secretParam;
var UserExamInfo=mongodb.UserExamInfo;
var resbasecoachinfomode=require("../custommodel/returncoachinfo").resBaseCoachInfo;
var regisermobIm=require('../Common/mobIm');
var courses_serverv1=require("./course_server");
var user_serverv1=require("./user_server");
var eventproxy   = require('eventproxy');
require('date-utils');
var _ = require("underscore");
var timeout = 60 * 5;
var  defaultFun={
    getStudentInfo:function(userid,callback){
        usermodel.findById(new mongodb.ObjectId(userid))
            .select("_id name mobile headportrait  applyclasstypeinfo subject subjectone  " +
                "subjecttwo  subjectthree subjectfour address examinationinfo")
            .exec(function(err,r){
                if(err){
                    return  callback(err);
                }
                if(!r){
                    return  callback("没有查到学员信息");
                }
                var returninfo={
                    userid: r._id,
                    name: r.name,
                    mobile: r.mobile,
                    headportrait: r.headportrait,
                    applyclasstypeinfo: r.applyclasstypeinfo,
                    subject: r.subject,
                    address: r.address,
                    subjectone:r.subjectone,
                    subjecttwo:r.subjecttwo,
                    subjectthree:r.subjectthree,
                    subjectfour:r.subjectfour,
                    examinationinfo:{
                        subjectone:{
                            examinationresult: r.examinationinfo.subjectone.examinationstate,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjectone.examinationresultdesc,  //  考试结果描述
                            testcount:r.examinationinfo.subjectone.testcount||0,  //  考试结果描述
                            examinationdate:r.examinationinfo.subjectone.examinationdate,  //  考试结果描述
                            score:r.examinationinfo.subjectone.score,  //  考试结果描述

                        },
                        subjecttwo:{
                            examinationresult: r.examinationinfo.subjecttwo.examinationresult,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjecttwo.examinationresultdesc,  //  考试结果描述
                            testcount:r.examinationinfo.subjecttwo.testcount||0,  //  考试结果描述
                            examinationdate:r.examinationinfo.subjecttwo.examinationdate,  //  考试结果描述
                            score:r.examinationinfo.subjecttwo.score,  //  考试结果描述
                        },
                        subjectthree:{
                            examinationresult: r.examinationinfo.subjectthree.examinationresult,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjectthree.examinationresultdesc,  //  考试结果描述
                            testcount:r.examinationinfo.subjectthree.testcount||0,  //  考试结果描述
                            examinationdate:r.examinationinfo.subjectthree.examinationdate,  //  考试结果描述
                            score:r.examinationinfo.subjectthree.score,  //  考试结果描述
                        },
                        subjectfour:{
                            examinationresult: r.examinationinfo.subjectfour.examinationresult,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjectfour.examinationresultdesc,  //  考试结果描述
                            testcount:r.examinationinfo.subjectfour.testcount||0,  //  考试结果描述
                            examinationdate:r.examinationinfo.subjectfour.examinationdate,  //  考试结果描述
                            score:r.examinationinfo.subjectfour.score,  //  考试结果描述
                        }
                    },
                }
                return callback(null,returninfo)
            })
    },
    // 获取学员获取到的评论
    getStuentComment:function(userid,callback){
        reservationmodel.find({"userid":new mongodb.ObjectId(userid),"is_coachcomment":"true"})
            .select("coachid coachcomment finishtime learningcontent courseprocessdesc")
            .populate("coachid","_id  name headportrait gender ")
            .sort({"coachcomment.commenttime":-1})
            .exec(function(err,data){
                if(err){
                    return callback("查询评论出错："+err);
                }
                process.nextTick(function(){
                    var commnetlist=[];
                    data.forEach(function(r,index){
                        var onecommnet={
                            _id: r._id,
                            coachid : r.coachid,
                            coachcomment: r.coachcomment,
                            learningcontent: r.learningcontent,
                            courseprocessdesc: r.courseprocessdesc,
                            finishtime: r.finishtime,
                            timestamp:(new Date(r.finishtime)).getTime()
                        }
                        commnetlist.push(onecommnet);
                    })
                    return callback(null,commnetlist);
                });

            })
    },

}
// 教练  按时段 获取某一天的上课信息
exports.getCoachDayTimelysreservation=function(coachid,date,callback){
    getReservationdetial=function(reservationid,list){
        var index=-1;
        for (var i=0;i<list.length;i++){
            if(list[i]._id.toString()==reservationid.toString()){
                index=i;
                break;
            }
        }
        return index;
    }
    date=new Date(date).toFormat("YYYY-MM-DD").toString();
    var now  =new Date();
    if(now.getDaysBetween(new Date(date))>7){
        //return res.json(new BaseReturnInfo(0,"无法获取该时间段的课程安排",[]));
        return callback("无法获取该时间段的课程安排");

    }
    coursemode.findCourse(coachid,date,function(err,coursedata) {
        if (err) {
            return callback("查询课程信息出错：" + err);
        }

        if (!coursedata || coursedata.length == 0) {

           // return callback(null,[]);
            courses_serverv1.GetCoachCourse(coachid,date,function(err,coursedata){
                if(err){
                    return callback(err,[]);
                }
                var courserlist=[];
                coursedata.forEach(function(r,index){
                    var listone= {
                        _id: r._id,
                        coachid: r.coachid,
                        driveschool:r.coachid ,// 所在学校
                        coursedate:r.coursedate,  //  课程日期
                        coursebegintime:r.coursebegintime,  // 课程开始时间
                        courseendtime:r.courseendtime,  // 课程的结束时间
                        createtime:r.createtime,
                        coursetime:r.coursetime,  // 璇剧▼鏃堕棿
                        coursestudentcount:r.coursestudentcount,//课程 可以选择的人数
                        selectedstudentcount:r.selectedstudentcount , //选择 学生人数
                        courseuser:r.courseuser, // 选择学生人
                        coursereservation:r.coursereservation, //预约id
                        signinstudentcount:r.signinstudentcount , // 签到学生数量
                    };
                    courserlist.push(listone);
                });
                return callback(null,courserlist);
            })
        }
        else{
            var datenow =new Date(date);
            var datetomorrow = datenow.addDays(1);
            reservationmodel.find( { coachid:new mongodb.ObjectId(coachid)
                    ,$or:[{reservationstate:appTypeEmun.ReservationState.applyconfirm},{reservationstate:appTypeEmun.ReservationState.applying}
                        ,{reservationstate:appTypeEmun.ReservationState.finish},{reservationstate:appTypeEmun.ReservationState.ucomments}
                        ,{reservationstate:appTypeEmun.ReservationState.unconfirmfinish},{reservationstate:9},{reservationstate:10}]
                    ,begintime: { $gte: (new Date(date)).clearTime(), $lte:datetomorrow.clearTime()}})
                .select("userid reservationstate reservationcreatetime begintime endtime subject  courseprocessdesc" )
                .populate( "userid"," _id  name headportrait ")
                .sort({"begintime":1})
                .exec(function(err,reservationdata){
                    if(err){
                        return callback("查询数据出错："+err);
                    }
                    process.nextTick(function(){
                        var list=[];
                        var courserlist=[];
                        reservationdata.forEach(function(r,index){
                            var listone= {
                                _id: r._id,
                                userid: r.userid,
                                reservationstate: (r.is_coachcomment&&r.reservationstate==appTypeEmun.ReservationState.ucomments)?
                                    appTypeEmun.ReservationState.finish: r.reservationstate,
                                reservationcreatetime: r.reservationcreatetime,
                                courseprocessdesc: r.courseprocessdesc,
                                begintime :r.begintime,
                                endtime :r.endtime,
                                subject:r.subject,
                            };
                            list.push(listone);
                        });

                        coursedata= _.sortBy(coursedata,'coursebegintime');
                        coursedata.forEach(function(r,index){
                            var listone= {
                                _id: r._id,
                                coachid: r.coachid,
                                driveschool:r.coachid ,// 所在学校
                                coursedate:r.coursedate,  //  课程日期
                                coursebegintime:r.coursebegintime,  // 课程开始时间
                                courseendtime:r.courseendtime,  // 课程的结束时间
                                createtime:r.createtime,
                                coursetime:r.coursetime,  // 璇剧▼鏃堕棿
                                coursestudentcount:r.coursestudentcount,//课程 可以选择的人数
                                selectedstudentcount:r.selectedstudentcount , //选择 学生人数
                                courseuser:r.courseuser, // 选择学生人
                                coursereservation:r.coursereservation, //预约id
                                signinstudentcount:r.signinstudentcount , // 签到学生数量
                            };
                            courserlist.push(listone);
                        });
                        if(list.length>0) {
                            for (var i = 0; i < courserlist.length; i++) {
                                if (courserlist[i].coursereservation.length>0){

                                    courserlist[i].coursereservationdetial=[];
                                    for (var j = 0; j < courserlist[i].coursereservation.length; j++) {
                                        var index=getReservationdetial(courserlist[i].coursereservation[j],list);

                                        //console.log(list);
                                        if (index>-1){

                                            courserlist[i].coursereservationdetial.push(list[index]);
                                            //console.log( courserlist[i]);
                                        }

                                    }
                                }
                            }
                        }

                        return callback(null,courserlist);
                    })

                })
        }
    });

};
exports.getstudentdetialinfo=function(userid,callback){
    var proxy = new eventproxy();
    proxy.all('studentinfo', "coachcommentinfo",
        function (studentinfo, coachcommentinfo) {
            var info = {
                "studentinfo": studentinfo,
                "coachcommentinfo": coachcommentinfo,
            };
            return callback(null, info);
        });
    proxy.fail(callback);

    //// 获取学生信息
    defaultFun.getStudentInfo(userid,proxy.done('studentinfo'));
    ////获取学员评论
    defaultFun.getStuentComment(userid,proxy.done('coachcommentinfo'));
}

//获取待确认完成列表
exports.getUConfirmCourse=function(coachid,callback){
    var  searchinfo= { coachid:new mongodb.ObjectId(coachid),
        reservationstate:appTypeEmun.ReservationState.ucomments,
        is_coachcomment:false}
    reservationmodel.find(searchinfo)
        .select("userid reservationstate reservationcreatetime  subject   courseprocessdesc   begintime endtime    ")
        .populate("userid","_id  name mobile headportrait  ")
        .sort({"begintime":1})
        .exec(function(err,data){
            if(err){
                return callback("查询数据出错："+err);
            }
            process.nextTick(function(){
                var list=[]
                data.forEach(function(r,index){
                    var listone= {
                        _id: r._id,
                        userid: r.userid,
                        reservationstate: (r.is_coachcomment&&r.reservationstate==appTypeEmun.ReservationState.ucomments)?
                            appTypeEmun.ReservationState.finish: r.reservationstate,
                        reservationcreatetime: r.reservationcreatetime,
                        subject: r.subject,
                        classdatetimedesc: r.classdatetimedesc,
                        begintime: r.begintime,
                        endtime: r.endtime,

                    };
                    list.push(listone);
                })
                return callback(null,list);
            })
        })
};

//获取待预约学员列表
exports.getUreservationUserList=function(coachid,subjectid,callback){
    coachmode.findById(new mongodb.ObjectId(coachid),function(err,coachdata){
        if(err){
            return callback("查询教练出错："+err);
        }
        if (!coachdata) {
            return callback("没有查询到教练信息");
        }
        cache.get("UreservationUserList"+coachdata.driveschool+subjectid,function(err,data){
            if(err){
                return callback(err);
            }
            if (data) {
                return callback(null,data);
            }else{
                var searchinfo={}
                if(subjectid.toString()=="-1"){
                    searchinfo={
                        "$or":[{"subject.subjectid":2},
                            {"subject.subjectid":3}],
                    }
                }
                else
                {
                    searchinfo={
                        "subject.subjectid":subjectid
                    }
                }
                searchinfo.applyschool=coachdata.driveschool;
                searchinfo.applyclasstype={"$in":coachdata.serverclasslist};
                usermodel.find(searchinfo)
                    .select("_id name mobile headportrait   subject   " +
                        "subjecttwo  subjectthree   ")
                    .exec(function(err,userdatalist){
                        if(err){
                            return  callback(err);
                        }
                        var list=[];
                        userdatalist.forEach(function(r,index){
                          var returninfo={
                            userid: r._id,
                            name: r.name,
                            mobile: r.mobile,
                            headportrait: r.headportrait,
                            subject: r.subject,
                            subjecttwo:r.subjecttwo,
                            subjectthree:r.subjectthree,
                          }
                            list.push(returninfo);
                        })
                        cache.set("UreservationUserList"+coachdata.driveschool+subjectid,
                            list,60*5,function(err,data){});
                        return callback(null,list)
                    })
            }
        })

    })

};
var getsearcinfo=function(coachid,subjectid,studentstate){
    //var subjectid=req.query.subjectid;  // 预约学员的科目   1 科目一 2 科目二 3科目三 4 科目四
    //var studentstate=req.query.studentstate;  // 0 全部学员 1在学学员 2未考学员 3约考学员 4补考学员  5通过学员
    var searchinfo={};
    if(studentstate.toString()=="0"){  //全部学员
        //searchinfo={ "subject.subjectid":subjectid};
    }
    if(studentstate.toString()=="1"){  //在学学员
        searchinfo={ "subject.subjectid":subjectid}
    }
    if(studentstate.toString()=="2"){  //未考学员
        switch (subjectid.toString())
        {
            case "1":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjectone.examinationresult":0}
                break;
            case "2":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjecttwo.examinationresult":0}
                break;
            case "3":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjectthree.examinationresult":0}
                break;
            case "4":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjectfour.examinationresult":0}
                break;
            default:
                //callback("科目状态信息出错");
                break;
        };

    }
    if(studentstate.toString()=="3"){  //约考学员
        switch (subjectid.toString())
        {
            case "1":
                searchinfo= {
                    "subject.subjectid": subjectid,
                    "$or": [{"examinationinfo.subjectthree.examinationstate": 1},
                        {"examinationinfo.subjectthree.examinationstate": 3}]
                }
                break;
            case "2":
                searchinfo= {
                    "subject.subjectid": subjectid,
                    "$or": [{"examinationinfo.subjectthree.examinationstate": 1},
                        {"examinationinfo.subjectthree.examinationstate": 3}]
                }
                break;
            case "3":
                searchinfo={ "subject.subjectid":subjectid,
                    "$or":[ {"examinationinfo.subjectthree.examinationstate":1},
                        {"examinationinfo.subjectthree.examinationstate":3}]
                }

                break;
            case "4":
                searchinfo= {
                    "subject.subjectid": subjectid,
                    "$or": [{"examinationinfo.subjectthree.examinationstate": 1},
                        {"examinationinfo.subjectthree.examinationstate": 3}]
                }
                break;
            default:
               // callback("科目状态信息出错");
                break;
        };

    }
    if(studentstate.toString()=="4"){  //补考学员
        switch (subjectid.toString())
        {
            case "1":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjectone.examinationresult":1}
                break;
            case "2":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjecttwo.examinationresult":1}
                break;
            case "3":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjectthree.examinationresult":1}
                break;
            case "4":
                searchinfo={ "subject.subjectid":subjectid,
                    "examinationinfo.subjectfour.examinationresult":1}
                break;
            default:
                //callback("科目状态信息出错");
                break;
        };

    }
    else if(studentstate.toString()=="5") {  // 通过学员
        searchinfo={ "subject.subjectid":{"$gt":subjectid}};
    }
    switch (subjectid.toString())
    {
        case "1":
            searchinfo.subjectonecoach={$in: [coachid]};
            break;
        case "2":
            searchinfo.subjecttwocoach={$in: [coachid]};
            break;
        case "3":
            searchinfo.subjectthreecoach={$in: [coachid]};
            break;
        case "4":
            searchinfo.subjectfourcoach={$in: [coachid]};
            break;
        default:
           // callback("科目状态信息出错");
            break;
    };

    return  searchinfo;
}
// 获取我的学员列表
exports.getMyStudentList=function(coachid,subjectid,studentstate,index,count,callback){
    //var subjectid=req.query.subjectid;  // 预约学员的科目   1 科目一 2 科目二 3科目三 4 科目四
    //var studentstate=req.query.studentstate;  // 0 全部学员 1在学学员 2未考学员 3约考学员 4补考学员  5通过学员
    var searchinfo=getsearcinfo(coachid,subjectid,studentstate);

    usermodel.find(searchinfo)
        .select("_id name mobile headportrait  applyclasstypeinfo subject subjectone  " +
            "subjecttwo  subjectthree subjectfour examinationinfo")
        .skip((index-1)*10)
        .limit(count)
        .exec(function(err,userdata){
            if(err){
                return callback("查询学员出错:"+err);
            }
            var userlist=[];
            userdata.forEach(function(r,index){
                var oneuser={
                    userid: r._id,
                    _id:r._id,
                    name: r.name,
                    mobile: r.mobile,
                    headportrait: r.headportrait,
                    applyclasstypeinfo: r.applyclasstypeinfo,
                    subject: r.subject,
                }
                switch (subjectid.toString())
                {
                    case "1":
                        oneuser.courseinfo= r.subjectone;
                        oneuser.examinationdate=r.examinationinfo.subjectone.examinationdate||new Date();
                        oneuser.applydate=r.examinationinfo.subjectone.applydate||new Date();
                        oneuser.applyenddate=r.examinationinfo.subjectone.applyenddate||new Date();
                        oneuser.testcount=r.examinationinfo.subjectone.testcount||0;

                        break;
                    case "2":
                        oneuser.courseinfo=r.subjecttwo;
                        oneuser.examinationdate=r.examinationinfo.subjecttwo.examinationdate||new Date();
                        oneuser.applydate=r.examinationinfo.subjectone.applydate||new Date();
                        oneuser.applyenddate=r.examinationinfo.subjectone.applyenddate||new Date();
                        oneuser.testcount=r.examinationinfo.subjecttwo.testcount||0;
                        break;
                    case "3":
                        oneuser.courseinfo=r.subjectthree;
                        oneuser.examinationdate=r.examinationinfo.subjectthree.examinationdate||new Date();
                        oneuser.applydate=r.examinationinfo.subjectone.applydate||new Date();
                        oneuser.applyenddate=r.examinationinfo.subjectone.applyenddate||new Date();
                        oneuser.testcount=r.examinationinfo.subjectthree.testcount||0;
                        break;
                    case "4":
                        oneuser.courseinfo=r.subjectfour;
                        oneuser.examinationdate=r.examinationinfo.subjectfour.examinationdate||new Date();
                        oneuser.applydate=r.examinationinfo.subjectone.applydate||new Date();
                        oneuser.applyenddate=r.examinationinfo.subjectone.applyenddate||new Date();
                        oneuser.passtime=r.examinationinfo.subjectfour.passtime||0;
                        break;
                    default:

                        break;
                }
                userlist.push(oneuser);
            })
            return callback(null,userlist);
        })
};

var  getstudentcount=function(searchinfo,callback){
    usermodel.count(searchinfo, function (err, count) {
        if (err) {
            return callback(err);
        }
        return callback(null, count);
    })
}
exports.getMyStudentCount=function(coachid,subjectid,callback){
    //var subjectid=req.query.subjectid;  // 预约学员的科目   1 科目一 2 科目二 3科目三 4 科目四
    //var studentstate=req.query.studentstate;  // 0 全部学员 1在学学员 2未考学员 3约考学员 4补考学员  5通过学员
    var searchinfo=[];
    for (var i=0;i<=5;i++){
        searchinfo.push(getsearcinfo(coachid,subjectid,i));
    }
    var proxy = new eventproxy();
    proxy.all('studentcount', "onstudystudentcount","noexamstudentcount",
        "reservationstudentcount","nopassstudentcount","passstudentcount",
        function (studentcount, onstudystudentcount,noexamstudentcount,
                  reservationstudentcount,nopassstudentcount,passstudentcount) {
            var info = {
                "studentcount": studentcount,
                "onstudystudentcount": onstudystudentcount,
                "noexamstudentcount": noexamstudentcount,
                "reservationstudentcount": reservationstudentcount,
                "nopassstudentcount": nopassstudentcount,
                "passstudentcount": passstudentcount,
            };
            return callback(null, info);
        });
    proxy.fail(callback);

    //// 获取学生信息
    getstudentcount(searchinfo[0],proxy.done('studentcount'));
    getstudentcount(searchinfo[1],proxy.done('onstudystudentcount'));
    getstudentcount(searchinfo[2],proxy.done('noexamstudentcount'));
    getstudentcount(searchinfo[3],proxy.done('reservationstudentcount'));
    getstudentcount(searchinfo[4],proxy.done('nopassstudentcount'));
    getstudentcount(searchinfo[5],proxy.done('passstudentcount'));


}

var getavgcomment=function(coachid,callback){
    reservationmodel.aggregate([{$match:{
            "coachid":new mongodb.ObjectId(coachid),
            "is_comment":true
            ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}
                , {reservationstate: { $ne : appTypeEmun.ReservationState.systemcancel }}]
        }},
            {$group:{_id:"$coachid",commentcount : {$sum : 1},
                "starlevel":{"$avg":"$comment.starlevel"},  "attitudelevel":{"$avg":"$comment.attitudelevel"},
                "timelevel":{"$avg":"$comment.timelevel"}, "abilitylevel":{"$avg":"$comment.abilitylevel"}}}],
        function(err,commentdata) {
            if(err){
                return callback(err);
            };
            return callback(null,commentdata);
        });
}
var  getcommentcount=function(coachid,callback){
    reservationmodel.aggregate([{$match:{
            "coachid":new mongodb.ObjectId(coachid),
            "is_comment":true
            ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}
                , {reservationstate: { $ne : appTypeEmun.ReservationState.systemcancel }}]
        }},
            {$group:{_id:"$comment.starlevel",studentcount : {$sum : 1}}}],
        function(err,commentdata) {
            if (err) {
                return callback(err);
            }
            ;
            var commentcountdayly = {
                goodcommnent: 0,
                generalcomment: 0,
                badcomment: 0
            }
            if (commentdata && commentdata.length > 0) {
                commentdata.forEach(function (r, index) {
                    if (r._id == 0 || r._id == 1) {
                        commentcountdayly.badcomment = commentcountdayly.badcomment + r.studentcount;
                    } else if (r._id == 2 || r._id == 3) {
                        commentcountdayly.generalcomment = commentcountdayly.generalcomment + r.studentcount;
                    } else {
                        commentcountdayly.goodcommnent = commentcountdayly.goodcommnent + r.studentcount;
                    }
                })
            }
            return callback(null, commentcountdayly);
        });
}
// 获取教练评论统计
exports.getCoachSummary=function(coachid,callback){
    cache.get('CoachCommentSummary:'+coachid, function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback(null,data);
        }
        else {
            var proxy = new eventproxy();
            proxy.all('getavgcomment', "getcommentcount",
                function (getavgcomment, getcommentcount) {
                    if(getavgcomment.length==0){
                        return callback("统计出错，没有查询到数据")
                    }
                    var info=getavgcomment[0];
                    info.goodcommnent=getcommentcount.goodcommnent;
                    info.generalcomment=getcommentcount.generalcomment;
                    info.badcomment=getcommentcount.badcomment;
                    cache.set('CoachCommentSummary:'+coachid, info,60*10,function(){});
                    return callback(null, info);
                });
            proxy.fail(callback);

            //// 获取评论平均
            getavgcomment(coachid,proxy.done('getavgcomment'));
            ////获取评论数量
            getcommentcount(coachid,proxy.done('getcommentcount'));

        }
    })
};

var execExamSummaryInfo=function(coachid,index ,count,callback) {
    console.log(count);
    UserExamInfo.aggregate([{
            $match: {
                coachlist: {$in: [coachid]},
                "examinationstate": {"$gt": 2}
            }
        },
            {
                "$project": {
                    "examinationstate": "$examinationstate",
                    "subjectid": "$subjectid",
                    "uninid": {
                        "$concat": [{"$substr": [{$year: "$examinationdate"}, 0, 4]},
                            '-',
                            {"$substr": [{$month: "$examinationdate"}, 0, 2]},
                            '-',
                            {"$substr": [{$dayOfMonth: "$examinationdate"}, 0, 2]},
                            {"$substr": ["$subjectid", 0, 1]}]
                    }
                }
            },
            {
                $group: {
                    _id: "$uninid", studentcount: {$sum: 1},
                    examinationstate: {"$push": "$examinationstate"}
                }
            }
            , {
                "$sort": {"_id": -1}
            },
            {
                "$limit": parseInt(count)
            },
            {
                "$skip": (index-1)*count
            }
        ],
        function (err, examinfodata) {
            if (err) {
               return  callback("查询出错:"+err);
            }
            else {
                examinfo=[];
                examinfodata.forEach(function(r,index){
                    var oneexaminfo={
                        examdate: r._id.substr(0,(r._id.length-1)),
                        subject:r._id.substr(r._id.length-1),
                        studentcount: r.studentcount,
                        passstudent:0,
                        nopassstudent:0,
                        missexamstudent:0,
                    }
                    var passstudent=0;
                    var nopassstudent=0;
                    var missexamstudent=0;
                    for(var i=0;i< r.examinationstate.length;i++){
                        if(r.examinationstate[i]==5){
                            passstudent=passstudent+1;
                        }
                        else if(r.examinationstate[i]==4)
                        {
                            nopassstudent=nopassstudent+1;
                        }
                        else {
                            missexamstudent=missexamstudent+1;
                        }
                    }
                    oneexaminfo.passstudent=passstudent;
                    oneexaminfo.nopassstudent=nopassstudent;
                    oneexaminfo.missexamstudent=missexamstudent;
                    if (oneexaminfo.passstudent==0||oneexaminfo.studentcount==0){
                        oneexaminfo.passrate=0;
                    }
                    else{
                        oneexaminfo.passrate=oneexaminfo.passstudent/oneexaminfo.studentcount;
                    }
                    examinfo.push(oneexaminfo);
                })
                return callback(null,examinfo);
            }

        }
    )
}

//execExamSummaryInfo("5666365ef14c20d07ffa6ae8",1,10,function(err,data){
//    console.log(data);
//});


// 统计教练学员的考试信息
exports.getExamSummaryInfo=function(coachid,index ,count,callback){
    execExamSummaryInfo(coachid,index,count,callback);
}

exports.getExamStudentList=function(coachid,subjectid,examdate,examstate,callback){
    //getExamStudentList  0 全部学员 1 通过学员 2 未通过学员 3 漏靠学员
    date=new Date(examdate).toFormat("YYYY-MM-DD").toString();
    var datenow =new Date(date);
    var datetomorrow = datenow.addDays(1);
    var  searchinfo={
        coachlist: {$in: [coachid]},
        "examinationstate": {"$gt": 2},
        "subjectid":subjectid,
        examinationdate: { $gte: (new Date(date)).clearTime(), $lte:datetomorrow.clearTime()}
    }
    switch (examstate){
        case "1":
            searchinfo.examinationstate=5;
            break;
        case "2":
            searchinfo.examinationstate=4;
            break;
        case "3":
            searchinfo.examinationstate=3;
            break;
        default:
            break;
    }
    UserExamInfo.find(searchinfo)
        .select("userid score examinationdate examinationstate")
        .populate("userid","_id  name headportrait mobile ")
        .exec(function(err,data){
            return callback(err,data);
    })
}
//coachMobileVerification
exports.coachMobileVerification=function(mobile,callback){
    coachmode.findOne({"mobile":mobile},function(err,coachdata){
        if(err){
            return callback("查找教练失败："+err);
        }
        if(!coachdata){
            return callback("您的手机号不属于联盟驾校，暂时无法通过验证");
        }
        if (coachdata.is_validation==false){
            return callback("您的账号没有通过验证，暂时无法登录");
        }
        if (coachdata.driveschool===undefined||coachdata.driveschool.length<5){
            return callback("您的手机号不属于联盟驾校，暂时无法通过验证");
        }
        user_serverv1.getCodebyMolile(mobile,function(err){
            return callback(err);
        })

    })
}

// 用户通过验证码登录
exports.studentLoginByCode=function(userinfo,callback){
    checkSmsCode(userinfo.mobile,userinfo.smscode,function(err) {
        if (err) {
            return callback(err);
        }
        coachmode.findOne({mobile: userinfo.mobile})
            .populate("tagslist"," _id  tagname tagtype color")
            .exec(function (err, userinstace) {
                if (err)
                {
                    return callback ("查找用户出错:"+ err);
                } else
                {
                    if(!userinstace){
                        return callback("用户不存在");
                    }else {
                     {
                            var token = jwt.sign({
                                userId: userinstace._id,
                                timestamp: new Date(),
                                aud: secretParam.audience
                            }, secretParam.secret);
                            userinstace.token = token;
                            userinstace.logintime = Date.now();
                         console.log(userinstace)
                            userinstace.save(function (err, newinstace) {
                                if (err) {
                                    return callback("save  user login  err:" + err);
                                }
                                var returnmodel=new resbasecoachinfomode(newinstace);
                                returnmodel.token=token;
                                returnmodel.password=newinstace.password;
                                //returnmodel.mobile=mobileObfuscator(userinfo.mobile);
                                returnmodel.usersetting=newinstace.usersetting;
                                returnmodel.idcardnumber=newinstace.idcardnumber;
                                returnmodel.coachid =newinstace._id;
                                returnmodel.tagslist=userinstace.tagslist;

                                regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                                    coachmode.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                        { $set: { is_registermobim:1 }},{safe: false},function(err,doc){
                                            userfcode.findOne({"userid":newinstace._id})
                                                .select("userid fcode money")
                                                .exec(function(err, fcodedata){
                                                    returnmodel.fcode=fcodedata&&fcodedata.fcode?fcodedata.fcode:"";
                                                    return callback(null,returnmodel);
                                                })

                                        });
                                });
                            });
                        }

                    }

                }
            });

    });
}

var  checkSmsCode=function(mobile,code,callback){
    smsVerifyCodeModel.findOne({mobile:mobile,smsCode:code, verified: false},function(err,instace){
        if(err)
        {
            return callback("查询出错: "+ err);
        }
        if (!instace)
        {
            return callback("验证码错误，请重新发送");
        }
        //console.log(instace);
        var  now=new Date();
        /*console.log(now);
         console.log(instace.createdTime);
         console.log(now-instace.createdTime);*/
        if ((now-instace.createdTime)>timeout*1000){
            return callback("您已超时请重新发送");
        }
        instace.verified=true;
        instace.save(function(err,temp){
            if (err)
            {
                return callback("服务器内部错误:"+err);
            }
            return callback(null);
        })

    });
}
