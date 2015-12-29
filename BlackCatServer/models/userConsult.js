/**
 * Created by v-yaf_000 on 2015/12/28.
 */
// 用户咨询表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserConsultSchema= new Schema({
    userid:String,   // 用户userid
    name:String,   // 用户姓名
    mobile:String,  // 手机号
    licensetype:String,  // 驾照类型
    content:String,   //咨询内容
    createtime:{type:Date,default:Date.now()}, //创建时间
    state:{type:Number,default:0} //  处理状态 0 没有处理  1 处理中  2 处理完成

});

module.exports = mongoose.model('userconsult', UserConsultSchema);

