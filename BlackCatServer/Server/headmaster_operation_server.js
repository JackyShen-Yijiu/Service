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
var coachmodel=mongodb.CoachModel;
var headmastermodel=mongodb.HeadMasterModel;
var appTypeEmun=require("../custommodel/emunapptype");
var schooldaysunmmary=mongodb.SchoolDaySummaryModel;
var userFeedBack=mongodb.FeedBackModel;
var UserExamInfo=mongodb.UserExamInfo;
var CoachFeedBack=mongodb.CoachFeedBack;
var basefun=require("./basedatafun");
var _ = require("underscore");
require('date-utils');


//更多数据 周统计  教练授课
var getCoachCourseByWeek=function(schoolid,beginDate,endDate,callback){
    cache.get("getCoachCourseByWeek"+schoolid+beginDate,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "summarytime": { $gte: beginDate, $lt:endDate}

                }}
                ,{"$unwind":"$coachcoursecount"}
                     ,{$group:{_id:"$coachcoursecount.coachid",cousrsecount : {$sum : "$coachcoursecount.coursecount"}}}
                 ,{$group:{_id:"$cousrsecount",coachcount : {$sum : 1}}}
                ],function(err,data){
                if(err){
                    return callback(err);
                }
                var  coachgrouplist=[];
                if(data &&　data.length>0){
                    data.forEach(function(r,index){
                        onelist={
                            coursecount: r._id,
                            coachcount: r.coachcount
                        }
                        coachgrouplist.push(onelist);
                    })
                };
                cache.set("getCoachCourseByWeek"+schoolid+beginDate, coachgrouplist,60*1,function(){});
                    return callback(null,coachgrouplist);
                }
            )
        }
    })
}

//var  begintime = (new Date()).addDays(-7).clearTime();
//var endtime=(new Date()).addDays(7).clearTime();
//getCoachCourseByWeek("562dcc3ccb90f25c3bde40da" ,begintime,endtime,function(err,data){
//  console.log(data);
//})
// 周统计 周统计招生人数
var getMoreApplyStudentByWeek=function(schoolid,beginDate,endDate,callback){
    cache.get("getMoreApplyStudentByWeek"+schoolid+beginDate,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                "driveschool":new mongodb.ObjectId(schoolid),
                "summarytime": { $gte: beginDate, $lt:endDate}

            }},
                {"$project":{
                    "day":{"$dayOfWeek":"$summarytime"}
                    ,"applystudentcount":"$applystudentcount"
                    ,"reservationcoursecount":"$reservationcoursecount"
                    ,"goodcommentcount":"$goodcommentcount"
                    ,"badcommentcount":"$badcommentcount"
                    ,"generalcomment":"$generalcomment"
                    ,"complaintcount":"$complaintcount"
                    ,"summarytime":"$summarytime"
                    ,"_id":0
                }}
               // ,{$group:{_id:"$week",applystudentcount : {$sum : "$selectedstudentcount"}}}
            ],function(err,schooldata){
                    if(err){
                        return callback(err);
                    };
                    schooldata.forEach(function(r,index){
                        r.day= (r.day-1)==0?7:(r.day-1);
                    })
                    schooldataList= _.sortBy(schooldata,'summarytime');
                    cache.set("getMoreApplyStudentByWeek"+schoolid+beginDate, schooldataList,60*1,function(){});
                return callback(null,schooldataList);
            }
            )
        }
    })
}
// 更多数据 月统计
var getMoreDataStudentByMonth=function(schoolid,beginDate,endDate,callback){
    cache.get("getMoreDataStudentByMonth"+schoolid+beginDate,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "summarytime": { $gte: beginDate, $lt:endDate}

                }},
                    {"$project":{
                        "week":{"$substr": [{"$divide":[{"$subtract":[{"$dayOfMonth":"$summarytime"},1]},7]},0,1]}
                        ,"applystudentcount":"$applystudentcount"
                        ,"reservationcoursecount":"$reservationcoursecount"
                        ,"goodcommentcount":"$goodcommentcount"
                        ,"badcommentcount":"$badcommentcount"
                        ,"generalcomment":"$generalcomment"
                        ,"complaintcount":"$complaintcount"
                        ,"summarytime":"$summarytime"
                        ,"_id":0
                    }}
                     ,{$group:{_id:"$week",
                    applystudentcount : {$sum : "$applystudentcount"},
                    reservationcoursecount : {$sum : "$reservationcoursecount"},
                    goodcommentcount : {$sum : "$goodcommentcount"},
                    badcommentcount : {$sum : "$badcommentcount"},
                    generalcomment : {$sum : "$generalcomment"},
                    complaintcount : {$sum : "$complaintcount"},}}
                ],function(err,schooldata){
                if(err){
                    return callback(err);
                }
                var datalist=[];
                if (schooldata&&schooldata.length>0){
                    schooldata.forEach(function(r,index){
                        var listone={
                            weekindex:parseInt(r._id)+1,
                            applystudentcount:r.applystudentcount,
                            reservationcoursecount:r.reservationcoursecount,
                            goodcommentcount:r.goodcommentcount,
                            badcommentcount:r.badcommentcount,
                            generalcomment:r.generalcomment,
                            complaintcount:r.complaintcount,
                        }
                        datalist.push(listone);
                    })
                }
                datalist= _.sortBy(datalist,'weekindex');
                cache.set("getMoreDataStudentByMonth"+schoolid+beginDate, datalist,60*1,function(){});
                    return callback(null,datalist);
                }
            )
        }
    })
}
// 更多数据 年统计
var getMoreDataStudentByYear=function(schoolid,beginDate,endDate,callback){
    cache.get("getMoreDataStudentByYear"+schoolid+beginDate,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "summarytime": { $gte: beginDate, $lt:endDate}

                }},
                    {"$project":{
                        "month":{"$month":"$summarytime"}
                        ,"applystudentcount":"$applystudentcount"
                        ,"reservationcoursecount":"$reservationcoursecount"
                        ,"goodcommentcount":"$goodcommentcount"
                        ,"badcommentcount":"$badcommentcount"
                        ,"generalcomment":"$generalcomment"
                        ,"complaintcount":"$complaintcount"
                        ,"summarytime":"$summarytime"
                        ,"_id":0
                    }}
                    ,{$group:{_id:"$month",applystudentcount : {$sum : "$applystudentcount"},
                        reservationcoursecount : {$sum : "$reservationcoursecount"},
                        goodcommentcount : {$sum : "$goodcommentcount"},
                        badcommentcount : {$sum : "$badcommentcount"},
                        generalcomment : {$sum : "$generalcomment"},
                        complaintcount : {$sum : "$complaintcount"},}}
                ],function(err,schooldata){
                if(err){
                    return callback(err);
                }
                var datalist=[];
                if (schooldata&&schooldata.length>0){
                    schooldata.forEach(function(r,index){
                        var listone={
                            month:r._id,
                            applystudentcount:r.applystudentcount,
                            reservationcoursecount:r.reservationcoursecount,
                            goodcommentcount:r.goodcommentcount,
                            badcommentcount:r.badcommentcount,
                            generalcomment:r.generalcomment,
                            complaintcount:r.complaintcount,
                        }
                        datalist.push(listone);
                    })
                }
                datalist= _.sortBy(datalist,'month');
                cache.set("getMoreDataStudentByYear"+schoolid+beginDate, datalist,60*1,function(){});
                    return callback(null,datalist);
                }
            )
        }
    })
}


// 按时段统计今天 的预约人数
var  getReservationCourseCountTimely=function(schoolid,beginDate,endDate,callback){
    cache.get('getReservationCourseCountTimely:'+schoolid+beginDate, function(err,data) {
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            coursemode.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "coursebegintime": { $gte: beginDate, $lt:endDate}
                    ,"selectedstudentcount":{$gte:1}
                }},
                    {"$project":{
                        "hours":{"$add":[{"$hour":"$coursebegintime"},8]},
                        selectedstudentcount:1
                    }}
                    ,{$group:{_id:"$hours",studentcount : {$sum : "$selectedstudentcount"}}}
                ],
                function(err,data){
                    if(err){
                        return callback(err);
                    }
                    var ReservationCourseCountList=[];
                    if(data &&　data.length>0){
                        data.forEach(function(r,index){
                            onelist={
                                hour: r._id>=24? r._id-24: r._id,
                                studentcount: r.studentcount
                            }
                            ReservationCourseCountList.push(onelist);
                        })

                    }
                    var  endint=new Date().getHours();
                    if(new Date().getDay()!=beginDate.getDate() ||(endint>21)){
                        endint=21;
                    }
                    for( i=8 ;i<endint;i++){
                        if(!getlistcontant(ReservationCourseCountList,i)){
                            ReservationCourseCountList.push({ hour: i,
                                studentcount:0})
                        }

                    }
                    ReservationCourseCountList= _.sortBy(ReservationCourseCountList,'hour');
                    cache.set('getReservationCourseCountTimely:'+schoolid+beginDate, ReservationCourseCountList,60*1,function(){});
                    return callback(null,ReservationCourseCountList);
                }
            )
        }
    });
}
// 按时段统计一天的好评数
var  getCommentTimely=function(schoolid,beginDate,endDate,commentlevel,callback){
    cache.get('getCommentTimely:'+schoolid+beginDate+commentlevel[0], function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback (null,data)
        } else {
            reservationmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "is_comment":true
                    ,"comment.starlevel":{$in:commentlevel}
                    ,"comment.commenttime": { $gte:beginDate, $lte:endDate}
                    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }},
                    {"$project":{
                        "hours":{"$add":[{"$hour":"$comment.commenttime"},8]}
                    }}
                    ,{$group:{_id:"$hours",commnetcount : {$sum : 1}}}
                ],
                function (err,data) {
                    if (err){
                        return callback(err);
                    }
                    var  commentlist=[];
                    if (data && data.length>0){
                        data.forEach(function(r,index){
                            var listone={
                                hour: r._id>=24? r._id-24: r._id,
                                commnetcount: r.commnetcount
                            }
                            commentlist.push(listone);
                        })
                    }
                    var  endint=new Date().getHours();
                    if(new Date().getDay()!=beginDate.getDate() ||(endint>21)){
                        endint=21;
                    }
                    for( i=8 ;i<endint;i++){
                        if(!getlistcontant(commentlist,i)){
                            commentlist.push({ hour: i,
                                commnetcount:0});
                        }

                    }
                    commentlist= _.sortBy(commentlist,'hour');
                    cache.set('getCommentTimely:'+schoolid+beginDate+commentlevel[0], commentlist,60*1,function(){});
                    return callback(null,commentlist);
                })

        }
    })
}
//

