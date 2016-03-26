/**
 * Created by v-yaf_000 on 2016/3/25.
 */
var mongodb = require('../models/mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var appTypeEmun=require("../custommodel/emunapptype");
var cache=require("../Common/cache");
var eventproxy   = require('eventproxy');
require('date-utils');
var _ = require("underscore");

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
                            examinationresult: r.examinationinfo.subjectone.examinationresult,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjectone.examinationresultdesc,  //  考试结果描述

                        },
                        subjecttwo:{
                            examinationresult: r.examinationinfo.subjecttwo.examinationresult,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjecttwo.examinationresultdesc,  //  考试结果描述

                        },
                        subjectthree:{
                            examinationresult: r.examinationinfo.subjectone.examinationresult,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjectone.examinationresultdesc,  //  考试结果描述

                        },
                        subjectfour:{
                            examinationresult: r.examinationinfo.subjectone.examinationresult,  //  l考试结果状态 0 未考核 1 未通过 2 通过
                            examinationresultdesc:r.examinationinfo.subjectone.examinationresultdesc,  //  考试结果描述

                        }
                    },
                }
                return callback(null,returninfo)
            })
    },
    // 获取学员获取到的评论
    getStuentComment:function(userid,callback){
        reservationmodel.find({"userid":new mongodb.ObjectId(userid),"is_coachcomment":"true"})
            .select("coachid coachcomment finishtime")
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
    coursemode.findCourse(coachid,date,function(err,coursedata) {
        if (err) {
            return callback("查询课程信息出错：" + err);
        }

        if (!coursedata || coursedata.length == 0) {
            return callback(null,[]);
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
                                            console.log( courserlist[i]);
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
                searchinfo.applyschool=coachdata.driveschool
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
// 获取我的学员列表
exports.getMyStudentList=function(coachid,subjectid,studentstate,callback){
    //var subjectid=req.query.subjectid;  // 预约学员的科目   1 科目一 2 科目二 3科目三 4 科目四
    //var studentstate=req.query.studentstate;  // 0在学学员 1 未考学员 2约考学员 4补考学员  5通过学员
    var searchinfo={};
    if(studentstate.toString()=="0"){
        searchinfo={ "subject.subjectid":subjectid}
    }
}
