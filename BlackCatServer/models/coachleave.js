/**
 * Created by v-yaf_000 on 2016/1/8.
 */
// 教练请假信息
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CoachLeaveSchema=new Schema({
   coachid:{type: Schema.Types.ObjectId, ref: 'coach'},
   leavebegintime:{type:Date,default:Date.now()}, // 请假开始时间
 leaveendtime:{type:Date,default:Date.now()},  // 请假结束时间
    createtime:{type:Date,default:Date.now()}, // 请假时间
    is_validation:{type:Boolean,default:false},  // 该课程是否正在使用

});


CoachLeaveSchema.index({coachid: -1});
CoachLeaveSchema.index({begindate: -1});
CoachLeaveSchema.index({enddate: -1});

module.exports = mongoose.model('coachleave', CoachLeaveSchema);