//统计一天教练的授课情况
var getGroupCoachCourseDay=function (schoolid,beginDate,endDate,callback){
    cache.get('getGroupCoachCourseDay:'+schoolid+beginDate, function(err,data) {
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            reservationmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "begintime": { $gte: beginDate, $lt:endDate}
                    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }}
                    ,{$group:{_id:"$coachid",coursecount : {$sum : "$coursehour"}}}
                    ,{$group:{_id:"$coursecount", coachcout: {$sum : 1}}}
                ],
                function(err,data){
                    //console.log(data);
                    if(err){
                        return callback(err);
                    }
                    var  coachgrouplist=[];
                    var  havecoursecoachcount=0;
                    if(data &&　data.length>0){
                        data.forEach(function(r,index){
                            onelist={
                                coursecount: r._id,
                                coachcount: r.coachcout
                            }
                            havecoursecoachcount=havecoursecoachcount+r.coachcout;
                            coachgrouplist.push(onelist);
                        })
                    };
                   //console.log(coachgrouplist);
                    coachmodel.aggregate([{$match:{
                            "driveschool":new mongodb.ObjectId(schoolid),
                            "is_validation": true
                        }}
                            ,{$group:{_id:"null",coachcount : {$sum : 1}}}
                        ],function(err,coachdata){
                        if (err){
                            return callback(err);
                        }
                        var nocoursecoachcount=0;
                        if(coachdata&&coachdata.length>0){
                            nocoursecoachcount=(coachdata[0].coachcount-havecoursecoachcount)>0 ?
                                (coachdata[0].coachcount-havecoursecoachcount):0;
                        }
                        if (nocoursecoachcount!=0) {
                            onelist={
                                coursecount:0,
                                coachcount:nocoursecoachcount
                            }
                            coachgrouplist.push(onelist);
                        }
                        cache.set('getGroupCoachCourseDay:'+schoolid+beginDate, coachgrouplist,60*1,function(){});
                         return callback(null,coachgrouplist);

                    })


                }
            )
        }
    });
}

//测试投诉数量
//var  endtime = (new Date("2016-04-21")).addDays(1).clearTime();
//var begintime=(new Date("2016-04-21")).clearTime();
//getGroupCoachCourseDay("56ea8f86b701b0323b14a507" ,begintime,endtime,function(err,data){
//  console.log(data)
//})
//统计某一驾校科目一二三四 在学 学生人数
var getSchoolStudentCount=function(schoolid,callback){
    cache.get('studentcount:'+schoolid, function(err,data) {
        if(err){
            console.log(err)
            return callback(err);
        }
        if (data) {
           return callback(null,data);
        } else {
            usermodel.aggregate([{$match:{"applyschool":new mongodb.ObjectId(schoolid)
                    ,"applystate":{$ne : appTypeEmun.ApplyState.NotApply}
                }},
                    {$group:{_id:"$subject.subjectid",studentcount : {$sum : 1}}}],
                function(err,studentdata){
                    if (err){
                        return callback(err);
                    }
                    var studentlist=[];
                    if(studentdata&& studentdata.length>0){
                        studentdata.forEach(function(r,index){
                            if (r._id>=1 && r._id<=4){
                            listone={
                                subjectid: r._id,
                                studentcount: r.studentcount
                            }
                            studentlist.push(listone);}
                        })
                    }
                    cache.set('studentcount:'+schoolid, studentlist,60*10,function(){});
                    return callback(null,studentlist);
                })
        }
    });
}

// 测试 获取学习总人数
//getSchoolStudentCount("562dcc3ccb90f25c3bde40da" ,function(err,data){
//    console.log(data);
//});
// 统计驾校各个时段的报名人数
var getApplyStudentCountTimely=function(schoolid,beginDate,endDate,callback){

    cache.get('ApplyStudentCountTimely:'+schoolid+beginDate, function(err,data) {
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            usermodel.aggregate([{$match:{"applyschool":new mongodb.ObjectId(schoolid)
                    ,"applystate":appTypeEmun.ApplyState.Applying
                    ,"applyinfo.applytime": { $gte: beginDate, $lte:endDate}
                }},
                    {"$project":{
                        "hours":{"$add":[{"$hour":"$applyinfo.applytime"},8]},
                        "applyinfo.applytime":1
                    }}
                    ,{$group:{_id:"$hours", applystudentcount : {$sum : 1}}}
                ],
                function(err,data){
                    if(err){
                        return callback(err);
                    }
                    var applyStudentList=[];
                    if(data &&　data.length>0){
                        data.forEach(function(r,index){
                            onelist={
                                hour: r._id>=24? r._id-24: r._id,
                                applystudentcount: r.applystudentcount
                            }
                            applyStudentList.push(onelist);
                        })

                    }
                    var  endint=new Date().getHours();
                    if(new Date().getDay()!=beginDate.getDate() ||(endint>21)){
                        endint=21;
                    }
                    for( i=8 ;i<endint;i++){
                        if(!getlistcontant(applyStudentList,i)){
                            applyStudentList.push({ hour: i,
                                applystudentcount:0})
                        }

                    }
                    applyStudentList= _.sortBy(applyStudentList,'hour');
                    cache.set('ApplyStudentCountTimely:'+schoolid+beginDate, applyStudentList,60*1,function(){});
                    return callback(null,applyStudentList);
                }
            )
        }
    });
}
var getlistcontant=function(list,i){
    for(j=0;j<list.length;j++){
        if (Number(list[j].hour)==i){
            return true;
            break;
        }
    }
    return false;
}
// 统计驾校今天总的申请人数
var getApplyStudentCountDayly=function(schoolid,beginDate,endDate,callback){

    cache.get('getApplyStudentCountDayly:'+schoolid+beginDate, function(err,data) {
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            usermodel.aggregate([{$match:{"applyschool":new mongodb.ObjectId(schoolid)
                    //,"applystate":appTypeEmun.ApplyState.Applying
                    ,"$or":[{applystate: appTypeEmun.ApplyState.Applying },
                        {applystate: appTypeEmun.ApplyState.Applyed}]
                    ,"applyinfo.applytime": { $gte: beginDate, $lte:endDate}
                }}
                    ,{$group:{_id:"", applystudentcount : {$sum : 1}}}
                ],
                function(err,data){
                    if(err){
                        return callback(err);
                    }
                    var applyStudentcount=0;
                    if(data &&　data.length>0){
                        applyStudentcount=data[0].applystudentcount;
                    }
                    cache.set('getApplyStudentCountDayly:'+schoolid+beginDate, applyStudentcount,60*1,function(){});
                    return callback(null,applyStudentcount);
                }
            )
        }
    });
}


