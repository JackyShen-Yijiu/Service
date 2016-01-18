/**
 * Created by v-yaf_000 on 2016/1/13.
 */
// 教练标签表



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoachTagsSchema = new Schema({
    tagname:String,
    tagtype:Number,  // 标签类型 0  系统标签  1教练自定义标签
    coachid:String,  // 如果是教练 教练id
    color:String,    // 标签的颜色
    is_audit :{type:Boolean,default:true}  // 如果时候教练标签是否审核
});

CoachTagsSchema.index({coachid: 1});
CoachTagsSchema.index({tagtype: 1});
module.exports = mongoose.model('coachtags', CoachTagsSchema);