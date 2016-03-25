/**
 * Created by v-yaf_000 on 2016/3/25.
 */
var mongodb = require('../models/mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var appTypeEmun=require("../custommodel/emunapptype");
var eventproxy   = require('eventproxy');
require('date-utils');
var _ = require("underscore");

var  defaultFun={
    getStudentInfo:function(userid,callback){
        usermodel.findById(new mongodb.ObjectId(userid))
            .select("_id name mobile headportrait  applyclasstypeinfo subject subjectone  " +
                "subjecttwo  subjectthree subjectfour address")
            .exec(function(err,userdata){
                if(err){
                    return  callback(err);
                }
                if(!data){
                    return  callback("没有查到学员信息");
                }

            })
    }
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
                "schoolstudentcount": studentinfo,
            };

            return callback(null, info);
        });
    proxy.fail(callback);

    //// 获取学生信息
    //getStudentInfo(userid,proxy.done('studentinfo'))
    ////获取学员评论
    //getStudentCommentInfo(userid,proxy.done('coachcommentinfo'))
}