/**
 * Created by v-lyf on 2015/9/6.
 */

var mongodb = require('../models/mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var appTypeEmun=require("../custommodel/emunapptype");
require('date-utils');

exports.GetCoachCourse=function(coachid,date ,callback){
    coachmode.findById(new mongodb.ObjectId(coachid),function(err,coachdata){
        if(err){
           return callback("查询教练出错："+err);
        }
        if(!coachdata) {
            return callback("不存在该教练的信息");
        }
        if(coachdata.is_validation==false){
            return callback("该教练没有通过验证，无法获取训练信息");
        }
        if(coachdata.is_lock==true){
            return callback("该教练已经被锁定，无法获取训练信息");
        }
        if(coachdata.worktime.length==0){
            return callback("该教练没有设置工作时间，无法获取训练信息");
        }
        // 判断星期
        var temptime=new Date(date);
        var i=temptime.getDay();
        if(i==0){i=7}
        //console.log(coachdata.workweek);

        var index=coachdata.workweek.indexOf(i);
        if(index==-1){
            return callback("该教练今天不工作");
        }
        coursemode.findCourse(coachid,date,function(err,coursedata){
         if(err){
             return callback("查询课程信息出错："+err);
         }

            if(!coursedata||coursedata.length==0){
                    //console.log( coachdata.worktime);
                savecourse(coachdata,coachid,date,function(err,data){
                    var list=[];
                    if (coachdata.leaveendtime!=undefined&& coachdata.leaveendtime>Date.now()) {
                        data.forEach(function (r, index) {
                            if (r.courseendtime <= coachdata.leavebegintime|| r.coursebegintime>=coachdata.leaveendtime){
                                list.push(r);
                            }
                                }
                            )
                        }
                    else{
                        list=data;
                    }
                    return callback(null,list);
                })

            } else{
                var list=[];
                if (coachdata.leaveendtime!=undefined&& coachdata.leaveendtime>Date.now()) {
                    coursedata.forEach(function (r, index) {
                            if (r.courseendtime <= coachdata.leavebegintime|| r.coursebegintime>=coachdata.leaveendtime){
                                list.push(r);
                            }
                        }
                    )
                }
                else{
                    list=coursedata;
                }
                //list.sort(coursebegintime);
                return callback(null,list);
            }

        });
    });
};

var savecourse=function(coachdata,coachid,date,callback){
    process.nextTick(function() {
        var  courselist=[];
        var insertcount=coachdata.worktime.length;
        var count=0;
        coachdata.worktime.forEach(function (r) {

            var course = new coursemode;
            course.coachid = new mongodb.ObjectId(coachid);
            course.coursedate = new Date(date);
            course.coursestudentcount = coachdata.coursestudentcount ? coachdata.coursestudentcount : 1;
            course.coursetime.timeid = r.timeid;
            course.coursebegintime=new Date(course.coursedate.toFormat("YYYY-MM-DD")+" " +r.begintime);
            course.courseendtime=new Date(course.coursedate.toFormat("YYYY-MM-DD")+" " +r.endtime);
            course.coursetime.timespace = r.timespace;
            course.coursetime.begintime = r.begintime;
            course.coursetime.endtime = r.endtime;
            course.save(function (err, newcouse) {
                if (err || !newcouse) {
                    return callback("存储课程出错：" + err);
                }

                courselist.push(newcouse);
                count=count+1;
                //console.log("过程中：" + count);
                if(count==insertcount){
                    return callback(null,courselist);
                }

            });
            //console.log("过程外"+ count );
        });

    })
};
// 判断用户预约课程信息
VerificationCourse=function(courselist,userid,callback){
    var   coursecount=courselist.length;
    var count=0;
    courselist.forEach(function(r){
        coursemode.findOne(new mongodb.ObjectId(r),function(err,coursedata){
            if(err||!coursedata){
                return callback("查询课程出错："+err);
            }
            if(  coursedata.selectedstudentcount>=coursedata.coursestudentcount){
                return callback("选择人数超过课程最大人数");
            }
            var idx = coursedata.courseuser.indexOf(new mongodb.ObjectId(userid));
            if (idx != -1) {
                return callback("您已经选择该课程了");
            }
            count=count+1;
            if (count>=coursecount){
                return callback(null);
            }
        });
    });
}

syncReservationdesc=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("subject subjecttwo  subjectthree")
        .exec(function(err,userdata) {
            if(userdata){
                if(userdata.subject.subjectid==2||userdata.subject.subjectid==3){
                    reservationmodel.find({userid:new mongodb.ObjectId(userid),"subject.subjectid":userdata.subject.subjectid
                    ,"$or":[{reservationstate:appTypeEmun.ReservationState.applying},{reservationstate:appTypeEmun.ReservationState.applyconfirm},
                            {reservationstate:appTypeEmun.ReservationState.unconfirmfinish} ]})
                        .select("_id coursehour subject")
                        .sort({begintime:1})
                    .exec(function(err,reservationlist){
                        var   currentcoursecount=userdata.subject.subjectid==2?userdata.subjecttwo.finishcourse :userdata.subjectthree.finishcourse
                        process.nextTick(function(){
                            reservationlist.forEach(function(r,index){
                                var  tempcount = currentcoursecount+1;
                                currentcoursecount=currentcoursecount+ r.coursehour;
                                var tempendcount=currentcoursecount;
                                var desc="";
                                if(tempcount==tempendcount){
                                    desc=userdata.subject.name +"第"+ (tempcount)+"课时";
                                }else if(tempendcount-tempcount==1){
                                    desc=userdata.subject.name +"第"+ (tempcount)+","+(tempendcount)+"课时";
                                }
                                else{
                                    desc=userdata.subject.name +"第"+ (tempcount)+"--"+(tempendcount)+"课时";
                                }
                                reservationmodel.update({_id:new mongodb.ObjectId(r._id)},{$set:{startclassnum:tempcount,
                                    endclassnum:tempendcount, courseprocessdesc:desc}},{safe: true, multi: true})
                            })
                        })
                    })
                }
            }
        });
}
// 提交预约课程
exports.postReservation=function(reservationinfo,callback){
    usermodel.findById(new mongodb.ObjectId(reservationinfo.userid),function(err,userdata) {
        if (err | !userdata) {
            return callback("不能找到此用户" + err);
        }
        //判断用户状态
        if (userdata.is_lock == true) {
            return callback("此用户已锁定，请联系客服");
        }
        //判断用户的预约权限
        if (userdata.applystate != 2) {
            return callback("用户没有报名的权限");
        }
        if (userdata.subject.subjectid != 2 && userdata.subject.subjectid != 3) {
            return callback("该用户现阶段不能预约课程:" + userdata.subject.name);
        }
        arr = reservationinfo.courselist.split(',');
        coursecount = arr.length;
        if (coursecount <= 0) {
            return callback("无法确定您的选择课程");
        }
        coachmode.findById(new mongodb.ObjectId(reservationinfo.coachid), function (err, coachdata) {
            if(err|| !coachdata){
                return callback("查询教练出错："+err);
                if (coachdata.is_lock){
                    return callback("该教练被锁定：");
                }
                if (!coachdata.is_validation){
                    return callback("该教练没有通过验证不能预约：");
                }
                // 判断科目、、if(userdata.subject.subjectid==)
                // 判断车型 C1 C2
                if(usermodel.carmodel.modelsid!=coachdata.carmodel.modelsid){
                    return callback("您所报的驾照类型与该教练教的不同，无法报名");
                }
                // 判断班级
                if(coachdata.serverclasslist.indexOf(userdata.applyclasstype)==-1){
                    return callback("该教练不服务您所报的班级，无法报名");
                }

            }
            VerificationCourse(arr, reservationinfo.userid, function (err) {
                if (err) {
                    return callback("验证课程出错：" + err);
                }
                var currentcoursecount=0;
                if (userdata.subject.subjectid == 2) {

                    //判断用户预约课程数量
                    if (userdata.subjecttwo.reservation + coursecount > userdata.subjecttwo.totalcourse) {
                        return callback("预约课程数量超出最大课程");
                    }

                    currentcoursecount =userdata.subjecttwo.finishcourse+ userdata.subjecttwo.reservation;
                    userdata.subjecttwo.reservation = userdata.subjecttwo.reservation + coursecount;

                }
                else if (userdata.subject.subjectid == 3) {
                    if (userdata.subjectthree.reservation + coursecount > userdata.subjectthree.totalcourse) {
                        return callback("预约课程数量超出最大课程");
                    }
                    currentcoursecount=userdata.subjectthree.finishcourse+userdata.subjecttwo.subjectthree;
                    userdata.subjectthree.reservation = userdata.subjectthree.reservation + coursecount;
                }
                else {
                    return callback("不存在该阶段");
                }


                    // 保存预约信息
                    var reservation = new reservationmodel();
                    reservation.startclassnum=currentcoursecount+1;
                    reservation.endclassnum=currentcoursecount+coursecount;
                    reservation.courseprocessdesc=userdata.subject.name +" 第"+ (currentcoursecount+1)+" --"+(currentcoursecount+coursecount)+"课时";
                    reservation.userid = new mongodb.ObjectId(reservationinfo.userid);
                    reservation.coachid = new mongodb.ObjectId(reservationinfo.coachid);
                    reservation.is_shuttle = reservationinfo.is_shuttle ? (reservationinfo.is_shuttle == 1 ? true : false) : false;
                    reservation.shuttleaddress = reservationinfo.address ? reservationinfo.address : "";
                    reservation.reservationcreatetime = new Date();
                    reservation.reservationstate = appTypeEmun.ReservationState.applying;
                    reservation.trainfieldid=coachdata.trainfield;
                reservation.trainfieldlinfo.id=coachdata.trainfieldlinfo.id;
                reservation.trainfieldlinfo.name=coachdata.trainfieldlinfo.name;

                    reservation.begintime = new Date(reservationinfo.begintime);
                    reservation.endtime = new Date(reservationinfo.endtime);
                    reservation.classdatetimedesc= (new Date(reservationinfo.begintime)).toFormat("YYYY年MM月DD日 HH24:00") +"--"
                        +(new Date(reservationinfo.endtime)).toFormat("HH24:00");;
                    reservation.subject = userdata.subject;
                    reservation.coursehour = coursecount;
                    arr.forEach(function (r) {
                        reservation.reservationcourse.push(new mongodb.ObjectId(r));
                    });
                    //console.log(reservation);
                    reservation.save(function (err, newreservation) {
                        if (err) {
                            return callback("保存预约出错：" + err);
                        }
                        // 保存课程人员和预约信息
                        //console.log("保存课程信息");
                        arr.forEach(function (r) {
                            coursemode.findOne(new mongodb.ObjectId(r), function (err, coursedata) {
                                coursedata.selectedstudentcount = coursedata.selectedstudentcount + 1;
                                coursedata.courseuser.push(new mongodb.ObjectId(userdata._id));
                                coursedata.coursereservation.push(new mongodb.ObjectId(newreservation._id));
                                coursedata.save(function (err, data) {

                                });
                            });
                        });
                        // 保存用户信息里面的预约信息
                        // console.log("保存用户信息");
                        userdata.save(function (err, data) {
                            if (err) {
                                return callback("保存预约出错：" + err);
                            }
                            syncReservationdesc(data._id);
                            // console.log("返回成果");
                            return callback(null, "success");
                        });

                    });

                });
            });

    });
};


