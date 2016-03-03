/**
 * Created by v-lyf on 2015/10/8.
 */

/**
 * Created by v-lyf on 2015/8/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    feedbackmessage: {type:String,default:''},
    userid:{type: Schema.Types.ObjectId, ref: 'classtype'},
    appversion:String,
    mobileversion:{type:String,default:''},
    network :{type:String,default:''},
    resolution:{type:String,default:''},
    createtime:{type:Date,default:new Date().getTime()/1000},
    feedbacktype:{type:Number,default:0},  // 反馈类型  0 平台反馈 1 投诉教练 2  投诉驾校  3系统使用
    name:{type:String,default:''} ,
    feedbackusertype:{type:Number,default:1},  //投诉类型  0 匿名投诉 1 实名投诉
    moblie:{type:String,default:''}, // 投诉人手机号
    becomplainedname:{type:String,default:''},  //被投诉姓名
    piclist:[String] , // 图片列表
    usefeedbackmessage: {type:String,default:''},// 3系统使用系统使用反馈

});


module.exports = mongoose.model('feedback', FeedbackSchema);


