/**
 * 教练意见反馈
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CoachFeedbackSchema = new Schema({
    coachid:{type: Schema.Types.ObjectId, ref: 'User'},//用户id
    schoolid :{type: Schema.Types.ObjectId, ref: 'DriveSchool'},   //学校id
    content : {type:String,default:''}, //内容
    piclist:[String] , // 图片列表
    createtime:{type:Date,default:new Date().getTime()/1000},//反馈时间
    replyflag:{ type: Number, default: 0},//回复标志 0:未回复，1:已回复
    replyid:{type: Schema.Types.ObjectId, ref: 'HeadMaster'},//校长id
    replycontent:{type:String,default:''}, //回复内容
    replytime:{type:Date}//回复时间
});
module.exports = mongoose.model('coachfeedback', CoachFeedbackSchema);