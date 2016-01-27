/**
 * Created by v-yaf_000 on 2016/1/27.
 */
// 驾校 班车 班车路线


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchoolBusRouteSchema=new Schema({
    schoolid :{type: Schema.Types.ObjectId, ref: 'DriveSchool'},   //学校id
    routename:{type:String,default:""},  // 路线名称
    routecontent:{type:String,default:""}  // 路线详情
});

SchoolBusRouteSchema.index({schoolid: 1});
module.exports = mongoose.model('schoolbusroute', SchoolBusRouteSchema);