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
var appTypeEmun=require("../custommodel/emunapptype");
var statistics=require("../Server/headmaster_operation_server").statisticsTodayinfo;
require('date-utils');
var times = [];


for(var i=1; i<60; i=i+1){
  //  console.log(i);
    times.push(i);

}

rule.minute = times;

try{
var j = schedule.scheduleJob(rule, function(){
   // console.log((new Date()).addMinutes(-30));
    console.log(new Date().toString()+": 开始更新预约状态");
    reservationmodel.update({reservationstate:appTypeEmun.ReservationState.applyconfirm,endtime:{ "$lt": new Date()}} ,
        { $set: { reservationstate:appTypeEmun.ReservationState.unconfirmfinish }},{safe: false, multi: true},function(err,doc){
            console.log(new Date().toString()+": 更新待评价状态结果：");
            if(err){
                console.log(err)
            }
            console.log(doc)
        });
// 自动修改

    reservationmodel.update({reservationstate:appTypeEmun.ReservationState.applying,reservationcreatetime:{ "$gt": new Date().addMinutes(-100)}} ,
        { $set: { reservationstate:appTypeEmun.ReservationState.applyconfirm }},{safe: false, multi: true},function(err,doc){
            console.log(new Date().toString()+": 订单确认状态结果：");
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
     {
        var datanow = new Date();
         var begintime=(new Date()).clearTime();
         var endtime = (new Date()).addDays(1).clearTime();
         //var datanow = new Date().addDays(-19);
         //var begintime=(new Date()).addDays(-19).clearTime();
         //var endtime = (new Date()).addDays(-18).clearTime();
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


}catch(e){
    console.error(new Date().toString()+'更新驾校统计信息出错..'+ e.message);
}