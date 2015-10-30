/**
 * Created by li on 2015/10/29.
 */
//api 请求的错误日志
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  SystemlogSchema = new Schema({
    apiname: {type:String,default:''},
    creattime:{type:Date,default:Date.now()},
    ver:String,    // app 版本号
    os :Number,   //  请求手机  1 andriod 2 ios
    msid:String,  //手机唯一编码
    ip:String,
    pathparameter:String,   // path 参数
    queryparameter:String,  // query 参数
    bodyparameter:String,  // body参数
    logtype:Number,   // 记录日志的类型 0 请求日志 1 错误日志 。。。。。。
    errmsg:String // 错误信息
});

module.exports = mongoose.model('systemlog', SystemlogSchema);
