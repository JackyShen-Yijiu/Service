/**
 * Created by v-lyf on 2015/9/6.
 */

var mongodb = require('../models/mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var appTypeEmun=require("../custommodel/emunapptype");

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
        if(coachdata.worktime.length==0){
            return callback("该教练没有设置工作时间，无法获取训练信息");
        }
        coursemode.findCourse(coachid,date,function(err,coursedata){
         if(err){
             return callback("查询课程信息出错："+err);
         }

            if(!coursedata||coursedata.length==0){
                    //console.log( coachdata.worktime);
                savecourse(coachdata,coachid,date,function(err,data){
                    return callback(null,data);
                })

            } else{
                return callback(null,coursedata);
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
            course.coursetime.timespace = r.timespace;
            course.coursetime.begintime = r.begintime;
            course.coursetime.endtime = r.endtime;
            course.save(function (err, newcouse) {
                if (err || !newcouse) {
                    return callback("存储课程出错：" + err);
                }
                count=count+1;
                courselist.push(newcouse);
                if(count==insertcount){
                    return callback(null,courselist);
                }
                console.log("过程中：" + courselist);
            });

        });

    })
};

// 提交预约课程
exports.postReservation=function(reservationinfo,callback){
    usermodel.findById(new mongodb.ObjectId(reservationinfo.userid),function(err,userdata){
        if(err|!userdata)
        {
            return  callback("不能找到此用户"+err);
        }
        //判断用户状态
        if(userdata.is_lock==true)
        {
            return  callback("此用户已锁定，请联系客服");
        }
        //判断用户的预约权限
        if(userdata.applystate!=2)
        {
            return  callback("用户没有报名的权限");
        }
        if(userdata.subject.subjectid!=2&&userdata.subject.subjectid!=3){
            return  callback("该用户现阶段不能预约课程:"+userdata.subject.name);
        }
        arr = reservationinfo.courselist.split(',');
        coursecount=arr.length;
        if(userdata.subject.subjectid==2){

        //判断用户预约课程数量
        if(userdata.subjecttwo.reservation+coursecount>userdata.subjecttwo.totalcourse){
            return  callback("预约课程数量超出最大课程");
        }

        userdata.subjecttwo.reservation=userdata.subjecttwo.reservation+coursecount;}
        else if(userdata.subject.subjectid==3){
            if(userdata.subjectthree.reservation+coursecount>userdata.subjectthree.totalcourse){
                return  callback("预约课程数量超出最大课程");
            }

            userdata.subjectthree.reservation=userdata.subjectthree.reservation+coursecount;
        }
        else{
            return  callback("不存在该阶段");
        }

        // 保存预约信息
        var reservation=new  reservationmodel();
        reservation.userid=new mongodb.ObjectId(reservationinfo.userid);
        reservation.coachid=new mongodb.ObjectId(reservationinfo.coachid);
        reservation.is_shuttle=reservationinfo.is_shuttle? (reservationinfo.is_shuttle==1?true:false):false;
        reservation.shuttleaddress=reservationinfo.address? reservationinfo.address:"";
        reservation.reservationcreatetime=new Date();
        reservation.reservationstate=appTypeEmun.ReservationState.applying;
        reservation.bigintime=new Date(reservationinfo.begintime);
        reservation.endtime=new Date(reservationinfo.endtime);
        reservation.subject=userdata.subject;
        reservation.coursehour=coursecount;
        arr.forEach(function(r){
            reservation.reservationcourse.push(new mongodb.ObjectId(r) );
        });
        //console.log(reservation);
        reservation.save(function(err,newreservation){
         if(err){
             return callback("保存预约出错："+err);
         }
            // 保存课程人员和预约信息
            //console.log("保存课程信息");
            arr.forEach(function(r){
                coursemode.findOne(new mongodb.ObjectId(r),function(err,coursedata){
                    coursedata.selectedstudentcount=coursedata.selectedstudentcount+1;
                    coursedata.courseuser.push(new mongodb.ObjectId(userdata._id));
                    coursedata.coursereservation.push(new mongodb.ObjectId(newreservation._id));
                    coursedata.save(function(err,data){

                    });
                });
            });
            // 保存用户信息里面的预约信息
           // console.log("保存用户信息");
            userdata.save(function(err,data){
                if(err){
                    return callback("保存预约出错："+err);
                }
               // console.log("返回成果");
                return  callback(null,"success");
            });

        });



    });
};

