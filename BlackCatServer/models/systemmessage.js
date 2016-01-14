/**
 * Created by v-yaf_000 on 2016/1/14.
 */

    //  系统消息
var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  SystemMessageSchema = new Schema({
    createtime:{type:Date,default:Date.now()},//  消息时间
    userid:{type:String,default:""} , //消息 对应id
    title:{type:String,default:""},   //消息题目
    description:{type:String,default:""},  // 消息描述
    detial:{type:String,default:""},  // 消息详情
    is_read: {type:Boolean,default:false} ,// 消息 是否读取
    Messagetype: {type:Number,default:0}  // 0 金额 1 系统更新
});

SystemMessageSchema.plugin(seqlist.plugin, {
    model: 'systemmessage',
    field: 'seqindex',
    start: 0,
    step: 1
});
SystemMessageSchema.index({userid: 1});
module.exports = mongoose.model('systemmessage', SystemMessageSchema);