//获取用户的预约信息
exports.getuserReservation=function(userid,subjectid,callback){
    reservationmodel.find({userid:new mongodb.ObjectId(userid),"subject.subjectid":subjectid})
        .select("coachid reservationstate reservationcreatetime subject shuttleaddress classdatetimedesc " +
        "courseprocessdesc trainfieldlinfo  is_comment")
        .populate("coachid","_id name driveschoolinfo headportrait")
       .sort({begintime:-1})
        .exec(function(err,reservationlist){
            if(err){
             return    callback("查询语言信息出错："+err)
            }
            process.nextTick(function(){
                var list=[]
                reservationlist.forEach(function(r,index){
                    var listone= {
                        _id: r._id,
                        coachid: r.coachid,
                        reservationstate: r.is_comment?appTypeEmun.ReservationState.finish: r.reservationstate,
                        reservationcreatetime: r.reservationcreatetime,
                        subject: r.subject,
                        is_shuttle: r.is_shuttle,
                        shuttleaddress: r.shuttleaddress,
                        courseprocessdesc: r.courseprocessdesc,
                        classdatetimedesc: r.classdatetimedesc,
                        trainfieldlinfo: r.trainfieldlinfo
                    }
                    list.push(listone);
                })
                return callback(null,list);
            })
        });
};
// 获取课程的详细信息
exports.getCourseDeatil=function(courseid,callback){
    coursemode.findById(new mongodb.ObjectId(courseid))
        .populate("User")
        .exec(function(err,data){
            if(err){
                callback("查询课程出错："+err);
            }
            callback(null,data);
        })
};