// 测试统计各个时间段的数据
//var  endtime = (new Date("2015-11-6")).addDays(1).clearTime();
//var begintime=(new Date("2015-11-6")).clearTime();
//getApplyStudentCountTimely("562dcc3ccb90f25c3bde40da" ,begintime,endtime,function(err,data){
//  console.log(data)
//})
//  统计各个时段的投诉数量
var  getStudentComplaintTimely=function(schoolid,beginDate,endDate,callback){
    cache.get('getStudentComplaintTimely:'+schoolid+beginDate, function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback (null,data);
        } else {
            reservationmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "is_complaint":true
                    ,"complaint.complainttime": { $gte:beginDate, $lte:endDate}
                    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }},
                    {"$project":{
                        "hours":{"$add":[{"$hour":"$complaint.complainttime"},8]}
                    }}
                    ,{$group:{_id:"$hours",complaintcount : {$sum : 1}}}
                ],
                function (err,data) {
                    if (err){
                        return callback(err);
                    }
                    var  complaintlist=[];
                    if (data && data.length>0){
                        data.forEach(function(r,index){
                            var listone={
                                hour: r._id>=24? r._id-24: r._id,
                                complaintcount: r.complaintcount
                            }
                            complaintlist.push(listone);
                        })
                    };
                    var  endint=new Date().getHours();
                    if(new Date().getDay()!=beginDate.getDate() ||(endint>21)){
                        endint=21;
                    }
                    for( i=8 ;i<endint;i++){
                        if(!getlistcontant(complaintlist,i)){
                            complaintlist.push({ hour: i,
                                complaintcount:0});
                        }

                    }
                    complaintlist= _.sortBy(complaintlist,'hour');
                    cache.set('getStudentComplaintTimely:'+schoolid+beginDate, complaintlist,60*1,function(){});
                    return callback(null,complaintlist);
                })

        }
    })
}
// 获取一天的投诉数量
var  getStudentComplaintDayly=function(schoolid,beginDate,endDate,callback){
    cache.get('complaintDaylycount:'+schoolid+beginDate, function(err,data) {
            if (err) {
                return callback(err);
            }
            if(data){
                return callback (null,data)
            } else {
                reservationmodel.aggregate([{$match:{
                       "driveschool":new mongodb.ObjectId(schoolid),
                        "is_complaint":true
                        ,"complaint.complainttime": { $gte:beginDate, $lte:endDate}
                        ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                            {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                    }},
                        {$group:{_id:"null",complaintcount : {$sum : 1}}}],
                   function (err,data) {
                     if (err){
                         return callback(err);
                     }
                       var  complaintcount=0;
                        if (data && data.length>0){
                            complaintcount=data[0].complaintcount;
                        }
                        cache.set('complaintDaylycount:'+schoolid+beginDate, complaintcount,60*1,function(){});
                        return callback(null,complaintcount);
                    })

            }
        })
}

//测试投诉数量
//var  endtime = (new Date("2015-11-6")).addDays(1).clearTime();
//var begintime=(new Date("2015-11-6")).clearTime();
//getStudentComplaintTimely("562dcc3ccb90f25c3bde40da" ,begintime,endtime,function(err,data){
//  console.log(data)
//})

// 获取一天的 评论数量
var getStudentCommentDayly=function(schoolid,beginDate,endDate,callback){
    cache.get('StudentCommentDayly:'+schoolid+beginDate, function(err,data) {
        if (err) {
          return callback(err);
        }
        if(data){
            return callback(null,data);
        }
        else {
            reservationmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "is_comment":true
                    ,"comment.commenttime": { $gte: beginDate, $lte:endDate}
                    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }},
                    {$group:{_id:"$comment.starlevel",studentcount : {$sum : 1}}}],
               function(err,commentdata) {
                   if(err){
                       return callback(err);
                   };
                   var commentcountdayly={
                       goodcommnent:0,
                       generalcomment:0,
                       badcomment:0
                   }
                   if(commentdata&& commentdata.length>0){
                       commentdata.forEach(function(r,index){
                           if(r._id==0|| r._id==1){
                               commentcountdayly.badcomment=commentcountdayly.badcomment+ r.studentcount;
                           }else if(r._id==2|| r._id==3){
                               commentcountdayly.generalcomment=commentcountdayly.generalcomment+ r.studentcount;
                           }else{
                               commentcountdayly.goodcommnent=commentcountdayly.goodcommnent+ r.studentcount;
                           }
                       })
                   }
                    cache.set('StudentCommentDayly:'+schoolid+beginDate, commentcountdayly,60*1,function(){});
                    return callback(null,commentcountdayly);
                });
        }
    })
}

//测试投诉数量
//var  endtime = (new Date("2015-11-6")).addDays(1).clearTime();
//var begintime=(new Date("2015-11-6")).clearTime();
//getStudentCommentDayly("562dcc3ccb90f25c3bde40da" ,begintime,endtime,function(err,data){
//  console.log(data)
//})

//
// 获取所有教练总课时
var getCocahsTotalCourseCount=function(schoolid,beginDate,callback){
    cache.get('CocahsTotalCourseCount:'+schoolid+beginDate, function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback(null,data);
        }
        else {
            // 判断星期
            var temptime=new Date(beginDate);
            var week1=temptime.getDay();
            if(week1==0){week1=7}
            coachmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "is_validation":true,
                    "is_lock":false
                    ,"workweek":{"$in":[week1]}
                }},
                    {"$project":{
                        "coursecount":{"$multiply":["$coursestudentcount",
                            {"$subtract":["$worktimespace.endtimeint","$worktimespace.begintimeint"]}]},
                    }}
                    ,{$group:{_id:"null",coursecount : {$sum : "$coursecount"}}}],
                function(err,data) {
                    if(err){
                        return callback(err);
                    };
                    var totalCourseCountDay=0;
                    if (data && data.length>0){
                        totalCourseCountDay=data[0].coursecount;
                    }
                    cache.set('CocahsTotalCourseCount:'+schoolid+beginDate, totalCourseCountDay,60*30,function(){});
                    return callback(null,totalCourseCountDay);
                });
        }
    })
}
//var begintime=(new Date()).clearTime();
//getCocahsTotalCourseCount("562dcc3ccb90f25c3bde40da",begintime,function(err,data){
//    console.log(data)
//})
// 统计今天预约课时总数
var  getReservationCourseCountDay=function(schoolid,beginDate,endDate,callback){
    cache.get('ReservationCourseCountDay:'+schoolid+beginDate, function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback(null,data);
        }
        else {
            coursemode.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "coursebegintime": { $gte: beginDate, $lt:endDate}
                    ,"selectedstudentcount":{$gte:1}
                }}
                    ,{$group:{_id:"null",reservationcoursecount : {$sum : "$selectedstudentcount"}}}
                ],
                function(err,data) {
                    if(err){
                        return callback(err);
                    };
                    var totalCourseCountDay=0;
                    if (data && data.length>0){
                        totalCourseCountDay=data[0].reservationcoursecount;
                    }
                    cache.set('ReservationCourseCountDay:'+schoolid+beginDate, totalCourseCountDay,60*1,function(){});
                    return callback(null,totalCourseCountDay);
                });
        }
    })
}

//var begintime=(new Date("2016-02-20")).clearTime();
//var endtime=(new Date("2016-02-21")).clearTime();
//getReservationCourseCountDay("56947dcd5180e10078ed6b3b" ,begintime,endtime,function(err,data){
//    console.log(data)
//});

// 到目前为止今天已经上课的预约数量  (实事数据)
var  getFinishReservationNow=function(schoolid,beginDate,endDate,callback){
    cache.get('getFinishReservationNow:'+schoolid+beginDate, function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback(null,data);
        }
        else {
            coursemode.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "coursebegintime": { $gte: beginDate, $lt:endDate}
                    ,"courseendtime": {  $lte: new Date()}
                    ,"selectedstudentcount":{$gte:1}
                }}
                    ,{$group:{_id:"null",reservationcoursecount : {$sum : "$selectedstudentcount"}}}
                ],
                function(err,data) {
                    if(err){
                        return callback(err);
                    };
                    var totalCourseCountDay=0;
                    if (data && data.length>0){
                        totalCourseCountDay=data[0].reservationcoursecount;
                    }
                    cache.set('getFinishReservationNow:'+schoolid+beginDate, totalCourseCountDay,60*1,function(){});
                    return callback(null,totalCourseCountDay);
                });
        }
    })
}

//var begintime=(new Date("2015-11-8")).clearTime();
//var endtime=(new Date("2015-11-9")).clearTime();
//getFinishReservationNow("562dcc3ccb90f25c3bde40da" ,begintime,endtime,function(err,data){
//    console.log(data)
//});

//主页实事数据 这一时段所有可以预约教练的授课量
 var getCoachCourseNow=function(schoolid,beginDate,callback){
     cache.get('getCoachCourseNows:'+schoolid+beginDate, function(err,data) {
         if (err) {
             return callback(err);
         }
         if(data){
             return callback(null,data);
         }
         else {
             // 判断星期
             var temptime=new Date(beginDate);
             var week=temptime.getDay();
             if(week==0){week=7}
             var hour=(new Date()).getHours();
             coachmodel.aggregate([{$match:{
                     "driveschool":new mongodb.ObjectId(schoolid),
                     "is_validation":true,
                     "is_lock":false
                     ,"workweek":{"$in":[week]}
                     ,"worktimespace.begintimeint":{$lte:hour}
                     ,"worktimespace.endtimeint":{ $gt:hour}
                 }},
                     {"$project":{
                         "coursecount":"$coursestudentcount",
                     }}
                     ,{$group:{_id:"null",coursecount : {$sum : "$coursecount"}}}],
                 function(err,data) {
                     if(err){
                         return callback(err);
                     };
                     var totalCourseCountDay=0;
                     if (data && data.length>0){
                         totalCourseCountDay=data[0].coursecount;
                     }
                     cache.set('getCoachCourseNows:'+schoolid+beginDate, totalCourseCountDay,60*1,function(){});
                     return callback(null,totalCourseCountDay);
                 });
         }
     })
 }

