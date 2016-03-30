
/**
 * Created by v-yaf_000 on 2016/3/29.
 */

// 学员历月考信息
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserExamInfoSchema=new Schema({
    userid:{type: String, ref: 'User'}, // 用户ID
    examinationstate:{type:Number,default:0}, //科目二报考状态  0 未申请 1 申请中  2 申请拒绝
    //  3 已安排 4 没有通过 5 通过
    applydate:Date,  //  申请时间
    applyenddate:Date, // 结束申请时间
    examinationdate:Date, // 考试时间
    subjectid:Number , // 科目id
    coachlist:[String], // 教练列表
    score:Number ,  // 成绩
});

UserExamInfoSchema.index({userid: 1});
module.exports = mongoose.model('userexaminfo', UserExamInfoSchema);