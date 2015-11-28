/**
 * Created by v-lyf on 2015/9/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//鏁欑粌鐨勮绋嬩俊鎭�
var CourseSchema=new Schema({
    coachid:{type: Schema.Types.ObjectId, ref: 'coach'},  // 教练
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    coursedate:Date,  //  课程日期
    coursebegintime:Date,  // 课程开始时间
    courseendtime:Date,  // 课程的结束时间
    createtime:{type:Date,default:Date.now()},
    coursetime:{timeid:Number,timespace:String,begintime:String,endtime:String},  // 璇剧▼鏃堕棿
    coursestudentcount:{type:Number,default:1},//课程 可以选择的人数
    selectedstudentcount:{type:Number,default:0} , //选择 学生人数
    courseuser:[{type: Schema.Types.ObjectId, ref: 'User'}], // 选择学生人
    // 閫夋嫨璇ヨ绋嬬殑璁㈠崟
    coursereservation:[{type: Schema.Types.ObjectId, ref: 'reservation'}] //预约id

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