//var endtime=(new Date("2015-11-9")).clearTime();
//getCoachCourseNows("562dcc3ccb90f25c3bde40da" ,endtime,function(err,data){
//    console.log(data)
//});
// 实事 这一时段正在上课的数量
var getCourseStudnetNow=function(schoolid,callback){
    cache.get('getCourseStudnetNow:'+schoolid, function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback(null,data);
        }
        else {
            coursemode.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "coursebegintime": {  $lte:new Date()}
                    ,"courseendtime": {  $gte: new Date()}
                    ,"selectedstudentcount":{$gte:1}
                }}
                    ,{$group:{_id:"null",reservationcoursecount : {$sum : "$selectedstudentcount"}}}
                ],
                function(err,data) {
                    if(err){
                        return callback(err);
                    };
                    var totalCourseCountDay=0;
                    if (data && data.length>0){
                        totalCourseCountDay=data[0].reservationcoursecount;
                    }
                    cache.set('getCourseStudnetNow:'+schoolid, totalCourseCountDay,60*1,function(){});
                    return callback(null,totalCourseCountDay);
                });
        }
    })
}

//var endtime=(new Date("2015-11-9")).clearTime();
//getCourseStudnetNow("562dcc3ccb90f25c3bde40da" ,function(err,data){
//    console.log(data)
//});

//getMoreDatalatest("562dcc3ccb90f25c3bde40da",begintime,datetomorrow,function(err,data){} )

// 主页中统计今天/昨天的数据
var  getMainpageToadyData=function(schoolid,type,callback){
    // 统计开始结束时间
    if (type==appTypeEmun.StatisitcsType.day){
    var begintime=(new Date()).clearTime();
    var  endtime = (new Date()).addDays(1).clearTime();}
    else
    {
        var begintime=(new Date()).addDays(-1).clearTime();
        var  endtime = (new Date()).clearTime();
    }

    var proxy = new eventproxy();
    if (type==appTypeEmun.StatisitcsType.day) {
        proxy.all('SchoolStudentCount', "ApplyStudentCount", "CommentStudentCount", "ComplaintStudentCount",
            "CocahsTotalCourseCount", "ReservationCourseCountDay", "FinishReservationNow", "CoachCourseNow", "CourseStudentNow",
            function (SchoolStudentCount, ApplyStudentCount, CommentStudentCount, ComplaintStudentCount, CocahsTotalCourseCount,
                      ReservationCourseCountDay, FinishReservationNow, CoachCourseNow, CourseStudentNow) {
                var info = {
                    "schoolstudentcount": SchoolStudentCount,
                    "applystudentcount": ApplyStudentCount,
                    "commentstudentcount": CommentStudentCount,
                    "complaintstudentcount": ComplaintStudentCount,
                    "coachstotalcoursecount": CocahsTotalCourseCount,
                    "reservationcoursecountday": ReservationCourseCountDay,
                    "finishreservationnow": FinishReservationNow,
                    "coachcoursenow": CoachCourseNow,
                    "coursestudentnow": CourseStudentNow
                };

                return callback(null, info);
            });
    }else{
        proxy.all('SchoolStudentCount', "ApplyStudentCount", "CommentStudentCount", "ComplaintStudentCount",
            "CocahsTotalCourseCount", "ReservationCourseCountDay",
            function (SchoolStudentCount, ApplyStudentCount, CommentStudentCount, ComplaintStudentCount, CocahsTotalCourseCount,
                      ReservationCourseCountDay, FinishReservationNow, CoachCourseNow, CourseStudnetNow) {
                var info = {
                    "schoolstudentcount": SchoolStudentCount,
                    "applystudentcount": ApplyStudentCount,
                    "commentstudentcount": CommentStudentCount,
                    "complaintstudentcount": ComplaintStudentCount,
                    "coachstotalcoursecount": CocahsTotalCourseCount,
                    "reservationcoursecountday": ReservationCourseCountDay

                };

                return callback(null, info);
            });
    }


    proxy.fail(callback);

    // 获取在校学生 科目一*四
    getSchoolStudentCount(schoolid,proxy.done('SchoolStudentCount'))
    //获取今日申请人数
    getApplyStudentCountDayly(schoolid,begintime,endtime,proxy.done('ApplyStudentCount'))
    // 获取 评价数量
    getStudentCommentDayly(schoolid,begintime,endtime,proxy.done('CommentStudentCount'))
    // 投诉数量
    getStudentComplaintDayly(schoolid,begintime,endtime,proxy.done('ComplaintStudentCount'))
    // 今天教练课时总数
    getCocahsTotalCourseCount(schoolid,begintime,proxy.done('CocahsTotalCourseCount'))
    // 今天的预约总数
    getReservationCourseCountDay(schoolid,begintime,endtime,proxy.done("ReservationCourseCountDay"));
    if (type==appTypeEmun.StatisitcsType.day) {
        // 到目前为止上课总数
        getFinishReservationNow(schoolid, begintime, endtime, proxy.done("FinishReservationNow"))
        // 这个时段的课时总数
        getCoachCourseNow(schoolid, new Date(), proxy.done("CoachCourseNow"))
        // 这个时段的上课总数
        getCourseStudnetNow(schoolid, proxy.done("CourseStudentNow"))
    }

}
// 主页中统计一周的数据
var  getMainpageWeekData=function(schoolid,type,callback){
    var begintime=(new Date()).addDays(-6).clearTime();
    var  endtime = (new Date()).addDays(1).clearTime();
    var proxy = new eventproxy();
    proxy.fail(callback);
    cache.get("getMainpageWeekData"+schoolid+begintime,proxy.done(function(weekdata){
        if (weekdata){
            proxy.emit("getMainpageWeekData",weekdata);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid)
                   , "summarytime": { $gte: begintime,  $lt:endtime}
                }}
                     ,{$group:{_id:"null",applystudentcount : {$sum : "$applystudentcount"}
                        ,goodcommentcount : {$sum : "$goodcommentcount"}
                        ,badcommentcount : {$sum : "$badcommentcount"}
                        ,generalcomment : {$sum : "$generalcomment"}
                        ,complaintstudentcount : {$sum : "$complaintcount"}
                        ,coachstotalcoursecount : {$sum : "$totalcoursecount"}
                        ,reservationcoursecountday : {$sum : "$reservationcoursecount"}

                    }}
                ],
                proxy.done(function(data) {
                    console.log(data);
                    var weekdatasummary={
                        "applystudentcount":0,
                        "goodcommentcount": 0,
                        "badcommentcount":0,
                        "generalcomment": 0,
                        "complaintstudentcount": 0,
                        "coachstotalcoursecount": 0,
                        "reservationcoursecountday": 0,
                    };
                    if (data && data.length>0){
                        weekdatasummary.applystudentcount=data[0].applystudentcount;
                        weekdatasummary.goodcommentcount=data[0].goodcommentcount;
                        weekdatasummary.badcommentcount=data[0].badcommentcount;
                        weekdatasummary.generalcomment=data[0].generalcomment;
                        weekdatasummary.complaintstudentcount=data[0].complaintstudentcount;
                        weekdatasummary.coachstotalcoursecount=data[0].coachstotalcoursecount;
                        weekdatasummary.reservationcoursecountday=data[0].reservationcoursecountday;

                    }
                    cache.set("getMainpageWeekData"+schoolid+begintime, weekdatasummary,60*1,function(){});
                    proxy.emit("getMainpageWeekData",weekdatasummary);
                }));
        }
    }))

    proxy.all('getMainpageWeekData',
        function (getMainpageWeekData) {
            return callback(null, getMainpageWeekData);
        });

}

