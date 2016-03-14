/**
 * Created by v-yaf_000 on 2016/3/10.
 */


// 用户领取的F吗 可以使用F码
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserAvailableFcodeSchema=new Schema({
    userid:String, // 用户ID
    createtime:{type:Date,default:Date.now()}, //创建时间
    fcode:{type:String,default:""},  // 领取的f吗
    name:{type:String,default:""},   // 分享着名字
});



UserAvailableFcodeSchema.index({userid: 1});
UserAvailableFcodeSchema.index({fcode:1});
module.exports = mongoose.model('useravailablefcode', UserAvailableFcodeSchema);