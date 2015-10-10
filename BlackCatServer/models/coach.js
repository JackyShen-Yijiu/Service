/**
 * Created by v-lyf on 2015/9/2.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 教练信息信息
var  CoachSchema=new Schema({
    mobile: { type: String},
    name :{type:String,default:''},
    createtime:{type:Date,default:Date.now()},
    email:{type:String,default:''},
    token:{type:String,default:''},
    password:String,
    logintime:{type:Date,default:Date.now()},
    address: String,
    introduction:String, // 简介
    Gender:String,
    //维度
    latitude: {type:Number,default:0},
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    invitationcode:{type:String},  // 要初始化
    referrerCode: String,   // 被邀请码
    headportrait: { originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}},

    subject:[{subjectid:{type:Number,default:2},
        name:{type:String,default:"科目二"}}], //所教科目 默认是科目二
    displaycoachid:{type:String,default:''},  // 显示教练id
    wallet:{type:Number,default:0}, // 钱包
    is_lock: { type: Boolean, default: false} , //用户是否锁定
    is_validation: { type: Boolean, default: false} , //教练是否通过验证
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    driveschoolinfo:{name:String,id:String}, //申请学校信息
    studentcoount:{type:Number,default:0}, //学生数量
    commentcount:{type:Number,default:0}, // 评论数量
    Seniority :String , // 教龄
    passrate :Number ,  // 通过率
    worktime:[{timeid:Number,timespace:String,begintime:String,endtime:String}] ,// 工作时间
    coursestudentcount:{type:Number,default:1},//每节课可以预约学生的数量
    idcardnumber:String ,// 身份证
    drivinglicensenumber:String,  // 驾驶证
    coachnumber:String,//教练证
    starlevel :Number, // 星级
    carmodel:{modelsid:Number,name:String,code:String},
    trainfield:{type: Schema.Types.ObjectId, ref: 'trainingfield'} ,//训练场
    trainfieldlinfo:{name:String,id:String}, //训练成信息信息
    // 是否接送
    is_shuttle:{ type: Boolean, default: false},

});

/**
 * Get restaurants near a given location/radius.
 * @param latitude
 * @param longitude
 * @param radius
 * @param limit
 * @param callback
 */
CoachSchema.statics.getNearCoach = function(latitude, longitude, radius, callback) {
    // CAUTION: paramters (lat, lon, radius) in the query must be type of Number.
//    this.find({loc:{$geoWithin:{ $centerSphere:[[longitude, latitude], radius/6378100.0]}}}) //within cycle of radius

    this.find({loc:{$nearSphere:{$geometry:{type:'Point', coordinates:[longitude, latitude]}, $maxDistance: radius}},
        is_lock:false,is_validation:true}) //from near to far
        //  .select('name branchName latitude longitude dpUrl logoUrl avgPrice popularity')
      //  .sort({capacity: -1})
        //     .limit(limit?limit:10)
        .lean()
        .exec(callback);
};

CoachSchema.index({mobile: 1});
CoachSchema.index({loc: '2dsphere'});


module.exports = mongoose.model('coach', CoachSchema);