//var  endtime = (new Date("2015-11-6")).addDays(1).clearTime();
//var begintime=(new Date("2015-11-6")).clearTime();
//getApplyStudentCountTimely("562dcc3ccb90f25c3bde40da" ,begintime,endtime,function(err,data){
//  console.log(data)
//})
// 更多数据中统计 一周的数据
var getMoreDataWeek=function(schoolid,type,callback){
    var begintime=(new Date()).addDays(-7).clearTime();
    var  datenow=new Date();
    var  endtime = (new Date()).addDays(1).clearTime();
    if (type==appTypeEmun.StatisitcsType.week){
        begintime=(new Date()).addDays(-6).clearTime();
        //endtime = (new Date()).clearTime();
    } else if (type==appTypeEmun.StatisitcsType.month){

        begintime=(new Date(datenow.getFullYear(),datenow.getMonth(),1))
    }
    else if(type==appTypeEmun.StatisitcsType.year){
        begintime=(new Date(datenow.getFullYear(),1,1))
    }

    var proxy = new eventproxy();
    proxy.fail(callback);
    if (type==appTypeEmun.StatisitcsType.week){
    getMoreApplyStudentByWeek(schoolid,begintime,endtime,proxy.done("ApplyStudentByWeek"));
    } else if(type==appTypeEmun.StatisitcsType.month){
        getMoreDataStudentByMonth(schoolid,begintime,endtime,proxy.done("ApplyStudentByWeek"));
    }else if(type==appTypeEmun.StatisitcsType.year){
        getMoreDataStudentByYear(schoolid,begintime,endtime,proxy.done("ApplyStudentByWeek"));
    }
    getCoachCourseByWeek(schoolid,begintime,endtime,proxy.done("CoachCourseByWeek"));
    proxy.all('ApplyStudentByWeek',"CoachCourseByWeek",
        function (ApplyStudentByWeek,CoachCourseByWeek){
            var weekmroedatainfo= {
                datalist:ApplyStudentByWeek,
                coursedata:CoachCourseByWeek
            };
            return callback(null,weekmroedatainfo);
        });

}
// 更多数据中统计今天昨天的数据
var  getMoreDataToday=function(schoolid,type,callback){
    if (type==appTypeEmun.StatisitcsType.day){
        var begintime=(new Date()).clearTime();
        var  endtime = (new Date()).addDays(1).clearTime();}
    else
    {
        var begintime=(new Date()).addDays(-1).clearTime();
        var  endtime = (new Date()).clearTime();
    }
    var proxy = new eventproxy();
    proxy.fail(callback);
    // 按时段统计报名人数
    getApplyStudentCountTimely(schoolid,begintime,endtime,proxy.done("ApplyStudentCountTimely"));
    // 按时段统计预约人数
    getReservationCourseCountTimely(schoolid,begintime,endtime,proxy.done("ReservationCourseCountTimely"));
    //统计教练的授课数
    getGroupCoachCourseDay(schoolid,begintime,endtime,proxy.done("GroupCoachCourseDay"));
    // 经济好评、中差评、
    getCommentTimely(schoolid,begintime,endtime,[4,5],proxy.done("GoodCommentTimely"));
    getCommentTimely(schoolid,begintime,endtime,[0,1],proxy.done("BadCommentTimely"));
    getCommentTimely(schoolid,begintime,endtime,[2,3],proxy.done("GeneralCommentTimely"));
    // 获取投诉数量
    getStudentComplaintTimely(schoolid,begintime,endtime,proxy.done("StudentComplaintTimely"));
    proxy.all('ApplyStudentCountTimely',"ReservationCourseCountTimely","GroupCoachCourseDay","GoodCommentTimely"
        ,"BadCommentTimely","GeneralCommentTimely","StudentComplaintTimely",
        function (ApplyStudentCountTimely,ReservationCourseCountTimely,GroupCoachCourseDay,GoodCommentTimely,BadCommentTimely,
                  GeneralCommentTimely,StudentComplaintTimely
        ) {
            var daymroedatainfo={
                "applystuentlist":ApplyStudentCountTimely,
            "reservationstudentlist":ReservationCourseCountTimely,
            "coachcourselist":GroupCoachCourseDay,
            "goodcommentlist":GoodCommentTimely,
            "badcommentlist":BadCommentTimely,
                "generalcommentlist":GeneralCommentTimely,
                "complaintlist":StudentComplaintTimely,

            }
            return callback(null, daymroedatainfo);
        });

}
// 获取主页数据
exports.getMainPageData=function(queryinfo,callback){
    // 获取今天和昨天的统计数据
    if(queryinfo.searchtype==appTypeEmun.StatisitcsType.day||queryinfo.searchtype==appTypeEmun.StatisitcsType.yesterday){
        getMainpageToadyData(queryinfo.schoolid,queryinfo.searchtype,callback)
    }else if( queryinfo.searchtype==appTypeEmun.StatisitcsType.week){
        // 统计一周总的约课数据  和开课数据
        // 统计 好中差评数据
        getMainpageWeekData(queryinfo.schoolid,queryinfo.searchtype,callback)
    }else{
        return callback("查询参数错误");
    }

}

// 更多数据中统计
exports.getMoreStatisitcsdata=function(queryinfo,callback){
    if(queryinfo.searchtype==appTypeEmun.StatisitcsType.day
        ||queryinfo.searchtype==appTypeEmun.StatisitcsType.yesterday){
        getMoreDataToday(queryinfo.schoolid,queryinfo.searchtype,callback)
    }else if( queryinfo.searchtype==appTypeEmun.StatisitcsType.week
    ||queryinfo.searchtype==appTypeEmun.StatisitcsType.month
        ||queryinfo.searchtype==appTypeEmun.StatisitcsType.year){
        // 统计一周总的约课数据  和开课数据
        // 统计 好中差评数据
        getMoreDataWeek(queryinfo.schoolid,queryinfo.searchtype,callback);
    }else{
        return callback("查询参数错误");
    }
}


exports.statisticsTodayinfo=function(schoolid,begintime,endtime,callback){

    var proxy = new eventproxy();

        proxy.all('SchoolStudentCount', "ApplyStudentCount", "CommentStudentCount", "ComplaintStudentCount",
            "CocahsTotalCourseCount", "ReservationCourseCountDay",
            function (SchoolStudentCount, ApplyStudentCount, CommentStudentCount, ComplaintStudentCount, CocahsTotalCourseCount,
                      ReservationCourseCountDay) {
                var info = {
                    "schoolstudentcount": SchoolStudentCount,
                    "applystudentcount": ApplyStudentCount,
                    "commentstudentcount": CommentStudentCount,
                    "complaintstudentcount": ComplaintStudentCount,
                    "coachstotalcoursecount": CocahsTotalCourseCount,
                    "reservationcoursecountday": ReservationCourseCountDay

                };

                return callback(null, info);
            });

    proxy.fail(callback);
    // 获取在校学生 科目一*四
    getSchoolStudentCount(schoolid,proxy.done('SchoolStudentCount'))
    //获取今日申请人数
    getApplyStudentCountDayly(schoolid,begintime,endtime,proxy.done('ApplyStudentCount'))
    // 获取 评价数量
    getStudentCommentDayly(schoolid,begintime,endtime,proxy.done('CommentStudentCount'))
    // 投诉数量
    getStudentComplaintDayly(schoolid,begintime,endtime,proxy.done('ComplaintStudentCount'))
    // 今天教练课时总数
    getCocahsTotalCourseCount(schoolid,begintime,proxy.done('CocahsTotalCourseCount'))
    // 今天的预约总数
    getReservationCourseCountDay(schoolid,begintime,endtime,proxy.done("ReservationCourseCountDay"));

};

// 校长处理投诉
exports.handleComplaint=function(handleinfo,callback){
    headmastermodel.findById(new mongodb.ObjectId(handleinfo.userid),function(err,data){
        if(err){
            return callback("查询驾校出错："+err);
        }
        if(data){
            reservationmodel.findOne(
                {"driveschool":new mongodb.ObjectId(data.driveschool),
                "_id":new mongodb.ObjectId(handleinfo.reservationid) })
                .exec(function(err,reservationdata){
                    if (err){
                        return callback("查询投诉信息报错："+err);
                    }
                    if(reservationdata){
                        reservationdata.complainthandinfo.handlestate=appTypeEmun.ApplyHandelState.Handeled;
                        reservationdata.complainthandinfo.handlemessage=handleinfo.complainthandlemessage;
                        reservationdata.complainthandinfo.operator=data.name;
                        reservationdata.complainthandinfo.handledatetime=new Date();
                        reservationdata.save(function(err,data){
                            if(err){
                                return callback("报错信息出错："+err);
                            }
                            return callback(null,"sucess");
                        })

                    }else {
                        return callback("没有查询到投诉信息")
                    }
                })

        }else{
            return callback("没有查询到信息");
        }
    });
};
//校长处理投诉V2
exports.handleComplaintv2=function(handleinfo,callback){
    headmastermodel.findById(new mongodb.ObjectId(handleinfo.userid),function(err,data){
        if(err){
            return callback("查询驾校出错："+err);
        }
        if(data){
            userFeedBack.findOne(
                {"schoolid":new mongodb.ObjectId(data.driveschool),
                "_id":new mongodb.ObjectId(handleinfo.reservationid) })
                .exec(function(err,reservationdata){
                    if (err){
                        return callback("查询投诉信息报错："+err);
                    }
                    if(reservationdata){
                        reservationdata.complainthandinfo.handlestate=appTypeEmun.ApplyHandelState.Handeled;
                        reservationdata.complainthandinfo.handlemessage=handleinfo.complainthandlemessage;
                        reservationdata.complainthandinfo.operator=data.name;
                        reservationdata.complainthandinfo.handledatetime=new Date();
                        reservationdata.save(function(err,data){
                            if(err){
                                return callback("保存信息出错："+err);
                            }
                            return callback(null,"sucess");
                        })

                    }else {
                        return callback("没有查询到投诉信息")
                    }
                })

        }else{
            return callback("没有查询到信息");
        }
    });
}

