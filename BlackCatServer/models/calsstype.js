/**
 * Created by v-lyf on 2015/9/6.
 */
//驾校安排的课程类型类型

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassTypeSchema=new Schema({
    schoolid :{type: Schema.Types.ObjectId, ref: 'DriveSchool'},
    classname:{type:String,default:""},
    begindate:{type:Date,default:Date.now()},
    enddate:{type:Date,default:Date.now()},
    createtime:{type:Date,default:Date.now()},
    is_using:{type:Boolean,default:true},
    is_vip:{type:Boolean,default:false},
    carmodel:{modelsid:Number,name:String,code:String},
    applycount:{modelsid:Number,name:String},
    classdesc:{type:String,default:""},
    price:Number
});

ClassTypeSchema.index({schoolid: 1});
ClassTypeSchema.index({is_using:1});
module.exports = mongoose.model('classtype', ClassTypeSchema);

