/**
 * Created by li on 2015/10/23.
 */
// 系统定时刷新预约状态
// 将已确定 和课程时间结束的修改成 待确认完成

var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();

var times = [];

for(var i=1; i<60; i=i+5){
  //  console.log(i);
    times.push(i);

}

rule.minute = times;

var c=0;
var j = schedule.scheduleJob(rule, function(){
    c++;
    console.log(new Date());
    console.log(c);
});