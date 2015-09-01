/**
 * Created by metis on 2015-08-17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ImgInfo= new Schema({
    id :Number,
    originalpic:{type:String,default:""},
    thumbnailpic:{type:String,default:""},
    width:{type:String,default:""},
    height:{type:String,default:""}

});
var  UserSchema=new Schema({
    mobile: { type: String, index: true},
    name :{type:String,default:''},
    nickname:{type:String,default:''},
    createtime:{type:Date,default:Date.now()},
    email:{type:String,default:''},
    token:{type:String,default:''},
    password:String,
    headportrait: { originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}},
    subject:{subjectid:Number,name:String},
    carmodels:{modelsid:Number,name:String},
    logintime:{type:Date,default:Date.now()},
    address: String,
    //Î¬¶È
    latitude: Number,
    longitude: Number,
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    invitationcode:{type:Number},
    referrerCode: Number,


});
UserSchema.index({mobile: 1}, {unique: true});
module.exports = mongoose.model('User', UserSchema);

