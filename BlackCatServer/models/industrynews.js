/**
 * Created by li on 2015/11/28.
 */

// 行业资讯 信息


var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  IndustryNewsSchema = new Schema({
    createtime:{type:Date,default:Date.now()},//  创建时间
    title:String,   //标题
    logimg:String,  // log 图片
    description:String,  // 描述信息
    contenturl:String,   // 内容的信息
    viewcount:{type:Number,default:0},  // 浏览次数
    sharecount:{type:Number,default:0}  // 分享次数
});

IndustryNewsSchema.plugin(seqlist.plugin, {
    model: 'industrynews',
    field: 'seqindex',
    start: 0,
    step: 1
});
IndustryNewsSchema.index({userid: 1});
module.exports = mongoose.model('industrynews', IndustryNewsSchema);