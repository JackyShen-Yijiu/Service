
/**
 * Created by v-yaf_000 on 2016/4/8.
 */
var mobilelist=[
    "15652305650",
    "15110109598",
    "13522535090",
    "15652222868",
    "13167330209",
    "18612179447",
    "18612202030",
    "13718683031",
    "18801139401",
    "13911051685",
    "13720022375",
    "18717357779",
    "18353623128",
    "13120064118",
    "13754886536",
    "18722203018",
    "18811312701",
    "13716199195",
    "13436306675",
    "13264347531",
    "18560224161",
    "13124766820",
    "15670853636",
    "17710023980",
];
var namelist=[
    "李亚飞",
    "孙林林",
    "张亚涛",
    "蔡永波",
    "南凤平",
    "高坛",
    "周中原",
    "高宏光",
    "陈振",
    "沈国斌",
    "塔贵有",
    "杨建刚",
    "刘红敏",
    "孙启岷",
    "赵海海",
    "高名佳",
    "马晋强",
    "李银东",
    "杨长文",
    "陈崛翔",
    "李法葳",
    "侯鹏程",
    "雷凯",
    "孙焕男",
];

var mongodb =     require('./mongodb.js');
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
require('date-utils');
var async = require('async');
var xlsx = require('node-xlsx');
var fs = require('fs');
var appTypeEmun=require("../custommodel/emunapptype");

var time=new Date();
var begintime=new Date();
var datetomorrow = new Date().addDays(1);
var  searchcount=function(userlist,type,callback){
    var returnuserlsit=[];
    var count=0;
    var i=0;


    async.whilst(
        function() {
            if(i == userlist.length){
               // console.log(returnuserlsit);
                  callback (returnuserlsit);
            }

            return i < userlist.length },
        function(cb) {
            var temponeuser=userlist[i];
            i=i+1;
            var searchinfo={};
            if(type==2){
                searchinfo= { coachid:new mongodb.ObjectId(temponeuser._id)
                    ,$or:[{reservationstate:appTypeEmun.ReservationState.applyconfirm},{reservationstate:appTypeEmun.ReservationState.applying}
                        ,{reservationstate:appTypeEmun.ReservationState.finish},{reservationstate:appTypeEmun.ReservationState.ucomments}
                        ,{reservationstate:appTypeEmun.ReservationState.unconfirmfinish},{reservationstate:9},{reservationstate:10}]
                    ,begintime: { $gte: begintime.clearTime(),$lte:datetomorrow.clearTime()}
                }
            }
            else
            { searchinfo= { userid:new mongodb.ObjectId(temponeuser._id)
                ,$or:[{reservationstate:appTypeEmun.ReservationState.applyconfirm},{reservationstate:appTypeEmun.ReservationState.applying}
                    ,{reservationstate:appTypeEmun.ReservationState.finish},{reservationstate:appTypeEmun.ReservationState.ucomments}
                    ,{reservationstate:appTypeEmun.ReservationState.unconfirmfinish},{reservationstate:9},{reservationstate:10}]
                ,begintime: { $gte: begintime.clearTime(),$lte:datetomorrow.clearTime()}
            }

            }
            reservationmodel.find(searchinfo )
                .exec(function(err,reservationdata){
                    count=count+1;
                   var oneuser={
                        id:temponeuser._id,
                        name:temponeuser.name,
                        mobile:temponeuser.mobile,
                        resercoursecount:reservationdata.length,
                        sigincount:0,
                    }
                    var sigincount=0;
                    for(var j= 0;j<reservationdata.length;j++){
                        if(reservationdata[j].reservationstate!=10){
                            sigincount=sigincount+1;
                        }
                    }
                    oneuser.sigincount=sigincount;
                    returnuserlsit.push(oneuser);
                    cb();
                    //if(count==userlist.length){
                    //    callback(returnuserlsit);
                    //}

                })
        },
        function(err) {
            // 3s have passed
          console.log(err)
        }
    );


}


usermodel.find({"mobile":{"$in":mobilelist}})
    .select("_id name  mobile")
    .exec(function(err,data){
        //console.log(data)
        console.log(data.length);
        searchcount(data,1,function(userdata){
            var listone=[];
            var oneuser=[];
            oneuser.push("用户id");
            oneuser.push("姓名");
            oneuser.push("手机号");
            oneuser.push("预约次数");
            oneuser.push("签到次数");
            listone.push(oneuser);
            for(var i=0;i<mobilelist.length;i++){
                var oneuser=[];
                oneuser.push("");
                oneuser.push(namelist[i]);
                oneuser.push(mobilelist[i]);
                oneuser.push(0);
                oneuser.push(0);
                //{
                //    //id:"",
                //    name:namelist[i],
                //    mobile:mobilelist[i],
                //    resercoursecount:0,
                //    sigincount:0,
                //}
                for(var j=0;j<userdata.length;j++){
                    if(mobilelist[i]==userdata[j].mobile){
                        oneuser[0]=userdata[j].id;
                        oneuser[3]=userdata[j].resercoursecount;
                        oneuser[4]=userdata[j].sigincount;
                        //oneuser.id=userdata[j].id;
                      //  oneuser.resercoursecount=userdata[j].resercoursecount;
                        //oneuser.sigincount=userdata[j].sigincount;
                    }
                }
                listone.push(oneuser);
            }
            console.log("listone");
            console.log(listone);
            var buffer = xlsx.build([{name: "mySheetName", data: listone}]);
            fs.writeFileSync(time.toFormat("YYYY-MM-DD").toString()+'学员.xlsx', buffer, 'binary');
            console.log("学员端完成")
        })

    });

coachmode.find({"mobile":{"$in":mobilelist}})
    .select("_id name  mobile")
    .exec(function(err,data){
        //console.log(data)
        console.log(data.length);
        searchcount(data,2,function(userdata){
            var listone=[];
            var oneuser=[];
            oneuser.push("用户id");
            oneuser.push("姓名");
            oneuser.push("手机号");
            oneuser.push("收到预约次数");
            oneuser.push("签到次数");
            listone.push(oneuser);
            for(var i=0;i<mobilelist.length;i++){
                var oneuser=[];
                oneuser.push("");
                oneuser.push(namelist[i]);
                oneuser.push(mobilelist[i]);
                oneuser.push(0);
                oneuser.push(0);

                for(var j=0;j<userdata.length;j++){
                    if(mobilelist[i]==userdata[j].mobile){
                        oneuser[0]=userdata[j].id;
                        oneuser[3]=userdata[j].resercoursecount;
                        oneuser[4]=userdata[j].sigincount;
                    }
                }
                listone.push(oneuser);
            }
            console.log("listone");
            console.log(listone);
            var buffer = xlsx.build([{name: "mySheetName", data: listone}]);
            fs.writeFileSync(time.toFormat("YYYY-MM-DD").toString()+'教练.xlsx', buffer, 'binary');
            console.log("教练端完成")
        })

    });