// 用户取消预约
exports.userCancelReservation=function(reservation,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(reservation.reservationid),userid:new mongodb.ObjectId(reservation.userid)},function(err,resdata){
        if(err){
          return  callback("查询预约课程出错："+err);
        }
        if(!resdata||resdata.length==0){
          return   callback("没有找到该预约信息");
        }
        //console.log(resdata.reservationstate);
        if(resdata.reservationstate!=appTypeEmun.ReservationState.applying&&
            resdata.reservationstate!=appTypeEmun.ReservationState.applyconfirm){
          return   callback("该预约的状态无法取消");
        }
        var  now=new Date();
        if(resdata.begintime==undefined)
        {
            return callback("无法确认课程时间，无法取消预约")
        }
        if (now.getHoursBetween(resdata.begintime)<24){
          return   callback("该时间段不能取消");
        }
        resdata.reservationstate=appTypeEmun.ReservationState.applycancel;
        resdata.cancelreason.reason=reservation.cancelreason;
        resdata.cancelreason.cancelcontent=reservation.cancelcontent;

        // 修改预约状态
        resdata.save(function(err,newdata){
            // 修改课程表中预约信息
            process.nextTick(function(){
                newdata.reservationcourse.forEach(function(r){
                    coursemode.findOne(new mongodb.ObjectId(r),function(err,coursedata){
                        coursedata.selectedstudentcount=coursedata.selectedstudentcount-1;
                        var index=coursedata.courseuser.indexOf(new mongodb.ObjectId(reservation.userid))
                        if(index!=-1){
                            coursedata.courseuser.splice(index,1);
                        }
                        var index2=coursedata.coursereservation.indexOf(new mongodb.ObjectId(resdata._id));
                        if(index2!=-1){
                            coursedata.coursereservation.splice(index2,1);
                        }
                        coursedata.save(function(err,data){

                        });
                })
            })
            // 修改个人信息中的语言信息
                usermodel.findById(new mongodb.ObjectId(reservation.userid),function(err,data){
                    if (newdata.subject.subjectid==2){
                        data.subjecttwo.reservation=data.subjecttwo.reservation-newdata.coursehour;
                    }
                    if (newdata.subject.subjectid==3){
                        data.subjectthree.reservation=data.subjectthree.reservation-newdata.coursehour;
                    }
                    data.save(function(err){
                        if (err){
                            return callback("取消课程出错");
                        }
                        syncReservationdesc(reservation.userid);
                        return callback(null,"success");
                    })
                })


        });


    });
});
}
exports.userfinishReservation=function(reservationinfo,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(reservationinfo.reservationid)},function(err,resdata){
        //userid:new mongodb.ObjectId(userid)
        if(err){
            return  callback("查询预约课程出错："+err);
        }
        if(!resdata){
            return callback("没有找到该预约信息");
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.unconfirmfinish){
            return  callback("该预约状态下不能确认完成");
        }
        var  now=new Date();
        if ((now-resdata.endtime)<0){
            return callback("课程没有上完不能确认完成");
        }
        resdata.reservationstate=appTypeEmun.ReservationState.ucomments;
        resdata.learningcontent=reservationinfo.learningcontent;
        resdata.contentremarks=reservationinfo.contentremarks;
        if (resdata.startclassnum!=undefined && resdata.startclassnum !=undefined)
        {
            var tempstr="";
            if (resdata.startclassnum ==resdata.endclassnum){
                tempstr= " 第"+ (resdata.startclassnum)+"课时";
            }else if(resdata.endclassnum-resdata.startclassnum==1){
                tempstr= " 第"+ (resdata.startclassnum)+","+( resdata.endclassnum)+"课时";
            }else{
                tempstr= " 第"+ (resdata.startclassnum)+"--"+( resdata.endclassnum)+"课时";
            }
                resdata.courseprocessdesc=resdata.subject.name+ tempstr+"  "+
        reservationinfo.learningcontent?reservationinfo.learningcontent:"";
        }
        else{
            resdata.courseprocessdesc=resdata.subject.name+"  "+reservationinfo.learningcontent?reservationinfo.learningcontent:"";
        }
        resdata.finishtime=new Date();
        resdata.save(function(err,newdata){
            if(err){
                callback("保存出错："+err);
            }
            // 修改个人信息中的语言信息
            usermodel.findById(new mongodb.ObjectId(newdata.userid),function(err,data){

                if (newdata.subject.subjectid==2){
                    data.subjecttwo.reservation=data.subjecttwo.reservation-newdata.coursehour;;
                    data.subjecttwo.finishcourse=data.subjecttwo.finishcourse+newdata.coursehour;
                    data.subjecttwo.progress=resdata.courseprocessdesc;
                    data.subjecttwo.reservationid=reservationinfo.reservationid;
                }
                if (newdata.subject.subjectid==3){
                    data.subjectthree.reservation=data.subjectthree.reservation-newdata.coursehour;
                    data.subjectthree.finishcourse=data.subjectthree.finishcourse+newdata.coursehour;
                    data.subjectthree.progress=resdata.courseprocessdesc;
                    data.subjectthree.reservationid=reservationinfo.reservationid;
                }
                //console.log(data);
                data.save(function(err){
                    if (err){
                        return callback("确认完成出错："+err);
                    }
                    return callback(null,"success");
                })
            })

          //  return callback(null,"success");
        })

    });
};

