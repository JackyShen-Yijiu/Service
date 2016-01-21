/**
 * Created by li on 2015/10/23.
 */
// 系统定时刷新预约状态
// 将已确定 和课程时间结束的修改成 待确认完成

var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
var mongodb = require('../models/mongodb.js');
var reservationmodel=mongodb.ReservationModel;
var driveschoolmodel=mongodb.DriveSchoolModel;
var schooldaylysummary=mongodb.SchoolDaySummaryModel;
var coachmodel=mongodb.CoachModel;
var usermodel=mongodb.UserModel;
var appTypeEmun=require("../custommodel/emunapptype");
var statistics=require("../Server/headmaster_operation_server").statisticsTodayinfo;
require('date-utils');
var async = require('async');
var times = [];


for(var i=1; i<60; i=i+1){
  //  console.log(i);
    times.push(i);

}

rule.minute = times;

try{
var j = schedule.scheduleJob(rule, function(){
   // console.log((new Date()).addMinutes(-30));
    // 订单完成 已签到 -----
    //console.log(new Date().toString()+": 开始更新订单状态状态");
    reservationmodel.update({reservationstate:appTypeEmun.ReservationState.signin,is_signin:true,endtime:{ "$lt": new Date()}} ,
        { $set: { reservationstate:appTypeEmun.ReservationState.ucomments }},{safe: false, multi: true},function(err,doc){
            console.log(new Date().toString()+": 更新已签到状态结果：");
            if(err){
                console.log(err)
            }
            console.log(doc)
        });
    // 订单 完成  未签到
    console.log(new Date().toString()+": 更新未签到状态结果：");
    var boolasync =true;
    async.whilst(
        function() { return boolasync },
        function(cb) {
            reservationmodel.findOneAndUpdate({reservationstate:appTypeEmun.ReservationState.applyconfirm,
                    "$or":[ {is_signin:false},{is_signin:null}],endtime:{ "$lt": new Date()}} ,
                { $set: { reservationstate:appTypeEmun.ReservationState.nosignin }},{new:true}
                ,function(err,doc){
                    if(err){
                        cb(err);
                    }
                    if(!doc){
                        boolasync=false;
                        cb("没有查到未签到数据");
                    }
                    //console.log(doc.userid);
                    if(doc){
                    usermodel.findById(new mongodb.ObjectId(doc.userid),function(err,data){
                        if (doc.subject.subjectid==2){
                            data.subjecttwo.reservation=parseInt(data.subjecttwo.reservation)-parseInt(doc.coursehour);
                            data.subjecttwo.finishcourse=parseInt(data.subjecttwo.finishcourse)+parseInt(doc.coursehour);
                            data.subjecttwo.progress=doc.courseprocessdesc;
                            data.subjecttwo.reservationid=doc._id;
                            data.subjecttwo.missingcourse=parseInt(data.subjecttwo.missingcourse?data.subjecttwo.missingcourse:0
                                )+parseInt(doc.coursehour);
                        }
                        if (doc.subject.subjectid==3){
                            data.subjectthree.reservation=parseInt(data.subjectthree.reservation)-parseInt(doc.coursehour);
                            data.subjectthree.finishcourse=parseInt(data.subjectthree.finishcourse)+parseInt(doc.coursehour);
                            data.subjectthree.progress=doc.courseprocessdesc;
                            data.subjectthree.reservationid=doc._id;
                            data.subjecttwo.missingcourse= parseInt(data.subjectthree.missingcourse?data.subjectthree.missingcourse:0
                                )+parseInt(doc.coursehour);
                        }
                        //console.log(data);
                        data.save(function(err){
                            if (err){
                               cb("修改未签到数据出错："+err);
                            }
                            cb();
                        })
                    })
                    }
                });
        },
        function(err) {
            // 3s have passed
            console.log('未签到数据修改出错: ', err);
        }
    );
    //reservationmodel.update({reservationstate:appTypeEmun.ReservationState.applyconfirm,is_signin:false,endtime:{ "$lt": new Date()}} ,
    //    { $set: { reservationstate:appTypeEmun.ReservationState.nosignin }},{safe: false, multi: true},function(err,doc){
    //        console.log(new Date().toString()+": 更新待评价状态结果：");
    //        if(err){
    //            console.log(err)
    //        }
    //        console.log(doc)
    //    });
// 自动修改  订单确认
    reservationmodel.update({reservationstate:appTypeEmun.ReservationState.applying,reservationcreatetime:{ "$gt": new Date().addMinutes(-100)}} ,
        { $set: { reservationstate:appTypeEmun.ReservationState.applyconfirm }},{safe: false, multi: true},function(err,doc){
            console.log(new Date().toString()+": 更新订单确认状态结果：");
            if(err){
                console.log(err)
            }
            console.log(doc)
        })
    console.log(new Date().toString()+": 更新预约状态,完成");
    console.log("-----------------------------------------------------------------------------------------------------------------");
});
} catch(e){
       console.log(new Date().toString()+'更新预约状态error..'+ e.message);
     }


