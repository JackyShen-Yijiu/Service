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
    coursereservation:[{type: Schema.Types.ObjectId, ref: 'reservation'}], //预约id
    signinstudentcount:{type:Number,default:0} , // 签到学生数量
    carmodelid :Number, // 车型 id c1 c2
    subjectid:Number, // 科目id
    coachname: String , // 教练名称
    platenumber:String // 车牌号
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
CourseSchema.statics.findfullCourseTimely = function(timeid, _date,schoolid,  callback){

    // console.log('find: ' + _mobile);
    this.find({ "coursetime.timeid":timeid,
        "driveschool":schoolid,
        "coursedate": new Date(_date) })
        .select("coachid coursestudentcount  selectedstudentcount")
        .exec( function(err, result) {
        //  coursedate: { $gte: new Date(_date), $lte: new Date(_date) }}, function(err, result) {
        //console.log(result);
        //if(result != null) console.log('found: ' + _mobile);
           var  coacidlist=[];
            result.forEach(function(r,index){
                if (r.coursestudentcount== r.selectedstudentcount)
                {
                    coacidlist.push(r.coachid);
                }
            })
        return  callback(err, coacidlist);
    });
};
CourseSchema.index({coachid: 1});
CourseSchema.index({coursedate: 1});

module.exports = mongoose.model('course', CourseSchema);