/**
 * Created by v-yaf_000 on 2016/1/27.
 */
// 驾校 班车 班车路线


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchoolBusRouteSchema=new Schema({
    schoolid :{type: Schema.Types.ObjectId, ref: 'DriveSchool'},   //学校id
    routename:{type:String,default:""},  // 路线名称
    routecontent:{type:String,default:""},  // 路线详情
    trainingfieldid: {type:String,default:""},//训练场Id
    begintime: {type:String,default:""}, // 发车时间
    endtime: {type:String,default:""}//到达时间
});

SchoolBusRouteSchema.index({schoolid: 1});
module.exports = mongoose.model('schoolbusroute', SchoolBusRouteSchema);