//获取用户的预约信息
exports.getuserReservation=function(userid,callback){
    reservationmodel.find({userid:new mongodb.ObjectId(userid)})
        .populate("reservationcourse")
      // .sort({reservationcreatetime:-1})
        .exec(function(err,reservationlist){
            if(err){
             return    callback("查询语言信息出错："+err)
            }
            console.log(reservationlist);
            return callback(null,reservationlist);
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
exports.userCancelReservation=function(reservation,userid,callback){
    reservationmodel.find({_id:new mongodb.ObjectId(reservation),userid:new mongodb.ObjectId(reservation)},function(err,resdata){
        if(err){
            callback("查询预约课程出错："+err);
        }
        if(!resdata||resdata.length){
            callback("没有找到该语言信息");
        }
        if(resdata.reservationstate<appTypeEmun.ReservationState.applyrefuse){
            callback("该预约的状态无法取消");
        }
        var  now=new Date();
        if (((resdata.begindate-now)/(1000*3600))<24){
            return callback("该时间：不能取消");
        }
        resdata.reservationstate=appTypeEmun.ReservationState.applycancel;

    });
};
exports.userfinishReservation=function(reservation,userid,callback){
    reservationmodel.find({_id:new mongodb.ObjectId(reservation),userid:new mongodb.ObjectId(reservation)},function(err,resdata){
        if(err){
            return  callback("查询预约课程出错："+err);
        }
        if(!resdata||resdata.length){
            return callback("没有找到该预约信息");
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.applyconfirm){
            return  callback("该订单没有确认，不能完成");
        }
        var  now=new Date();
        if ((now-resdata.endtime)<0){
            return callback("该时间：不能取消");
        }
        resdata.reservationstate=appTypeEmun.ReservationState.finish;
        resdata.save(function(err,newdata){
            if(err){
                callback("保存出错："+err);
            }
            return callback(null,"success");
        })

    });
};

// 用户投诉信息
exports.userComplaint=function(complaintinfo,callback){
    reservationmodel.find({_id:new mongodb.ObjectId(complaintinfo.reservationid),
        userid:new mongodb.ObjectId(complaintinfo.userid)},function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出粗："+err);
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.finish)
        {
            return callback("预约没有完成不能投诉：");
        }
        resdata.is_complaint=true;
        resdata.complaint.reason=complaintinfo.reason;
        resdata.complaint.complaintcontent=complaintinfo.complaintcontent;
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
    reservationmodel.find({_id:new mongodb.ObjectId(commnetinfo.reservationid),
        userid:new mongodb.ObjectId(commnetinfo.userid)},function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出粗："+err);
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.finish)
        {
            return callback("预约没有完成不能投诉：");
        }
        resdata.is_comment=true;
        resdata.comment.starlevel=complaintinfo.starlevel;
        resdata.comment.commentcontent=complaintinfo.commentcontent;
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
    reservationmodel.find({_id:new mongodb.ObjectId(commnetinfo.reservationid),
        coachid:new mongodb.ObjectId(commnetinfo.coachid)},function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出粗："+err);
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.finish)
        {
            return callback("预约没有完成不能评论：");
        }

        resdata.coachcomment.starlevel=complaintinfo.starlevel;
        resdata.coachcomment.commentcontent=complaintinfo.commentcontent;
        resdata.save(function(err,data){
            if(err){
                return callback("保存评论出错");
            }
            return callback(null,"success");
        })


    });
};

//教练处理预约信息聚聚还是接受
exports.coachHandleInfo=function(handleinfo,callback){
    reservationmodel.find({_id:new mongodb.ObjectId(handleinfo.reservationid),
        coachid:new mongodb.ObjectId(handleinfo.coachid)},function(err,resdata){
        if(err||!resdata){
            return callback("查询预约信息出粗："+err);
        }
        if(resdata.reservationstate!=appTypeEmun.ReservationState.applying)
        {
            return callback("不能修改预约信息");
        }
        if(handleinfo.handletype!=4 &&handleinfo.handletype!=5)
        {
            return callback("处理信息类型不对");
        }
        resdata.reservationstate=handleinfo.handletype;
        resdata.save(function(err,data){
            if(err){
                return callback("处理信息错误："+err);
            }
            return callback(null,"success");
        })


    });
};
