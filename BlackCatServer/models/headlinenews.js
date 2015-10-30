/**
 * Created by li on 2015/10/20.
 */
/// 头条消息  保存系统推荐的消息

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var HeadlineNewsSchema=new Schema({
    newsname:{type:String,default:""},
    headportrait: { originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}},
    createtime:{type:Date,default:Date.now()},
    newtype:Number,  // 头条类型 默认1 url  2教练 3 驾校信息
    linkurl:{type:String,default:""},
    is_using:{ type: Boolean, default: true}

});

HeadlineNewsSchema.index({is_using:1});
module.exports = mongoose.model('headlinenews', HeadlineNewsSchema);
