/**
 * Created by metis on 2015-08-17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var img=require('commonshema').ImgInfo;

var  UserSchema=new Schema({
    mobile: { type: String, index: true},
    name :{type:String,default:''},
    nickname:{type:String,default:''},
    createtime:{type:Date,default:Date.now()},
    email:{type:String,default:''},
    token:{type:String,default:''},
    password:String,
    headportrait: img,
    subject:{subjectid:Number,name:String},
    carmodels:{modelsid:Number,name:String},
    logintime:{type:Date,default:Date.now()}


});
UserSchema.index({mobile: 1}, {unique: true});
module.exports = mongoose.model('User', UserSchema);