// 查询投诉详情第二版本
exports.getComplaintDetailsv2=function(queryinfo,callback){
    userFeedBack.find( {"schoolid":new mongodb.ObjectId(queryinfo.schoolid),
        "feedbacktype":1,
            userid: {$exists: true},
            coachid: {$exists: true},

    })
        .populate("userid","mobile name  headportrait applyclasstypeinfo")
        .populate("coachid"," name mobile headportrait ")
        .sort({"createtime":-1})
        .skip((queryinfo.index-1)*queryinfo.count)
        .limit(queryinfo.count)
        .exec(function(err,data){
            if(err){
                return call("查询投诉信息出错："+err)
            }
            process.nextTick(function(){
                var complaintlist=[];
                data.forEach(function(r,index){
                    // console.log(r.userid);
                    complaintinfo={
                        reservationid: r._id,
                        complaintreason: "",
                        complaintcontent: r.feedbackmessage,
                        complaintDateTime: r.createtime,
                        complainthandlestate: (r.complainthandinfo.handlestate&&r.complainthandinfo.handlestate>0) ?
                            1:0,
                        complainthandlemessage: r.complainthandinfo.handlemessage? r.complainthandinfo.handlemessage:"",
                        subject: {
                            subjectid:2,
                            name:"科目二"
                        },
                        studentinfo:{
                            userid: r.userid._id,
                            mobile: r.userid.mobile,
                            name:r.userid.name,
                            headportrait:r.userid.headportrait,
                            classtype:r.userid.applyclasstypeinfo
                        },
                        coachinfo:{
                            coachid: r.coachid._id,
                            mobile: r.coachid.mobile,
                            name:r.coachid.name,
                            headportrait:r.coachid.headportrait,

                        }
                    }
                    complaintlist.push(complaintinfo);
                });
                return callback(null,complaintlist);
            })
        });
    //reservationmodel.find(
    //    {"driveschool":new mongodb.ObjectId(queryinfo.schoolid),
    //    "is_complaint":true
    //   // ,"complaint.complainttime": { $gte:beginDate, $lte:endDate}
    //    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
    //        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]})
    //    .select("userid coachid is_complaint  complaint subject complainthandinfo ")
    //    .populate("userid","mobile name  headportrait applyclasstypeinfo")
    //    .populate("coachid"," name mobile headportrait ")
    //    .sort({"complaint.complainttime":-1})
    //    .skip((queryinfo.index-1)*queryinfo.count)
    //    .limit(queryinfo.count)
    //    .exec(function(err,data){
    //        if(err){
    //            return call("查询投诉信息出错："+err)
    //        }
    //        process.nextTick(function(){
    //            var complaintlist=[];
    //            data.forEach(function(r,index){
    //               // console.log(r.userid);
    //                complaintinfo={
    //                    reservationid: r._id,
    //                    complaintreason: r.complaint.reason,
    //                    complaintcontent: r.complaint.complaintcontent,
    //                    complaintDateTime: r.complaint.complainttime,
    //                    complainthandlestate: (r.complainthandinfo.handlestate&&r.complainthandinfo.handlestate>0) ?
    //                        1:0,
    //                    complainthandlemessage: r.complainthandinfo.handlemessage? r.complainthandinfo.handlemessage:"",
    //                    subject: r.subject,
    //                    studentinfo:{
    //                        userid: r.userid._id,
    //                        mobile: r.userid.mobile,
    //                        name:r.userid.name,
    //                        headportrait:r.userid.headportrait,
    //                        classtype:r.userid.applyclasstypeinfo
    //                    },
    //                    coachinfo:{
    //                        coachid: r.coachid._id,
    //                        mobile: r.coachid.mobile,
    //                        name:r.coachid.name,
    //                        headportrait:r.coachid.headportrait,
    //
    //                    }
    //                }
    //                complaintlist.push(complaintinfo);
    //            });
    //            return callback(null,complaintlist);
    //        })
    //    })
};
// 查询投诉详情
exports.getComplaintDetails=function(queryinfo,callback){
    reservationmodel.find(
        {"driveschool":new mongodb.ObjectId(queryinfo.schoolid),
            "is_complaint":true
            // ,"complaint.complainttime": { $gte:beginDate, $lte:endDate}
            ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
            {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]})
        .select("userid coachid is_complaint  complaint subject complainthandinfo ")
        .populate("userid","mobile name  headportrait applyclasstypeinfo")
        .populate("coachid"," name mobile headportrait ")
        .sort({"complaint.complainttime":-1})
        .skip((queryinfo.index-1)*queryinfo.count)
        .limit(queryinfo.count)
        .exec(function(err,data){
            if(err){
                return call("查询投诉信息出错："+err)
            }
            process.nextTick(function(){
                var complaintlist=[];
                data.forEach(function(r,index){
                    // console.log(r.userid);
                    complaintinfo={
                        reservationid: r._id,
                        complaintreason: r.complaint.reason,
                        complaintcontent: r.complaint.complaintcontent,
                        complaintDateTime: r.complaint.complainttime,
                        complainthandlestate: (r.complainthandinfo.handlestate&&r.complainthandinfo.handlestate>0) ?
                            1:0,
                        complainthandlemessage: r.complainthandinfo.handlemessage? r.complainthandinfo.handlemessage:"",
                        subject: r.subject,
                        studentinfo:{
                            userid: r.userid._id,
                            mobile: r.userid.mobile,
                            name:r.userid.name,
                            headportrait:r.userid.headportrait,
                            classtype:r.userid.applyclasstypeinfo
                        },
                        coachinfo:{
                            coachid: r.coachid._id,
                            mobile: r.coachid.mobile,
                            name:r.coachid.name,
                            headportrait:r.coachid.headportrait,

                        }
                    }
                    complaintlist.push(complaintinfo);
                });
                return callback(null,complaintlist);
            })
        })
};
/*
* 查询评论详情*/
exports.getCommentDetails=function(queryinfo,callback){
    var begintime=(new Date()).clearTime();
    var enddate=(new Date()).addDays(1).clearTime();
    var datenow=new Date();
    if(queryinfo.searchtype==appTypeEmun.StatisitcsType.yesterday){
        begintime=(new Date()).addDays(-1).clearTime();
        enddate=(new Date()).clearTime();
    }else
    if (queryinfo.searchtype==appTypeEmun.StatisitcsType.week){
        begintime=(new Date()).addDays(-7).clearTime();
    } else if (queryinfo.searchtype==appTypeEmun.StatisitcsType.month){

        begintime=(new Date(datenow.getFullYear(),datenow.getMonth(),1))
    }
    else if(queryinfo.searchtype==appTypeEmun.StatisitcsType.year){
        begintime=(new Date(datenow.getFullYear(),1,1))
    }

    var commentlevel;

    if(queryinfo.commentlevel==1){
        commentlevel=[4,5];
    } else if (queryinfo.commentlevel==2){
        commentlevel=[2,3];
    }
    else {
        commentlevel=[0,1];
    }
    //console.log(queryinfo);
    //console.log(begintime);
    //console.log(enddate);
    reservationmodel.find(
        {"driveschool":new mongodb.ObjectId(queryinfo.schoolid),
            "is_comment":true
             ,"comment.starlevel":{$in:commentlevel}
             ,"comment.commenttime": {$gte: begintime,  $lte:enddate}
            ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
            {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]})
        .select("userid coachid is_comment  comment subject _id ")
        .populate("userid","mobile name  headportrait applyclasstypeinfo")
        .populate("coachid"," name mobile headportrait ")
        .sort({"comment.commenttime":-1})
        .skip((queryinfo.index-1)*queryinfo.count)
        .limit(queryinfo.count)
        .exec(function(err,data){
            if(err){
                return call("查询投诉信息出错："+err)
            }
            process.nextTick(function(){
                var complaintlist=[];
                data.forEach(function(r,index){
                    complaintinfo={
                        reservationid: r._id,
                        commentstarlevel: r.comment.starlevel,
                        commenttime: r.comment.commenttime,
                        commentcontent: r.comment.commentcontent,
                        subject: r.subject,
                        studentinfo:{
                            userid: r.userid._id,
                            mobile: r.userid.mobile,
                            name:r.userid.name,
                            headportrait:r.userid.headportrait,
                            classtype:r.userid.applyclasstypeinfo
                        },
                        coachinfo:{
                            coachid: r.coachid._id,
                            mobile: r.coachid.mobile,
                            name:r.coachid.name,
                            headportrait:r.coachid.headportrait,

                        }
                    }
                    complaintlist.push(complaintinfo);
                });
                getStudentCommentDayly(queryinfo.schoolid,begintime,enddate, function(err,data){
                    if(err){
                        return callback("统计出错");
                    }
                    var returnlist={
                        commentcount:data,
                        commentlist:complaintlist
                    }
                    return callback(null,returnlist);
                })

            })
        })
};

