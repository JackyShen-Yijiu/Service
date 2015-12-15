/**
 * Created by li on 2015/11/27.
 */
// 校长表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  HeadMasterSchema = new Schema({
    name:{type:String,required: true }, // 姓名
    mobile:{type:String,required: true }, // 手机号
    password:{type:String,required: true }, //密码
    token:{type:String,default:''},  //登录token
    logintime:{type:Date,default:Date.now()}, //最近一次登录时间
    headportrait:{type:String,default:''},
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    driveschoollist: [{type: Schema.Types.ObjectId, default:null, ref: 'DriveSchool'}],
    is_lock: { type: Boolean, default: false} , //用户是否锁定
    //是否已经注册mobim
    is_registermobim:{type:Number,default:0},
    //个人设置
    usersetting:{
        complaintreminder:{ type: Boolean, default: true}, //投诉消息提醒
        newmessagereminder:{ type: Boolean, default: true},  //  新消息提醒
        applyreminder:{ type: Boolean, default: true}// 报名申请提醒
    }
})

HeadMasterSchema.index({mobile: 1}, {unique: true});
module.exports = mongoose.model('HeadMaster', HeadMasterSchema);




