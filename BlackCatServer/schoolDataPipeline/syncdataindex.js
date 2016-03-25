/**
 * Created by v-yaf_000 on 2016/3/24.
 */
var schedule = require('node-schedule');
var syncConfig=require("./dataPipelineConfig");
var mongodb=require("../models/mongodb");
var async = require('async');
var quanZhouData=require("./quanzhou/qzdatasync");
require('date-utils');
var userModel=mongodb.UserModel;
var rule = new schedule.RecurrenceRule();
//rule.minute = 42;
var times = [];

for(var i=1; i<60; i=i+5){

    times.push(i);

}

rule.second = times;



// 同步泉州驾校信息
var syncQuanZhouData=function(schoolinfo,callback){
    usercoursesave=function(yibuuserid,courseinfo,callback){
        userModel.findById(yibuuserid,function(err,userdata){
            if (!userdata){
                return callback(err,userdata);
            }

        if (courseinfo.length>0){
            for (var i=0;i<courseinfo.length;i++){
                var onecourse=courseinfo[i];
                if(onecourse.KM=="1"){
                    userdata.schooluserid=onecourse.XYBH;
                    userdata.subjectone.officialhours=parseInt(onecourse.ZXS)+parseInt(onecourse.ZXS_XY);
                    userdata.subjectone.officialfinishhours=onecourse.ZXS;

                    if(onecourse.KH=="通过"){
                        userdata.examinationinfo.subjectone.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectone.examinationresult=2;
                    }
                    else if(onecourse.KH=="未考核"){
                        userdata.examinationinfo.subjectone.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectone.examinationresult=0;
                    }
                    else {
                        userdata.examinationinfo.subjectone.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectone.examinationresult=1;
                    }

                }
                else if(onecourse.KM=="2"){

                    userdata.subjecttwo.officialhours=parseInt(onecourse.ZXS)+parseInt(onecourse.ZXS_XY);
                    userdata.subjecttwo.officialfinishhours=onecourse.ZXS;

                    if(onecourse.KH=="通过"){
                        userdata.examinationinfo.subjecttwo.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjecttwo.examinationresult=2;
                    }
                    else if(onecourse.KH=="未考核"){
                        userdata.examinationinfo.subjecttwo.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjecttwo.examinationresult=0;
                    }
                    else {
                        userdata.examinationinfo.subjecttwo.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjecttwo.examinationresult=1;
                    }
                }
                else if(onecourse.KM=="3"){
                    userdata.subjectthree.officialhours=parseInt(onecourse.ZXS)+parseInt(onecourse.ZXS_XY);
                    userdata.subjectthree.officialfinishhours=onecourse.ZXS;

                    userdata.subjectfour.officialhours=parseInt(onecourse.LL)+parseInt(onecourse.LL_XY);
                    userdata.subjectfour.officialfinishhours=onecourse.LL;

                    if(onecourse.KH=="通过"){
                        userdata.examinationinfo.subjectthree.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectthree.examinationresult=2;

                        userdata.examinationinfo.subjectfour.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectfour.examinationresult=2;

                    }
                    else if(onecourse.KH=="未考核"){
                        userdata.examinationinfo.subjectthree.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectthree.examinationresult=0;
                        userdata.examinationinfo.subjectfour.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectfour.examinationresult=0;
                    }
                    else {
                        userdata.examinationinfo.subjectthree.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectthree.examinationresult=1;
                        userdata.examinationinfo.subjectfour.examinationresultdesc=onecourse.KH;
                        userdata.examinationinfo.subjectfour.examinationresult=1;
                    }
                }
            }
            console.log(userdata);
            userdata.save(function(err,data){
                return callback(err,data);
            })
        }
        return callback();
        })
    }
    userModel.find({"applyschool":new mongodb.ObjectId(schoolinfo.schoollid),
    "applystate":2,"subject.subjectid":{"$lt":5}})
        .select("_id name idcardnumber schooluserid  carmodel")
        .exec(function(err,userdatalist){
            if(err){
                return callback(err);
            }

            var count1 = 0;
            async.whilst(
                function() {
                    if(count1 >= userdatalist.length )
                    {
                        console.log(new Date().toString()+'同步驾校学员学时完成:'+schoolinfo.schoollid);

                    }
                    //console.log(count1);
                    //console.log(userdatalist.length);
                    return count1 < userdatalist.length ;
                     },
                function(cb) {
                    console.log(count1);
                    var oneuserdata=userdatalist[count1];
                    count1++;

                    // 如果存在车管所id
                    if(oneuserdata.schooluserid&&oneuserdata.schooluserid.length>0){
                        console.log("根据车管所id查询课时："+oneuserdata.schooluserid);
                        var searchinfo={
                            userid:schoolinfo.userid,
                            mac:schoolinfo.mac,
                            id:oneuserdata.schooluserid,
                            sscx:oneuserdata.carmodel.code,
                        }
                        quanZhouData.getStudentCourseInfo(searchinfo,function(err,coursedata){
                            if(err){
                                console.log("获取学生课时信息出错："+oneuserdata._id+oneuserdata.name+err.message);
                                cb();
                            }
                            if(coursedata){
                                usercoursesave(oneuserdata._id,coursedata,function(err,data){
                                    if(err){
                                        console.log("保存学生课时信息出错："+oneuserdata._id+oneuserdata.name+err.message);
                                    }
                                    cb();
                                })
                            }
                            else {
                                console.log("没有查询到课程信息："+oneuserdata._id+oneuserdata.name);
                                cb();
                            }


                        })
                    }
                    // 存在身份证号
                    else if (oneuserdata.idcardnumber&&oneuserdata.idcardnumber.length>0){
                        console.log("根据身份证号查询课时："+oneuserdata.idcardnumber);
                        var searchinfo={
                            userid:schoolinfo.userid,
                            "mac":schoolinfo.mac,
                            "xybh":"",
                            "xm":"",
                            "sfzh":oneuserdata.idcardnumber,
                            "bmrq_qs":"2000/3/22",
                            "bmrq_zz":new Date().toFormat("YYYY/MM/DD"),
                            "drivecode":schoolinfo.drivecode,

                        };
                        quanZhouData.getStudentCourseBySFZH(searchinfo,function(err,coursedata){
                            if(err){
                                console.log("获取学生课时信息出错："+oneuserdata._id+oneuserdata.name+err.message);
                                cb();
                            }
                            if(coursedata){
                                usercoursesave(oneuserdata._id,coursedata,function(err,data){
                                    if(err){
                                        console.log("保存学生课时信息出错："+oneuserdata._id+oneuserdata.name+err.message);
                                    }
                                    cb();
                                })
                            }
                            else {
                                console.log("没有查询到课程信息："+oneuserdata._id+oneuserdata.name);
                                cb();
                            }

                        })
                    }
                    else {
                        console.log("学生信息不完整，无法查询课时："+oneuserdata._id+oneuserdata.name);
                        cb();
                    }

                },
                function(err) {
                    console.log("kogn")
                    if (err) {
                        console.error(new Date().toString() + '同步驾校学员学时出错' + schoolinfo.schoollid + err);
                    }
                    return callback(err);
                }
            );

        })
};
try {


    //var j = schedule.scheduleJob(rule, function() {
    //
    //    console.log(new Date().toString()+'开始同步驾校学员学时');
    //    syncQuanZhouData(syncConfig.syncdataconfig.quanzhouschool,function(err,data){
    //        console.log(new Date().toString()+'同步驾校学员学时完成');
    //    })
    //
    //})

}catch(e){
    console.error(new Date().toString()+'同步驾校学员学时出错'+ e.message);

}