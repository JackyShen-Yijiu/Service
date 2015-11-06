/**
 * Created by li on 2015/11/6.
 */
// 科目课件信息

var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  CourseWareSchema = new Schema({
   name:String,
    pictures:{type:String, default:''},
    videourl:String,
    subject:{subjectid:{type:Number,default:1},
        name:{type:String,default:"科目一"}}, // 要初始化 0 准备报考   当前科目
    is_using:{type:Boolean,default:true},  // 该视频是否正在使用
});

CourseWareSchema.plugin(seqlist.plugin, {
    model: 'courseware',
    field: 'seqindex',
    start: 0,
    step: 1
});

//CourseWareSchema.index({name: 1});


module.exports = mongoose.model('courseware', CourseWareSchema);
