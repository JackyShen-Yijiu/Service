/**
 * Created by v-yaf_000 on 2015/12/2.
 */
// 驾校公告

var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  SchoolBulletinSchema = new Schema({
    headmaster:{type: Schema.Types.ObjectId, ref: 'HeadMaster'}, //发布人
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    content:{type:String,default:""},
    createtime:{type:Date,default:Date.now()}, //创建时间
    bulletobject:{type:Number,default:2},  // 公告对象 1 学员  2 教练
    title:{type:String,default:""}  // 公告标题
     });

SchoolBulletinSchema.plugin(seqlist.plugin, {
    model: 'schoolbulletin',
    field: 'seqindex',
    start: 0,
    step: 1
});
SchoolBulletinSchema.index({headmaster: 1});
SchoolBulletinSchema.index({driveschool: 1});
module.exports = mongoose.model('schoolbulletin', SchoolBulletinSchema);