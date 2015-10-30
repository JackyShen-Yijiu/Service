

var mongodb = require('./mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var classtype = mongodb.ClassTypeModel;
var schoolModel=mongodb.DriveSchoolModel;
var schoolclassModel=mongodb.ClassTypeModel;
var appTypeEmun=require("../custommodel/emunapptype");
require('date-utils');


syncReservationdesc=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("subject subjecttwo  subjectthree")
        .exec(function(err,userdata) {
            if(userdata){
                if(userdata.subject.subjectid==2||userdata.subject.subjectid==3){
                    reservationmodel.find({userid:new mongodb.ObjectId(userid),"subject.subjectid":userdata.subject.subjectid
                        ,"$or":[{reservationstate:appTypeEmun.ReservationState.applying},{reservationstate:appTypeEmun.ReservationState.applyconfirm},
                            {reservationstate:appTypeEmun.ReservationState.unconfirmfinish} ]})
                        .select("coursehour subject")
                        .sort({begintime:1})
                        .exec(function(err,reservationlist){
                            var   currentcoursecount=userdata.subject.subjectid==2?userdata.subjecttwo.finishcourse :userdata.subjectthree.finishcourse
                            process.nextTick(function(){
                                reservationlist.forEach(function(r,index){
                                    var  tempcount = currentcoursecount+1;
                                    currentcoursecount=currentcoursecount+ r.coursehour;
                                    var tempendcount=currentcoursecount;
                                    var desc=userdata.subject.name +"第"+ (tempcount)+" --"+(tempendcount)+"课时";
                                    reservationmodel.update({_id:new mongodb.ObjectId(r._id)},{$set:{startclassnum:tempcount,
                                        endclassnum:tempendcount, courseprocessdesc:desc}})
                                })
                            })
                        })
                }
            }
        });
}

syncReservationdesc("562b56a1d12df5bb08df4676",function(){

})
// 修改时间
reservationmodel.find({},function(err,data){
    data.forEach(function(r,index){
       /* var begintime= r.begintime;
            var endtime = r.endtime;
      //  r.classdatetimedesc= (new Date(r.begintime)).format("yyyy-MM-dd HH:00:00"); +"--"+(new Date(r.endtime)).format("HH:00:00");

        //r.courseprocessdesc="科目二 第7-8学时";
       // r.subjectprocess="";*/
        //r.trainfieldlinfo.name="海淀练场"; //训练成信息信息
      //  r.trainfieldlinfo.id="561636cc21ec29041a9af88e";
      //  console.log(r);
      /*  if (r.trainfieldlinfo.name===undefined){
            console.log("dfdfd");
            r.trainfieldlinfo=undefined;
            r.trainfieldlinfo=undefined;
        }
*/
       // console.log(r.begintime);
      //  r.classdatetimedesc= r.begintime.toFormat("YYYY年MM月DD日 HH24:00") +"--"+(new Date(r.endtime)).toFormat("HH24:00");
     //   r.save(function(err,data)
     //   {console.log(data)});
    })

})

/*usermodel.find({},function(err,data) {
    data.forEach(function (r, index) {
        r.subjecttwo.progress="科目二弯道第六课时";
        r.subjectthree.progress="科目三综合练习第六课时";
        //r.usersetting.newmessagereminder = false;
       // r.usersetting.classremind = false;
       // r.usersetting.reservationreminder = false;
        r.save();
    })
})*/

// 修改课程类型
/*classtype.find({},function(err,data){
    var v1=    {
        id:1,
        name:"接送"}
    var v2= {
        id:4,
        name:"1:1"
    }
    data.forEach(function(r,index){
        r.vipserverlist.push(v1);
        r.vipserverlist.push(v2);
        r.save();
    })
})*/

/*coursemode.find({},function(err,data){
    data.forEach(function(r,index){
   console.log(r.coursedate.toFormat("YYYY-MM-DD")+" " +r.coursetime.begintime);
        console.log(new Date(r.coursedate.toFormat("YYYY-MM-DD")+" " +r.coursetime.begintime))
        console.log(new Date(r.coursedate.toFormat("YYYY-MM-DD")+" " +r.coursetime.endtime))
        r.coursebegintime=new Date(r.coursedate.toFormat("YYYY-MM-DD")+" " +r.coursetime.begintime);
        r.courseendtime=new Date(r.coursedate.toFormat("YYYY-MM-DD")+" " +r.coursetime.endtime);
        r.save();
        //coursemode.update({_id:new mongodb.ObjectId(r._id)},{$set:{coursebegintime:new Date(r.coursedate.toFormat("YYYY-MM-DD")+" " +r.coursetime.begintime)
       // ,courseendtime:new Date(r.coursedate.toFormat("YYYY-MM-DD")+" " +r.coursetime.endtime)}},function(err){
        //    console.log(err);
        //})
    })
})*/
//{$set:{"is_validation":true}}
/*
coachmode.update({is_validation:false},{$set:{"is_validation":true}},{safe: false, multi: true},function(err,data){
    console.log(data)
});*/

// 修改驾校价格

/*coachmode.find({createtime:{ "$gt": new Date().addMinutes(-100)}})
    .populate("driveschool")
    .exec(function(err,data)
{
     data.forEach(function(r,idnex){
         if(r.driveschoolinfo.name===undefined){
             coachmode.update({_id: r._id},{$set:{"driveschoolinfo.name": r.driveschool.name,
                 "driveschoolinfo.id": r.driveschool._id}},{safe: false, multi: true},
             function(err,data){
                 console.log(data);
             })
         }
     })
});*/
  console.log(new Date(1446091200*1000))
   // 时间测试
    var temptime=new Date("2015-10-31");
console.log(temptime)
var i=temptime.getDay();
console.log(i);