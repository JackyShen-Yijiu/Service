/**
 * Created by v-lyf on 2015/9/2.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 教练信息信息
var  CoachSchema=new Schema({
    mobile: { type: String},  //手机
    name :{type:String,default:''},  // 姓名
    createtime:{type:Date,default:Date.now()},  // 注册时间
    email:{type:String,default:''},  // 邮箱
    token:{type:String,default:''},  //登录token
    password:String,   // 密码
    logintime:{type:Date,default:Date.now()}, //最近一次登录时间
    province: {type:String,default:''}, // 省
    city: {type:String,default:''}, // 市
    address: String,   // 地址
    introduction:String, // 简介
    Gender:String,  //  x性别
    coachtype: {type:Number,default:0},  // 教练类型  教练的方式 0 挂靠教练  1直营教练
    //维度
    latitude: {type:Number,default:0},  //纬度
    longitude: {type:Number,default:0},  // 经度
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},    //经纬度坐标
    invitationcode:{type:String},  // 要初始化  邀请码
    referrerCode: String,   // 被邀请码
    headportrait: { originalpic:{type:String,default:""},  //头像信息  原始地址
        thumbnailpic:{type:String,default:""}, // 缩略图地址
        width:{type:String,default:""},  // 宽度
        height:{type:String,default:""}}, // 高度

    subject:[{subjectid:{type:Number,default:2},
        name:{type:String,default:"科目二"}}], //所教科目 默认是科目二
    displaycoachid:{type:String,default:''},  // 显示教练id
    wallet:{type:Number,default:0}, // 钱包
    is_lock: { type: Boolean, default: false} , //用户是否锁定
    is_validation: { type: Boolean, default: false} , //教练是否通过验证
    validationstate:{type:Number,default:0}, // 教练审核状态 0 未申请， 1 申请中 ，2 审核拒绝 3审核通过
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    driveschoolinfo:{name:String,id:String}, //申请学校信息
    studentcount:{type:Number,default:0}, //学生数量
    commentcount:{type:Number,default:0}, // 评论数量
    Seniority :String , // 教龄
    passrate :Number ,  // 通过率
    worktime:[{timeid:Number,timespace:String,begintime:String,endtime:String}] ,// 工作时间短每一个小时一个时间段，
    workweek:[Number], // 周几工作
    worktimespace:{begintimeint:Number,endtimeint:Number}, //工作时间 早8 到晚6
    worktimedesc:String, // 工作时间描述 （周一到周五 9：00--18:00）
    coursestudentcount:{type:Number,default:1},//每节课可以预约
    // 学生的数量
    idcardnumber:String ,// 身份证
    drivinglicensenumber:String,  // 驾驶证
    coachnumber:String,//教练证
    starlevel :{type:Number,default:5}, // 星级
    carmodel:{modelsid:Number,name:String,code:String},  // 负责教的车型
    trainfield:{type: Schema.Types.ObjectId, ref: 'trainingfield'} ,//训练场
    trainfieldlinfo:{name:String,id:String}, //训练成信息信息
    platenumber:String, // 车牌号
    //请假开始时间
     leavebegintime :Date,
    // 请假结束时间
    leaveendtime:Date,
    // 是否接送
    is_shuttle:{ type: Boolean, default: false},
    shuttlemsg:String , //  接送信息（接送备信息）
    //个人设置
    usersetting:{
        reservationreminder:{ type: Boolean, default: false}, //新消息提醒
        newmessagereminder:{ type: Boolean, default: false},  //  新消息提醒
        classremind:{ type: Boolean, default: false}// 开课提醒
    },
    // 绑定银行卡列表
    bankcardlist:[{name:String, cardnumber:String,cardbank:String}],
    // 我所服务的班级列,
    serverclasslist:[{type: Schema.Types.ObjectId, ref: 'classtype'} ],
    // 我的标签列表
    tagslist:[{type: Schema.Types.ObjectId, ref: 'coachtags'} ],
    // 用户积分状态
    integralstate:{type:Number,default:0},
    // 用户积分发放人员列表
    integralpaylist:[{id:Number,userid:String,usertype:Number}],
    //是否已经注册mobim
    is_registermobim:{type:Number,default:0},
    cartype:String, //车品牌  富康、奔驰等
    maxprice:Number,  // 最高价格
    minprice:Number  // 最低价格
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

    this.find({
        //loc:{$nearSphere:{$geometry:{type:'Point', coordinates:[longitude, latitude]}, $maxDistance: 100000}},
        is_lock:false,is_validation:true}) //from near to far
        //  .select('name branchName latitude longitude dpUrl logoUrl avgPrice popularity')
      //  .sort({capacity: -1})
             .limit(30)
        .lean()
        .exec(callback);
};

CoachSchema.statics.getCoachList = function(callback) {
    this.find()
        .lean()
        .exec(callback);
};

CoachSchema.index({mobile: 1});
CoachSchema.index({loc: '2dsphere'});


module.exports = mongoose.model('coach', CoachSchema);
