/**
 * Created by v-lyf on 2015/9/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//教练的课程信息
var CourseSchema=new Schema({
    coachid:{type: Schema.Types.ObjectId, ref: 'coach'},  // ����
    coursedate:Date,  //  �γ�����
    coursebegintime:Date,
    courseendtime:Date,
    createtime:{type:Date,default:Date.now()},
    coursetime:{timeid:Number,timespace:String,begintime:String,endtime:String},  // 课程时间
    coursestudentcount:{type:Number,default:1},// 课程可以预选人数
    selectedstudentcount:{type:Number,default:0} , //已选课程人数
    courseuser:[{type: Schema.Types.ObjectId, ref: 'User'}], // 已选课程人员
    // 选择该课程的订单
    coursereservation:[{type: Schema.Types.ObjectId, ref: 'reservation'}]

});

CourseSchema.statics.findCourse = function(coachid, _date, callback){

   // console.log('find: ' + _mobile);

    this.find({ coachid:new mongoose.Types.ObjectId(coachid),
        coursedate: new Date(_date) }, function(err, result) {
      //  coursedate: { $gte: new Date(_date), $lte: new Date(_date) }}, function(err, result) {
        //console.log(result);
        //if(result != null) console.log('found: ' + _mobile);
       return  callback(err, result);
    });

};
CourseSchema.index({coachid: 1});
CourseSchema.index({coursedate: 1});

module.exports = mongoose.model('course', CourseSchema);