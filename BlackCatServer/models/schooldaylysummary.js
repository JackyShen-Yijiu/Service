/**
 * Created by li on 2015/11/30.
 */

// 驾校每天数据总结

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolDaylySummarySchema = new Schema({
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    applystudentcount:{type:Number,default:0}, //今天申请学生数量
    applyingstudentcount:{type:Number,default:0}, // 申请状态的学生的数量
    goodcommentcount:{type:Number,default:0}, // 好评数量
    badcommentcount:{type:Number,default:0},  // 差评数量
    generalcomment:{type:Number,default:0},   //中评数量
    complaintcount:{type:Number,default:0},   // 投诉数量
    totalcoursecount:{type:Number,default:0},   // 总共课程数据
    reservationcoursecount:{type:Number,default:0},  // 预约课程数据
    coachcoursecount:[{
        coachid:{type: Schema.Types.ObjectId, ref: 'coach'} , //教练id
        coursecount:{type:Number,default:0}  // 教练上课
    }],
    summarytime:{type:Date, required:true}            // 统计时间
});




SchoolDaylySummarySchema.index({driveschool: 1});
SchoolDaylySummarySchema.index({summarytime: 1});

module.exports = mongoose.model('schooldaylysunmmary', SchoolDaylySummarySchema);