/* 查询评论详情*/
exports.getCoachCourseDetails=function(queryinfo,callback){
    var begintime=(new Date()).clearTime();
    var enddate=(new Date()).addDays(1).clearTime();
    var datenow=new Date();
    if(queryinfo.searchtype==appTypeEmun.StatisitcsType.yesterday){
        begintime=(new Date()).addDays(-1).clearTime();
        enddate=(new Date()).clearTime();
    }else
    if (queryinfo.searchtype==appTypeEmun.StatisitcsType.week){
        begintime=(new Date()).addDays(-7).clearTime();
    } else if (queryinfo.searchtype==appTypeEmun.StatisitcsType.month){

        begintime=(new Date(datenow.getFullYear(),datenow.getMonth(),1))
    }
    else if(queryinfo.searchtype==appTypeEmun.StatisitcsType.year){
        begintime=(new Date(datenow.getFullYear(),1,1))
    }

    return statisitcsCourseDetails(queryinfo.schoolid,begintime,enddate,callback);
}
//==================================教练课时详情==================================================
//查询教练的课时学
var getCoachCourseDetial=function (schoolid,beginDate,endDate,callback){
    cache.get('getCoachCourseDetial:'+schoolid+beginDate, function(err,data) {
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            reservationmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "begintime": { $gte: beginDate, $lt:endDate}
                    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }}
                    ,{$group:{_id:"$coachid",coursecount : {$sum : "$coursehour"}}}
                ,{"$sort":{coursecount:-1}}
                ],
                function(err,data){
                    if(err){
                        return callback(err);
                    }
                    cache.set('getCoachCourseDetial:'+schoolid+beginDate, data,60*1,function(){});
                    return callback(null,data);
                }
            )
        }
    });
}
var  getCommentCoachCourseDetial=function(schoolid,beginDate,endDate,commentlevel,callback){
    cache.get('getCommentCoachCourseDetial:'+schoolid+beginDate+commentlevel[0], function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback (null,data)
        } else {
            reservationmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "is_comment":true
                    ,"comment.starlevel":{$in:commentlevel}
                    ,"comment.commenttime": { $gte:beginDate, $lte:endDate}
                    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }}
                    ,{$group:{_id:"$coachid",commnetcount : {$sum : 1}}}
                ],
                function (err,data) {
                    if (err){
                        return callback(err);
                    }
                    cache.set('getCommentCoachCourseDetial:'+schoolid+beginDate+commentlevel[0], data,60*1,function(){});
                    return callback(null,data);
                })

        }
    })
}
var  getComplaintCoachCourseDetial=function(schoolid,beginDate,endDate,callback){
    cache.get('getComplaintCoachCourseDetial:'+schoolid+beginDate, function(err,data) {
        if (err) {
            return callback(err);
        }
        if(data){
            return callback (null,data)
        } else {
            reservationmodel.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "is_complaint":true
                    ,"complaint.complainttime": { $gte:beginDate, $lte:endDate}
                    ,"$and":[{reservationstate: { $ne : appTypeEmun.ReservationState.applycancel } },
                        {reservationstate: { $ne : appTypeEmun.ReservationState.applyrefuse }}]
                }}
                    ,{$group:{_id:"$coachid",complaintcount : {$sum : 1}}}
                ],
                function (err,data) {
                    if (err){
                        return callback(err);
                    }
                    cache.set('getComplaintCoachCourseDetial:'+schoolid+beginDate, data,60*1,function(){});
                    return callback(null,data);
                })

        }
    })
}
//查询驾校所有教练
var getSchoolallCoach=function(schoolid,callback){
    cache.get("schoolcoach"+schoolid,function(err,data){
        if (err) {
            return callback(err);
        }
        if(data){
            return callback(null,data);
        }else{
            coachmodel.find({"driveschool":new mongodb.ObjectId(schoolid),
            "is_validation":true})
                .select("_id name  mobile headportrait  starlevel")
                .sort({"starlevel":-1})
                .exec(function(err,coachdata){
                    if(err){
                        return callback(err);
                    }
                    cache.set("schoolcoach"+schoolid, coachdata,60*20,function(){});
                    return callback(null,coachdata);
                })
        }
    })
}

var statisitcsCourseDetails=function(schoolid,beginDate,endDate, callback){
    var proxy = new eventproxy();
    proxy.fail(callback);
    // 学校教练
    getSchoolallCoach(schoolid,proxy.done("coachCount"));
    ///
    getCoachCourseDetial(schoolid,beginDate,endDate,proxy.done("coachCourseCount"));
    getCommentCoachCourseDetial(schoolid,beginDate,endDate,[0,1],proxy.done("badCommentCount"));
    getCommentCoachCourseDetial(schoolid,beginDate,endDate,[2,3],proxy.done("generalCommentCount"));
    getCommentCoachCourseDetial(schoolid,beginDate,endDate,[4,5],proxy.done("goodCommentCount"));
    getComplaintCoachCourseDetial(schoolid,beginDate,endDate,proxy.done("complaintCount"));

    proxy.all('coachCount',"coachCourseCount","goodCommentCount","badCommentCount",
        "generalCommentCount","complaintCount",
        function(coachCount,coachCourseCount,goodCommentCount,badCommentCount,generalCommentCount,complaintCount
        ){
            coachlist=  _.map(coachCount,function(item,i){
                var coachinfo={
                   coachid:item._id,
                    name:item.name,
                    mobile:item.mobile,
                    headportrait:item.headportrait,
                    starlevel:item.starlevel
                }
               courescount= _.find(coachCourseCount,function(itemcourse){
                    return itemcourse._id==item._id;
                });
                goodcommentcount= _.find(goodCommentCount,function(itemcourse){
                    return itemcourse._id==item._id;
                });
                badcommentcount= _.find(badCommentCount,function(itemcourse){
                    return itemcourse._id==item._id;
                });
                generalcommentcount= _.find(generalCommentCount,function(itemcourse){
                    return itemcourse._id==item._id;
                });
                complaintcount= _.find(complaintCount,function(itemcourse){
                    return itemcourse._id==item._id;
                });
                coachinfo.coursecount=courescount?courescount.coursecount:0;
                coachinfo.goodcommentcount=goodcommentcount?goodcommentcount.commnetcount:0;
                coachinfo.badcommentcount=badcommentcount?badcommentcount.commnetcount:0;
                coachinfo.generalcommentcount=generalcommentcount?generalcommentcount.commnetcount:0;
                coachinfo.complaintcount=complaintcount?complaintcount.complaintcount:0;
                return coachinfo;
            });
            //console.log(coachlist);
            return callback(null, coachlist);

        });

}

//var  endtime = (new Date("2015-12-10")).addDays(1).clearTime();
//var begintime=(new Date("2015-8-10")).clearTime();
//statisitcsCourseDetails("562dcc3ccb90f25c3bde40da" ,begintime,endtime,function(err,data){
//  //console.log(data)
//})





//====================================v2==========================
// 查询投诉详情第二版本
exports.getComplaintList=function(queryinfo,callback){
    var searchinfo={"schoolid":new mongodb.ObjectId(queryinfo.schoolid),
       "$or":[  {"feedbacktype":1},{"feedbacktype":2}],
        userid: {$exists: true},
        coachid: {$exists: true},
    }
    userFeedBack.find(searchinfo)
        .populate("userid","mobile name  headportrait applyclasstypeinfo")
        .populate("coachid"," name mobile headportrait ")
        .sort({"createtime":-1})
        .skip((queryinfo.index-1)*queryinfo.count)
        .limit(queryinfo.count)
        .exec(function(err,data){
            if(err){
                return call("查询投诉信息出错："+err)
            }
            basefun.getModelCount(userFeedBack,searchinfo,function(err,feedcount){
                process.nextTick(function(){
                var complaintlist=[];
                data.forEach(function(r,index){
                    // console.log(r.userid);
                    complaintinfo={
                        complaintid: r._id,
                        complaintcontent: r.feedbackmessage,
                        complaintDateTime: r.createtime,
                        feedbackusertype: r.feedbackusertype,
                        feedbacktype: r.feedbacktype,
                        piclistr: r.piclist,
                        complainthandinfo: r.complainthandinfo,
                        studentinfo:{
                            userid: r.userid._id,
                            mobile: r.userid.mobile,
                            name:r.userid.name,
                            headportrait:r.userid.headportrait,
                            classtype:r.userid.applyclasstypeinfo
                        },
                        coachinfo:{
                            coachid: r.coachid._id,
                            mobile: r.coachid.mobile,
                            name:r.coachid.name,
                            headportrait:r.coachid.headportrait,

                        }
                    }
                    complaintlist.push(complaintinfo);
                });
                    returndata={
                        count:feedcount,
                        complaintlist:complaintlist
                    }
                return callback(null,returndata);
            })
            })
        });

};

// 主页数据
exports.getMainPageDatav2=function(queryinfo,callback){
    if (queryinfo.searchtype==appTypeEmun.StatisitcsType.day){
        var begintime=(new Date()).clearTime();
        var  endtime = (new Date()).addDays(1).clearTime();}
    else
    {
        var begintime=(new Date()).addDays(-1).clearTime();
        var  endtime = (new Date()).clearTime();
    }

    var proxy = new eventproxy();
    if (parseInt(queryinfo.searchtype)==appTypeEmun.StatisitcsType.day) {
        proxy.all('SchoolStudentCount', "ApplyStudentCount", "CommentStudentCount", "ComplaintStudentCount",
            function (SchoolStudentCount, ApplyStudentCount, CommentStudentCount, ComplaintStudentCount ) {
                var info = {
                    "schoolstudentcount": SchoolStudentCount,
                    "applystudentcount": ApplyStudentCount,
                    "commentstudentcount": CommentStudentCount,
                    "complaintstudentcount": ComplaintStudentCount,

                };
                var passrate=[-1,80,90,100];
                var overstockstudent=[0,0,0,0];
                //console.log(SchoolStudentCount);

                SchoolStudentCount.forEach(function(r,index){
                    overstockstudent[(r.subjectid-1)]= r.studentcount;
                })
                info.passrate=passrate,
                info.overstockstudent=overstockstudent;
                return callback(null, info);
            });
    }
    else {
        return callback("查询类型出错");
    }


    proxy.fail(callback);

    // 获取在校学生 科目一*四
    getSchoolStudentCount(queryinfo.schoolid,proxy.done('SchoolStudentCount'))
    //获取今日申请人数
    getApplyStudentCountDayly(queryinfo.schoolid,begintime,endtime,proxy.done('ApplyStudentCount'))
    // 获取 评价数量
    getStudentCommentDayly(queryinfo.schoolid,begintime,endtime,proxy.done('CommentStudentCount'))
    // 投诉数量
    getStudentComplaintDayly(queryinfo.schoolid,begintime,endtime,proxy.done('ComplaintStudentCount'))
};

