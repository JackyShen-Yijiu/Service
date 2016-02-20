/**
 * Created by Administrator on 2015/4/15.
 * 管理员对象
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//var DriveSchool=mongodb.DriveSchoolModel;

var AdminGroup = require('./AdminGroup');


var AdminUserSchema = new Schema({
    name:  String,
    userName : String,
    password:   String,
    email : String,
    phoneNum : String,
    comments : String,
    date: { type: Date, default: Date.now },
    logo: { type: String, default: "" },
    group: {
        type : String,
        ref : 'AdminGroup'

    },
    schoolid:{
        type : String,
        ref : 'DriveSchool'
    },  //  所在驾校id
    usertype:{ type:Number, default: 0 } , // O  管理员   1 驾校管理人员
    userstate:{type:Number, default: 0} , // 0 正常 ，1 锁定， 2 删除
});


AdminUserSchema.statics = {


};


var AdminUser = mongoose.model("AdminUser",AdminUserSchema);

module.exports = AdminUser;