//===============================================================================================================================
   //统计驾校 下面每个教练每天的工作时长
var getCoachCourse=function (schoolid,beginDate,endDate,callback){
    reservationmodel.aggregate([{$match:{
        "driveschool":new mongodb.ObjectId(schoolid),
        "begintime": { $gte: beginDate, $lt:endDate}
        ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
            {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
    }}
        ,{$group:{_id:"$coachid",coursecount : {$sum : "$coursehour"}}}
    ],function(err,coursereservationdata){
        if(err){
            return callback(err);
        }
        coachmodel.find({"driveschool":new mongodb.ObjectId(schoolid),
        "is_validation":true})
            .select("_id")
            .exec(function(err,coachdata){
                if(err){
                    return callback(err);
                }
                process.nextTick(function(){
                    var coachidlist=[];
                    var coursereservationlist=[];
                    for(i=0;i<coachdata.length;i++){
                        coachidlist.push(coachdata[i]._id);
                    }
                    //console.log(schoolid);
                    //console.log(coachidlist);
                    //console.log(coachdata);
                    if (coursereservationdata&&coursereservationdata.length>0){
                            coursereservationdata.forEach(function(r,indx){
                                var listone={
                                    coachid: r._id,
                                    coursecount: r.coursecount
                                };
                                coursereservationlist.push(listone);
                                var idx = coachidlist.indexOf(r._id);
                                if (idx != -1) {
                                    coachidlist.splice(idx, 1);
                                }
                        })
                    }
                    for(i=0;i<coachidlist.length;i++){
                        var listone={
                            coachid: coachidlist[i],
                            coursecount:0
                        };
                        coursereservationlist.push(listone);
                    }
                    return callback(null,coursereservationlist);
                })



        });

    });
}

//-----------------------------------------------------------------------
// 每天统计驾校信息
var rule2 = new schedule.RecurrenceRule();

rule2.dayOfWeek = [0, new schedule.Range(1, 6)];

rule2.hour = [0, new schedule.Range(1, 23)];

rule2.minute = 30;
try{
    var j = schedule.scheduleJob(rule2, function()
   // var test=function(  i)
     {
         var datanow = new Date();
         var begintime=(new Date()).clearTime();
         var endtime = (new Date()).addDays(1).clearTime();
         //var datanow = new Date().addDays(-1*i);
         //var begintime=(new Date()).addDays(-1*i).clearTime();
         //var endtime = (new Date()).addDays(-1*i+1).clearTime();
        console.log(new Date().toString()+"开始统计驾校信息");

        driveschoolmodel.find()
            .select("_id")
            .exec(function(err,data) {
                if (err) {
                    console.error(new Date().toString() + "开始统计驾校信息,查询驾校新出错" + err);
                }
                process.nextTick(function () {
                    data.forEach(function (r, index) {
                        schooldaylysummary.remove({
                            "driveschool": new mongodb.ObjectId(r._id),
                            summarytime: {$gte: begintime, $lt: endtime}
                        }, function (err, data) {
                            statistics(r._id, begintime, endtime, function (err, data) {
                                if (err) {
                                    console.error(new Date().toString() + "统计驾校信息出错：" + err + r._id);
                                }
                                var tempsummary = schooldaylysummary();
                                tempsummary.driveschool = r._id;
                                tempsummary.applystudentcount = data.applystudentcount;
                                tempsummary.applyingstudentcount = 0;
                                tempsummary.goodcommentcount = data.commentstudentcount.goodcommnent;
                                tempsummary.generalcomment = data.commentstudentcount.generalcomment;
                                tempsummary.badcommentcount = data.commentstudentcount.badcomment;
                                tempsummary.complaintcount = data.complaintstudentcount;
                                tempsummary.totalcoursecount = data.coachstotalcoursecount;
                                tempsummary.reservationcoursecount = data.reservationcoursecountday;
                                tempsummary.summarytime = datanow;
                                getCoachCourse(r._id,begintime, endtime,function(err,data){
                                    if(err){
                                        console.error(new Date().toString() + "统计教练约车信息：" + err + r._id);
                                    }
                                    else {
                                        tempsummary.coachcoursecount=data;
                                        tempsummary.save(function (err, tempdata) {
                                        });
                                    }
                                })

                            })
                        })
                    })
                    console.log(new Date().toString() + "统计驾校信息完成");
                })
            })
    }

    );
    //for(i=1;i<30;i++) {
    //    test(i);
    //}
}catch(e){
    console.error(new Date().toString()+'更新驾校统计信息出错..'+ e.message);
}