// 用户投诉信息
exports.userComplaint=function(complaintinfo,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(complaintinfo.reservationid),
        userid:new mongodb.ObjectId(complaintinfo.userid)},function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出粗："+err);
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.finish&&
            resdata.reservationstate!=appTypeEmun.ReservationState.ucomments) {
            return callback("课程没有完成不能投诉：");
        }
        if(resdata.is_complaint==true){
        return callback("您已经投诉了，请等待结果");
        }
        resdata.is_complaint=true;
        resdata.complaint.reason=complaintinfo.reason;
        resdata.complaint.complaintcontent=complaintinfo.complaintcontent;
        resdata.complaint.complainttime=Date.now();
        resdata.save(function(err,data){
            if(err){
                return callback("保存投诉出错");
            }
            return callback(null,"success");
        })


    });
};
// 用户评论信息
exports.userComment=function(commnetinfo,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(commnetinfo.reservationid),
        userid:new mongodb.ObjectId(commnetinfo.userid)},function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出错："+err);
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.ucomments)
        {
            return callback("课程没有完成不能评论：");
        }
        resdata.is_comment=true;
        resdata.comment.starlevel=commnetinfo.starlevel;
        resdata.comment.attitudelevel=commnetinfo.attitudelevel;
        resdata.comment.timelevel=commnetinfo.timelevel;
        resdata.comment.abilitylevel=commnetinfo.abilitylevel;
        resdata.comment.commentcontent=commnetinfo.commentcontent;
        resdata.comment.commenttime=Date.now();
        if(resdata.is_coachcomment){
            resdata.reservationstate=appTypeEmun.ReservationState.finish;
        }
        resdata.save(function(err,data){
            if(err){
                return callback("保存评论出错");
            }
            return callback(null,"success");
        })


    });
};