// 考试信息列表 获取考试月份
exports.getExamMonth=function(queryinfo,callback){
    UserExamInfo.aggregate([{
            $match: {
                driveschool: queryinfo.schoolid,
                subjectid:parseInt(queryinfo.subjectid),
                examinationstate: {"$gt": 2}
            }
        },
            {
                "$project": {
                    "uninid": {
                        "$concat": [{"$substr": [{$year: "$examinationdate"}, 0, 4]},
                            '-',
                            {"$substr": [{$month: "$examinationdate"}, 0, 2]}]
                    }
                }
            },
            {
                $group: {
                    _id: "$uninid", studentcount: {$sum: 1}
                }
            }
        //    ,
        //{
        //        "$sort": {"$examinationdate": -1}
        //    }
        ],
        function (err, examinfodata) {
            if (err) {
                return  callback("查询出错:"+err);
            }
            else {
                return callback(null,examinfodata);
            }

        }
    )
};

// 获取考试通过信息
exports.getExaminfo=function(queryinfo,callback){
    var beginDate=new Date();
    var endDate=new Date();
    beginDate.setFullYear(queryinfo.year,queryinfo.month-1,1);
    endDate.setFullYear(queryinfo.year,queryinfo.month-1,1);
    endDate=endDate.addMonths(1);
    //console.log(beginDate);
    //console.log(endDate);
    UserExamInfo.aggregate([{
            $match: {
                driveschool: queryinfo.schoolid,
                subjectid:parseInt(queryinfo.subjectid),
                examinationstate: {"$gt": 2},
                examinationdate: { $gte:beginDate, $lte:endDate}
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
            //{
            //    "$limit": parseInt(count)
            //},
            //{
            //    "$skip": (index-1)*count
            //}
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
// 周统计 周统计招生人数
var getMoreApplyStudentByWeekv2=function(schoolid,beginDate,endDate,callback){
    cache.get("getMoreApplyStudentByWeekv2"+schoolid+beginDate,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "summarytime": { $gte: beginDate, $lt:endDate}

                }},
                    {"$project":{
                        "day":{"$dayOfWeek":"$summarytime"}
                        ,"applystudentcount":"$applystudentcount"
                        ,"summarytime":"$summarytime"
                        ,"_id":0
                    }}
                    // ,{$group:{_id:"$week",applystudentcount : {$sum : "$selectedstudentcount"}}}
                ],function(err,schooldata){
                    if(err){
                        return callback(err);
                    };
                    schooldata.forEach(function(r,index){
                        r.day= (r.day-1)==0?7:(r.day-1);
                    })
                    schooldataList= _.sortBy(schooldata,'summarytime');
                    cache.set("getMoreApplyStudentByWeekv2"+schoolid+beginDate, schooldataList,60*1,function(){});
                    return callback(null,schooldataList);
                }
            )
        }
    })
}
// 更多数据 月统计
var getMoreDataStudentByMonthv2=function(schoolid,beginDate,endDate,callback){
    cache.get("getMoreDataStudentByMonthv2"+schoolid+beginDate,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "summarytime": { $gte: beginDate, $lt:endDate}

                }},
                    {"$project":{
                        "day":{"$dayOfMonth":"$summarytime"}
                        ,"applystudentcount":"$applystudentcount"
                        ,"summarytime":"$summarytime"
                        ,"_id":0
                    }}
                    //,{$group:{_id:"$week",
                    //    applystudentcount : {$sum : "$applystudentcount"},
                    //   }}
                ],function(err,schooldata){
                    if(err){
                        return callback(err);
                    }
                    var datalist=[0,0,0];
                    if (schooldata&&schooldata.length>0){
                        schooldata.forEach(function(r,index){
                             if(r.day<=10){
                                 datalist[0]=datalist[0]+ r.applystudentcount;
                             }else if(r.day<=20)
                             {
                                 datalist[1]=datalist[1]+ r.applystudentcount;
                             }
                            else {
                                 datalist[2]=datalist[2]+ r.applystudentcount;
                             }
                            //var listone={
                            //    weekindex:parseInt(r._id)+1,
                            //    applystudentcount:r.applystudentcount,
                            //}
                            //datalist.push(listone);
                        })
                    }
                    //datalist= _.sortBy(datalist,'weekindex');
                    cache.set("getMoreDataStudentByMonthv2"+schoolid+beginDate, datalist,60*1,function(){});
                    return callback(null,datalist);
                }
            )
        }
    })
}
// 更多数据 年统计
var getMoreDataStudentByYearv2=function(schoolid,beginDate,endDate,callback){
    cache.get("getMoreDataStudentByYearv2"+schoolid+beginDate,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            schooldaysunmmary.aggregate([{$match:{
                    "driveschool":new mongodb.ObjectId(schoolid),
                    "summarytime": { $gte: beginDate, $lt:endDate}

                }},
                    {"$project":{
                        "month":{"$month":"$summarytime"}
                        ,"applystudentcount":"$applystudentcount"
                        ,"summarytime":"$summarytime"
                        ,"_id":0
                    }}
                    ,{$group:{_id:"$month",applystudentcount : {$sum : "$applystudentcount"},
                       }}
                ],function(err,schooldata){
                    if(err){
                        return callback(err);
                    }
                    var datalist=[0,0,0,0];
                    if (schooldata&&schooldata.length>0){
                        schooldata.forEach(function(r,index){
                            if(r._id>=1&&r._id<=3){
                                datalist[0]=datalist[0]+ r.applystudentcount;
                            }else if(r._id>=4&&r._id<=6)
                            {
                                datalist[1]=datalist[1]+ r.applystudentcount;
                            }
                            else  if(r._id>=7&&r._id<=9){
                                datalist[2]=datalist[2]+ r.applystudentcount;
                            }
                            else {
                                datalist[3]=datalist[3]+ r.applystudentcount;
                            }
                            //var listone={
                            //    month:r._id,
                            //    applystudentcount:r.applystudentcount,
                            //}
                            //datalist.push(listone);
                        })
                    }
                    //datalist= _.sortBy(datalist,'month');
                    cache.set("getMoreDataStudentByYearv2"+schoolid+beginDate, datalist,60*1,function(){});
                    return callback(null,datalist);
                }
            )
        }
    })
}

//获取报名信息
exports.getApplySchoolInfo=function(queryinfo,callback){
    var begintime=(new Date()).addDays(-7).clearTime();
    var  datenow=new Date();
    var  endtime = (new Date()).addDays(1).clearTime();
    if ( parseInt(queryinfo.searchtype)==appTypeEmun.StatisitcsType.week){
        begintime=(new Date()).addDays(-6).clearTime();
        //endtime = (new Date()).clearTime();
    } else if (parseInt(queryinfo.searchtype)==appTypeEmun.StatisitcsType.month){

        begintime=(new Date(datenow.getFullYear(),datenow.getMonth(),1))
    }
    else if(parseInt(queryinfo.searchtype)==appTypeEmun.StatisitcsType.year){
        begintime=(new Date(datenow.getFullYear(),1,1))
    }

    var proxy = new eventproxy();
    proxy.fail(callback);
    if (parseInt(queryinfo.searchtype)==appTypeEmun.StatisitcsType.week){
        getMoreApplyStudentByWeekv2(queryinfo.schoolid,begintime,endtime,proxy.done("ApplyStudentByWeek"));
    } else if(parseInt(queryinfo.searchtype)==appTypeEmun.StatisitcsType.month){
        getMoreDataStudentByMonthv2(queryinfo.schoolid,begintime,endtime,proxy.done("ApplyStudentByWeek"));
    }else if(parseInt(queryinfo.searchtype)==appTypeEmun.StatisitcsType.year){
        getMoreDataStudentByYearv2(queryinfo.schoolid,begintime,endtime,proxy.done("ApplyStudentByWeek"));
    }
    proxy.all('ApplyStudentByWeek',
        function (ApplyStudentByWeek){
            var weekmroedatainfo= {
                datalist:ApplyStudentByWeek
            };
            return callback(null,weekmroedatainfo);
        });

};

// 获取教练反馈
exports.getCoachFeedBack=function(queryinfo,callback){
    CoachFeedBack.find({schoolid:new mongodb.ObjectId(queryinfo.schoolid)})
        .select("coachid replyid content createtime replyflag replycontent replytime")
        .populate("coachid","name _id headportrait ")
        .populate("replyid","name _id headportrait ")
        .sort({"createtime":-1})
        .skip((queryinfo.index-1)*queryinfo.count)
        .limit(queryinfo.count)
        .exec(function(err,data){
            if(err){
                return callback("查询教练反馈报错："+err)
            }else
            {
                return callback(null,data)
            }
        })
};


//保存校长回复教练反馈
exports.saveReplyCoachFeedBack=function(replyinfo,callback){
    CoachFeedBack.findById(replyinfo.feedbackid,function(err,data){
        if(err){
            return callback("查询教练反馈报错："+err)
        }else if(!data){
            return callback("没有查询到反馈信息")
        }
        else
        {
            data.replyflag=1;
            data.replyid=new mongodb.ObjectId(replyinfo.userid);
            data.replycontent=replyinfo.replycontent;
            data.replytime=new Date();
            data.save(function(err,newdata){
                if(err){
                    return callback("保存教练反馈报错："+err)
                }
                else{
                    return callback(null,"sucess")
                }
            })


        }
    })
}

