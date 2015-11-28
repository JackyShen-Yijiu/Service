/**
 * Created by li on 2015/11/27.
 */
// 校长统计信息接口

var mongodb = require('../models/mongodb.js');
var cache=require("../Common/cache");
var eventproxy   = require('eventproxy');
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var coursemode=mongodb.CourseModel;
var appTypeEmun=require("../custommodel/emunapptype");
require('date-utils');


// 获取今天或者昨天的更多统计数据
var getMoreDatalatest=function(schoolid,beginDate,endDate,callback){
    // 按时间段获取今日申请人数
    usermodel.aggregate([{$match:{"applyschool":new mongodb.ObjectId(schoolid)
            ,"applyinfo.applytime": { $gte: beginDate, $lte:endDate}
        }},
            {"$project":{
                "hours":{"$add":[{"$hour":"$applyinfo.applytime"},8]},
                "applyinfo.applytime":1
            }}
            ,{$group:{_id:"$hours",studentcount : {$sum : 1}}}
        ],
       function(err,data){
           console.log(data);
       }
    )
    //按时段统计约课人数
    coursemode.aggregate([{$match:{
            "driveschool":new mongodb.ObjectId(schoolid),
            "coursebegintime": { $gte: beginDate, $lt:endDate}
            ,"selectedstudentcount":{$gte:1}
        }},
            {"$project":{
                "hours":{"$add":[{"$hour":"$coursebegintime"},8]},
                coursebegintime:1,
                selectedstudentcount:1
            }}
            ,{$group:{_id:"$hours",studentcount : {$sum : "$selectedstudentcount"}}}
        ],
        function(err,data){
            console.log(data);
        }
    )
    //  统计教练 授课
    reservationmodel.aggregate([{$match:{
           // "driveschool":new mongodb.ObjectId(schoolid),
            "begintime": { $gte: beginDate, $lt:endDate}
            ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
            {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
        }}
            ,{$group:{_id:"$coachid",coursecount : {$sum : "$coursehour"}}}
            ,{$group:{_id:"$coursecount",coursecount : {$sum : 1}}}
        ],
        function(err,data){
            console.log(data);
        }
    );
    // 统计好评评论
    reservationmodel.aggregate([{$match:{
            // "driveschool":new mongodb.ObjectId(schoolid),
            "is_comment":true,
            "comment.commenttime": { $gte: beginDate, $lt:endDate}
            ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
        }}
            ,{$group:{_id:"$comment.starlevel",commentcount : {$sum : 1}}}
        ],
        function(err,data){
            console.log(data);
        }
    );
    // 获取 投诉
    reservationmodel.aggregate([{$match:{
            // "driveschool":new mongodb.ObjectId(schoolid),
            "is_complaint":true,
            "complaint.complainttime": { $gte: beginDate, $lt:endDate}
            ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
        }},
            {"$project":{
                "hours":{"$add":[{"$hour":"$complaint.complainttime"},8]}
            }}
            ,{$group:{_id:"$hours",complaintcount : {$sum : 1}}}
        ],
        function(err,data){
            console.log(data);
        }
    );

};



var  getTodayStatistics=function(schoolid,callback){
    var proxy = new eventproxy();
    proxy.fail(callback);

    // 获取在校学生 科目一*四
    cache.get('studentcount:'+schoolid, proxy.done(function (studentcount) {
        if (studentcount) {
            console.log(studentcount);
            proxy.emit('studentcount', studentcount);
        } else {
            usermodel.aggregate([{$match:{"applyschool":new mongodb.ObjectId(schoolid)}},
                {$group:{_id:"$subject.subjectid",studentcount : {$sum : 1}}}],
                proxy.done('studentcount', function (studentcount) {
                cache.set('studentcount:'+schoolid, studentcount,60*10,function(){});
                   return  studentcount;
                })
            )

        }
    }));
    //获取今日申请人数
    cache.get('applystudentcount:'+schoolid, proxy.done(function (applystudentcount) {
        if (applystudentcount) {
            console.log(applystudentcount);
            proxy.emit('applystudentcount', applystudentcount);
        } else {
            var datenow =new Date();
            var datetomorrow = datenow.addDays(1);
            usermodel.aggregate([{$match:{"applyschool":new mongodb.ObjectId(schoolid)
                    ,"applyinfo.applytime": { $gte: (new Date()).clearTime(), $lte:datetomorrow.clearTime()}
                }},
                    {$group:{_id:"null",studentcount : {$sum : 1}}}],
                proxy.done( function (applystudentcount) {
                    cache.set('applystudentcount:'+schoolid, applystudentcount,60*1,function(){});
                   // console.log(applystudentcount);
                    proxy.emit('applystudentcount', applystudentcount);
                })
            )

        }
    }));
    // 获取 评价数量
    cache.get('commentcount:'+schoolid, proxy.done(function (commentcount) {
        if (commentcount) {
            proxy.emit('commentcount', commentcount);
        } else {
            var datenow =new Date();
            var datetomorrow = datenow.addDays(1);
            reservationmodel.aggregate([{$match:{"driveschool":new mongodb.ObjectId(schoolid),
                    "is_comment":true,
                    "comment.commenttime": { $gte: (new Date()).clearTime(), $lte:datetomorrow.clearTime()}
                ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                    {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }},
                    {$group:{_id:"comment.starlevel",studentcount : {$sum : 1}}}],
                proxy.done( function (commentcount) {
                    cache.set('commentcount:'+schoolid, commentcount,60*10,function(){});
                    proxy.emit('commentcount', commentcount);
                })
            )
        }
    })
    )
    // 投诉数量
      cache.get('complaintcount:'+schoolid, proxy.done(function (complaintcount) {
            if (complaintcount) {
                proxy.emit('complaintcount', complaintcount);
            } else {
                var datenow =new Date();
                var datetomorrow = datenow.addDays(1);
                reservationmodel.aggregate([{$match:{"driveschool":new mongodb.ObjectId(schoolid),
                        "is_complaint":true,
                        "complaint.complainttime": { $gte: (new Date()).clearTime(), $lte:datetomorrow.clearTime()}
                    }},
                        {$group:{_id:"comment.starlevel",studentcount : {$sum : 1}}}],
                    proxy.done( function (complaintcount) {
                        cache.set('complaintcount:'+schoolid, complaintcount,60*10,function(){});
                        proxy.emit('complaintcount', complaintcount);
                    })
                )
            }
        })
    )
    // 今天教练课时总数
    // 今天的预约总数
    // 到目前为止上课总数
    // 这个时段的课时总数
    // 这个时段的上课总数

    proxy.all('studentcount','applystudentcount','commentcount','complaintcount',
        function(studentcount,applystudentcount,commentcount,complaintcount) {
            console.log("在校数量");
            console.log(studentcount);
            console.log("申请数量");
            console.log(applystudentcount);
            console.log("评论数量");
            console.log(commentcount);
            console.log("投诉数量");
            console.log(complaintcount);
            return callback (null);
        });

}

//getTodayStatistics("562dcc3ccb90f25c3bde40da" ,function(err,data){
//    console.log("test2");
//});
var datenow =new Date("2015-11-18");
var datetomorrow = datenow.addDays(1).clearTime();
var begintime=(new Date("2015-11-18")).clearTime();
getMoreDatalatest("562dcc3ccb90f25c3bde40da",begintime,datetomorrow,function(err,data){} )