// 教练评论信息
exports.coachComment=function(commnetinfo,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(commnetinfo.reservationid),
        coachid:new mongodb.ObjectId(commnetinfo.coachid)},function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出粗："+err);
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.finish &&
            resdata.reservationstate!=appTypeEmun.ReservationState.ucomments
        )
        {
            return callback("预约没有完成不能评论：");
        }
        resdata.is_coachcomment=true;
        resdata.coachcomment.starlevel=commnetinfo.starlevel;
        resdata.coachcomment.attitudelevel=commnetinfo.attitudelevel;
        resdata.coachcomment.timelevel=commnetinfo.timelevel;
        resdata.coachcomment.abilitylevel=commnetinfo.abilitylevel;
        resdata.coachcomment.commentcontent=commnetinfo.commentcontent;
        resdata.coachcomment.commenttime=Date.now();
        if(resdata.is_comment){
            resdata.reservationstate=appTypeEmun.ReservationState.finish;
        }
        resdata.save(function(err,data){
            if(err){
                return callback("保存评论出错");
            }
            return callback(null,"success");
        })


    });
};
// 获取同时段学员
exports.getSameTimeStudents=function(reservationid,userid,index,callback){

    reservationmodel.findById(new mongodb.ObjectId(reservationid),function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出錯:"+err);
        }
        if (resdata.trainfieldid===undefined){
            return callback(null,[]);
        }
        reservationmodel.find({"trainfieldid":new mongodb.ObjectId(resdata.trainfieldid),"begintime":resdata.begintime,
        "reservationstate":{"$ne":2,"$ne":4}})
            .select("userid")
            .populate("userid","_id  name headportrait ")
            .skip((index-1)*10)
            .limit(10)
            .exec(function(err,data){
                if(err){
                    return callback("查询同时段学员出錯:"+t);
                }
                callback(null,data);
            })

    })
}


