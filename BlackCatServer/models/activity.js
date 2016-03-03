/**
 * Created by v-yaf_000 on 2015/12/29.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ActivitySchema=new Schema({
    name:{type:String,default:""},
    titleimg:{type:String,default:""},
    contenturl:{type:String,default:""},
    begindate:{type:Date,default:Date.now()}, // 班级开始时间
    enddate:{type:Date,default:Date.now()},  // 班级结束时间
    createtime:{type:Date,default:Date.now()}, // 记录创建时间
    ativitypublishtime:{type:Date,default:Date.now()}, // 活动上线时间
    ativityregion:{type:Number,default:0}, // 活动区域 0 全国， 1 定位
    is_using:{type:Boolean,default:true},  // 该课程是否正在使用
    province: {type:String,default:''}, // 省
    city: {type:String,default:''}, // 市
    county:{type:String,default:''},// 县
    address:{type:String,default:""}
});


ActivitySchema.index({enddate: -1});
ActivitySchema.index({city: -1});

module.exports = mongoose.model('activity', ActivitySchema);
