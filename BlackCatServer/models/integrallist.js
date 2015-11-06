/**
 * Created by li on 2015/11/6.
 */

// 积分发放历史记录表
var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  IntegrallistSchema = new Schema({
    userid:String, // 用户id
    createtime:{type:Date,default:Date.now()},// 注册时间
    usertype:Number, // 1 学员 2 教练
    amount :Number, //发放数量
    type:Number  // 积分类型
});

IntegrallistSchema.plugin(seqlist.plugin, {
    model: 'integrallist',
    field: 'seqindex',
    start: 0,
    step: 1
});
module.exports = mongoose.model('integrallist', IntegrallistSchema);