// 学员获取我预约过的教练列表
exports.getMyCoachList=function(userid,callback){
    //Model.distinct(field, conditions, callback);
    reservationmodel.find({"userid":new mongodb.ObjectId(userid)})
    //reservationmodel.distinct("coachid",{"userid":new mongodb.ObjectId(userid)})
        .select("coachid")
        //.distinct("coachid")
        .populate("coachid","_id  name headportrait  starlevel  is_shuttle driveschoolinfo latitude longitude")
        .exec(function(err,data){
            if(err||!data){
                return callback("查询出錯:"+err);
            }
            if (data){
                //console.log(data);
                process.nextTick(function() {
                    rescoachlist=[];
                    data.forEach(function (r, idx) {
                        var returnmodel  = { //new resbasecoachinfomode(r);
                            coachid : r.coachid._id,
                            /*distance : geolib.getDistance(
                             {latitude: latitude, longitude: longitude},
                             {latitude: r.latitude, longitude: r.longitude},
                             10
                             ),*/
                            name: r.coachid.name,
                            driveschoolinfo: r.coachid.driveschoolinfo,
                            headportrait: r.coachid.headportrait,
                            starlevel: r.coachid.starlevel,
                            passrate: r.coachid.passrate,
                            Seniority: r.coachid.Seniority,
                            is_shuttle: r.coachid.is_shuttle,
                            latitude: r.coachid.latitude,
                            longitude: r.coachid.longitude

                        }
                        //  r.restaurantId = r._id;
                        // delete(r._id);
                        rescoachlist.push(returnmodel);
                    });
                    var sortlist=rescoachlist.unique2();
                    callback(null, sortlist);
                });
            }
        });
}
Array.prototype.unique2 = function()
{
    var n = {},r=[]; //n为hash表，r为临时数组
    for(var i = 0; i < this.length; i++) //遍历当前数组
    {
        if (!n[this[i]]) //如果hash表中没有当前项
        {
            n[this[i]] = true; //存入hash表
            r.push(this[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
}
//获取教练或者用户得到的哦评论信息
exports.GetComment=function(queryinfo,callback){
    if(queryinfo.type==appTypeEmun.UserType.User){
        reservationmodel.find({"userid":new mongodb.ObjectId(queryinfo.userid),"is_coachcomment":"true"})
            .select("coachid coachcomment finishtime")
            .populate("coachid","_id  name headportrait  ")
            .skip((queryinfo.index-1)*10)
            .limit(10)
            .sort({"begintime":-1})
            .exec(function(err,data){
                if(err){
                    return callback("查询评论出错："+err);
                }
                return callback(null,data);
            })
    }else if(queryinfo.type==appTypeEmun.UserType.Coach){
        reservationmodel.find({"coachid":new mongodb.ObjectId(queryinfo.userid),"is_comment":"true"})
            .select("userid comment finishtime")
            .populate("userid","_id  name headportrait  ")
            .skip((queryinfo.index-1)*10)
            .limit(10)
            .sort({"begintime":-1})
            .exec(function(err,data){
                if(err){
                    return callback("查询评论出错："+err);
                }
                return callback(null,data);
            })
    }
}
// 教练 获取某一天的上课信息
exports.getCoachDaysreservation=function(coachid,date,callback){
    var datenow =new Date(date);
    var datetomorrow = datenow.addDays(1);
    reservationmodel.find( { coachid:new mongodb.ObjectId(coachid)
        ,begintime: { $gte: (new Date(date)).clearTime(), $lte:datetomorrow.clearTime()}})
        .select("userid reservationstate reservationcreatetime begintime endtime subject " +
        "is_shuttle shuttleaddress classdatetimedesc courseprocessdesc is_coachcomment")
        .populate( "userid"," _id  name headportrait ")
        .sort({"begintime":1})
        .exec(function(err,data){
            if(err){
                return callback("查询数据出错："+err);
            }
            process.nextTick(function(){
                var list=[]
                data.forEach(function(r,index){
                    var listone= {
                        _id: r.id,
                        userid: r.userid,
                        reservationstate: r.is_coachcomment?appTypeEmun.ReservationState.finish: r.reservationstate,
                        reservationcreatetime: r.reservationcreatetime,
                        courseprocessdesc: r.courseprocessdesc,
                        begintime :(r.begintime).toFormat("HH:00"),
                        endtime :(r.endtime).toFormat("HH:00")
                }
                    list.push(listone);
                })
                return callback(null,list);
            })

        })
}
// 处理教练的请假申请
exports.saveCoachLeaveInfo=function(leaveinfo ,callback){
    var datebegin=(new Date(leaveinfo.begintime*1000));
    var endtime=(new Date(leaveinfo.endtime*1000));
    coursemode.find({"coachid":new mongodb.ObjectId(leaveinfo.coachid),
    $or:[{ "coursebegintime":{ $gte: datebegin, $lt:endtime}},{"courseendtime":{$gte: datebegin, $lt:endtime}}],
    selectedstudentcount:{$gt:0}
    },function(err,course){
        if(err){
            return callback ("查询课程出错"+err);
        }
        if(course&&course.length>0){
            return callback ("请假时间内有预约课程，请取消后再请假");
        }

        coachmode.findById(new mongodb.ObjectId(leaveinfo.coachid),function(err,data){
            if(err){
                return callback("查询教练出错");
            }
            console.log(leaveinfo)
            data.leavebegintime=datebegin;
            data.leaveendtime=endtime;
            data.save();
            return callback(null,"success");
        })
    });
}
// 教练获取我的预约列表
exports.getCoachReservationList=function(queryinfo,callback){
    reservationmodel.find( { coachid:new mongodb.ObjectId(queryinfo.coachid)})
        .select("userid reservationstate reservationcreatetime  subject is_shuttle shuttleaddress classdatetimedesc " +
        " courseprocessdesc trainfieldlinfo  is_coachcomment")
        .populate("userid","_id  name headportrait")
        .skip((queryinfo.index-1)*10)
        .limit(10)
        .sort({"reservationcreatetime":-1})
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
                        reservationstate: r.is_coachcomment?appTypeEmun.ReservationState.finish: r.reservationstate,
                        reservationcreatetime: r.reservationcreatetime,
                        subject: r.subject,
                        is_shuttle: r.is_shuttle,
                        shuttleaddress: r.shuttleaddress,
                        courseprocessdesc: r.courseprocessdesc,
                        classdatetimedesc: r.classdatetimedesc,
                        trainfieldlinfo: r.trainfieldlinfo
                    }
                    list.push(listone);
                })
                return callback(null,list);
            })
        })
}
// 教练获取没有处理的预约申请
exports.getreservationapply=function(coachid,callback){
    reservationmodel.find( { coachid:new mongodb.ObjectId(coachid),"reservationstate":appTypeEmun.ReservationState.applying})
        .select("userid reservationstate reservationcreatetime begintime endtime subject is_shuttle shuttleaddress classdatetimedesc")
        .populate("userid","_id  name headportrait applyschoolinfo")
        .sort({"begintime":-1})
        .exec(function(err,data){
            if(err){
                return callback("查询数据出错："+err);
            }
            return callback(null,data);
        })
}
//  获取学员预约详情
exports.getUserReservationinfo=function(reservationid,userid,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(reservationid),
        userid:new mongodb.ObjectId(userid)})
        .select(" reservationstate reservationcreatetime is_shuttle shuttleaddress " +
        "  courseprocessdesc classdatetimedesc trainfieldlinfo coachid subject is_comment")
        .populate("coachid","_id  name headportrait  driveschoolinfo")
        .exec(function(err,resdata){
            if(err){
                return callback("查询数据出错："+err);
            }
            resdata.reservationstate=is_comment?appTypeEmun.ReservationState.finish: resdata.reservationstate,
                resdata.is_comment=undefined;
            return callback(null,resdata);})

}
exports.getCoachReservationinfo=function(reservationid,coachid,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(reservationid),
        coachid:new mongodb.ObjectId(coachid)})
        .select(" reservationstate reservationcreatetime is_shuttle shuttleaddress " +
        "  courseprocessdesc classdatetimedesc trainfieldlinfo userid cancelreason subject is_coachcomment")
        .populate("userid","_id  name headportrait displayuserid")
        .exec(function(err,resdata){
            if(err){
                return callback("查询数据出错："+err);
            }
            if(resdata.reservationstate!=appTypeEmun.ReservationState.applycancel&&resdata.reservationstate!=appTypeEmun.ReservationState.applyrefuse){
                resdata.cancelreason=undefined;
            }
            resdata.reservationstate=resdata.is_coachcomment?appTypeEmun.ReservationState.finish: resdata.reservationstate,
                resdata.is_coachcomment=undefined;
           // console.log(resdata);
            return callback(null,resdata);})

}
//教练处理预约信息聚聚还是接受
exports.coachHandleInfo=function(handleinfo,callback){
    reservationmodel.findOne({_id:new mongodb.ObjectId(handleinfo.reservationid),
        coachid:new mongodb.ObjectId(handleinfo.coachid)},function(err,resdata){
        if(err){
            return callback("查询预约信息出粗："+err);
        }
        if (!resdata){
            return callback("没有查到相关预约");
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.applying&& resdata.reservationstate!=appTypeEmun.ReservationState.applyconfirm)
        {
            return callback("不能修改预约信息");
        }
        if(handleinfo.handletype!=appTypeEmun.ReservationState.applyconfirm &&
            handleinfo.handletype!=appTypeEmun.ReservationState.applyrefuse)
        {
            return callback("处理信息类型不对");
        }

        if ( resdata.reservationstate==appTypeEmun.ReservationState.applyconfirm&& handleinfo.handletype==appTypeEmun.ReservationState.applyrefuse)
        {
            var  now=new Date();
            if(resdata.begintime==undefined)
            {
                return callback("无法确认课程时间，无法取消预约")
            }
            if (now.getHoursBetween(resdata.begintime)<24){
                return   callback("该时间段不能取消");
            }
        }
        resdata.reservationstate=handleinfo.handletype;
        resdata.cancelreason.reason=handleinfo.cancelreason;
        resdata.cancelreason.cancelcontent=handleinfo.cancelcontent;
        resdata.save(function(err,newdata){
            if(err){
                return callback("处理信息错误："+err);
            }

            if(handleinfo.handletype==appTypeEmun.ReservationState.applyrefuse){
                process.nextTick(function(){
                    newdata.reservationcourse.forEach(function(r){
                        coursemode.findOne(new mongodb.ObjectId(r),function(err,coursedata){
                            coursedata.selectedstudentcount=coursedata.selectedstudentcount-1;
                            var index=coursedata.courseuser.indexOf(new mongodb.ObjectId(newdata.userid))
                            if(index!=-1){
                                coursedata.courseuser.splice(index,1);
                            }
                            var index2=coursedata.coursereservation.indexOf(new mongodb.ObjectId(resdata._id));
                            if(index2!=-1){
                                coursedata.coursereservation.splice(index2,1);
                            }
                            coursedata.save(function(err){
                                if(err){
                                    console.log(err);
                                }

                            });
                        })
                    })
                    // 修改个人信息中的语言信息
                    usermodel.findById(new mongodb.ObjectId(newdata.userid),function(err,data){
                        if (newdata.subject.subjectid==2){
                            data.subjecttwo.reservation=data.subjecttwo.reservation-newdata.coursehour;
                        }
                        if (newdata.subject.subjectid==3){
                            data.subjectthree.reservation=data.subjectthree.reservation-newdata.coursehour;
                        }
                        data.save(function(err){
                            if (err){
                                return callback("取消课程出错");
                            }
                            syncReservationdesc(newdata.userid);
                            return callback(null,"success");
                        })
                    })


                });
            }
            return callback(null,"success");
        })


    });
};
