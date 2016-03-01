/**
 * Created by v-yaf_000 on 2015/12/28.
 */
// 用户咨询表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserConsultSchema= new Schema({
    userid:{type:String,default:"",ref: 'User'},   // 用户userid
    name:{type:String,default:""},   // 用户姓名
    mobile:{type:String,default:""},  // 手机号
    licensetype:{type:String,default:""},  // 驾照类型
    content:{type:String,default:""},   //咨询内容
    createtime:{type:Date,default:Date.now()}, //创建时间
    state:{type:Number,default:0}, //  处理状态 0 没有处理  1 处理中  2 处理完成
    replycontent:{type:String,default:""}, // 回复内容
    replytime:{type:Date,default:Date.now()},     //创建时间
    replyuser:{type:String,default:""}
});

module.exports = mongoose.model('userconsult', UserConsultSchema);

