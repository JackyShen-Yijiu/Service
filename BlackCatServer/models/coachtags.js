/**
 * Created by v-yaf_000 on 2016/1/13.
 */
// 教练标签表



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoachTagsSchema = new Schema({
    tagname:String,
    tagtype:Number,  // 标签类型 0  系统标签  1教练自定义标签
    coacid:Number,
    is_open :{type:Boolean,default:false},

});

CoachTagsSchema.index({is_open: 1});
CoachTagsSchema.index({fatherid: 1});
module.exports = mongoose.model('city_info', CoachTagsSchema);