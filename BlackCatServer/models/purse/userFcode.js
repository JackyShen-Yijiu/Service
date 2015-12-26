/**
 * Created by v-yaf_000 on 2015/12/25.
 */

// 用户F码表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserFcodeSchema=new Schema({
    userid:String, // 用户ID
    createtime:{type:Date,default:Date.now()}, //创建时间
    usertype:Number, // 用户类型 1 用户 2 教练
    fcode:String,
    referrerfcode:String,
    codetype:{type:Number,default:2}, //代理类型  1 一级代理 2 普通代理
    money:{type:Number,default:0},  //金额多少
    fatherFcodelist:[String]
});



UserFcodeSchema.index({userid: 1});
UserFcodeSchema.index({fcode:1});
module.exports = mongoose.model('userfcode', UserFcodeSchema);
