/**
 * Created by li on 2015/10/23.
 */
// 系统定时刷新预约状态
// 将已确定 和课程时间结束的修改成 待确认完成

var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
var mongodb = require('../models/mongodb.js');
var reservationmodel=mongodb.ReservationModel;
var appTypeEmun=require("../custommodel/emunapptype");
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