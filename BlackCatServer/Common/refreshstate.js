/**
 * Created by li on 2015/10/23.
 */
// ϵͳ��ʱˢ��ԤԼ״̬
// ����ȷ�� �Ϳγ�ʱ��������޸ĳ� ��ȷ�����

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