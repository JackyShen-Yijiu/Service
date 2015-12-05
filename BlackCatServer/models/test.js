

var mongodb = require('./mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var classtype = mongodb.ClassTypeModel;
var schoolModel=mongodb.DriveSchoolModel;
var schoolclassModel=mongodb.ClassTypeModel;
var VipServerModel=mongodb.VipServerModel;
var SequenceModel=mongodb.SequenceModel;
var CourseWareModel=mongodb.CourseWareModel;
var appTypeEmun=require("../custommodel/emunapptype");
var mallProductModel=mongodb.MallProdcutsModel;
require('date-utils');
var async = require('async');



var updataschool=function(){
    coachmode.find()
        .select("_id driveschool")
        .exec(function(err,data){
            data.forEach(function(r,index){
                coachmode.update({_id: r._id} ,
                    { $set: { starlevel: 5 }},{safe: false, multi: true},function(err,doc){
                        console.log(doc);
                    })
             /*   reservationmodel.update({coachid: r._id} ,
                    { $set: { driveschool: r.driveschool }},{safe: false, multi: true},function(err,doc){
                        console.log(doc);
                    })
                coursemode.update({coachid: r._id} ,
                    { $set: { driveschool: r.driveschool }},{safe: false, multi: true},function(err,doc){
                        console.log(doc);
                    })*/
            })
        })
}
updataschool();
addcourseware=function(){
var courseware = new  CourseWareModel;
courseware.name="夜间行驶";
courseware.pictures="http://7xnjg0.com1.z0.glb.clouddn.com/yejianxingshi.png";
courseware.videourl="http://player.youku.com/embed/XMTM4MjkzNzMyNA==";
courseware.subject.subjectid=3;
courseware.subject.name="科目三";
courseware.save();

 /*var product  =new  mallProductModel;
    product.productname="iPhone4S 16G";
    product.productprice=5000;
    product.productimg="http://7xnjg0.com1.z0.glb.clouddn.com/qqQQ截图20151109155320.png";
    product.productdesc="iPhone4S 16G 金色 市场价 6000";
    product.viewcount=100;
    product.buycount=2;
    product.detailsimg="http://7xnjg0.com1.z0.glb.clouddn.com/qqQQ截图20151109155351.png";
    product.is_top=false;
    product.save();*/

}
//addcourseware();
/*classtype.find({},function(err,data){
data.forEach(function(r,index){
    var  list=[];
    list.push("563b4520075113ec38f286f2");
    list.push("563b4527994b335032480542");
    list.push("563b452a3c5ed25c350ac04a");
    r.vipserverlist=list;
    r.save(function(err,data){
        console.log(data);
    });
})
})*/


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
                                        endclassnum:tempendcount, courseprocessdesc:desc}},{safe: true, multi: true},
                                        function(err,data){
                                        console.log(data);
                                    })
                                })
                            })
                        })
                }
            }
        });
}


/*reservationmodel.update({userid:new mongodb.ObjectId("5615ce19193184140355c49f"),
        reservationstate:appTypeEmun.ReservationState.ucomments},
    {$set:{reservationstate:appTypeEmun.ReservationState.unconfirmfinish,is_comment:false}},{safe: true, multi: true},
    function(err,data){
        console.log(data);
    }) */

addserverlsit=function(){
    var vipserver=new VipServerModel;
    vipserver.name="接送";
        vipserver.color="#FF0000";
    console.log(vipserver);
    vipserver.save(function(err,data){
        if(err){
            console.log(err);
        }
        console.log(data)
    })
    VipServerModel.find({},function(err,data){
        data.forEach(function(r,index){
            r.name="接送1";
            r.save();
        })
    })
}

//addserverlsit();
//syncReservationdesc("5615ce19193184140355c49f",function(){

//})

/*classtype.findById({_id:"56170d9a053d34d82eef8ae8"},function(err,data){
    data.applycount=100;
    data.cartype="法拉利"
    data.classdesc="一年只有一次特惠，赶快报名"
    data.onsaleprice="0000"
    data.classchedule="周末+平时",
        data.carmodel.code="C1";
    data.save(function(err,daata){
        console.log(daata)
    });
})*/
// 修改时间
/*reservationmodel.find({},function(err,data){
    data.forEach(function(r,index){
        r.is_comment =true;
        r.comment.starlevel=5;
        r.comment.attitudelevel=5;
        r.comment.timelevel=5;
        r.comment.abilitylevel=5;
        r.comment.commentcontent="稀饭这个教练，good";
        r.comment.commenttime=Date.now()

        r.is_coachcomment =true;
        r.coachcomment.starlevel=5;
        r.coachcomment.attitudelevel=5;
        r.coachcomment.timelevel=5;
        r.coachcomment.abilitylevel=5;
        r.coachcomment.commentcontent="学生开朗，学习能里快";
        r.coachcomment.commenttime=Date.now()*/

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
    //  r.save(function(err,data)
    //  {console.log(data)});
   // })

//})

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

/*    usermodel.find({},function(err,data) {
        data.forEach(function (r, index) {
            r.subjecttwo.progress = "";
            r.subjecttwo.reservation = 0;
            r.subjecttwo.finishcourse = 0;
            r.subjectthree.progress = "";
            r.subjectthree.reservation = 0;
            r.subjectthree.finishcourse = 0;


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

/*coachmode.update({"trainfieldlinfo":null},{$set:{"trainfieldlinfo.name":"海淀练场",
        "trainfieldlinfo.id":"561636cc21ec29041a9af88e"}},{safe: false, multi: true},
function(err,data){
    console.log(data);
});
coachmode.find({"trainfieldlinfo":null},function(err,data){
    data.forEach(function(r,index){
        r.trainfieldlinfo.name="海淀练场";
        r.trainfieldlinfo.id="561636cc21ec29041a9af88e";
        r.save();
    })
}); */

  console.log(new Date(1446091200*1000))
   // 时间测试
    var temptime=new Date("2015-10-31");
console.log(temptime)
var i=temptime.getDay();
console.log(i);