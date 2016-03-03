/**
 * Created by metis on 2015-08-17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// app 用户信息表
var  UserSchema=new Schema({
    mobile: { type: String, index: true},  // 手机号
    name :{type:String,default:''},  // 姓名
    nickname:{type:String,default:''}, // 昵称
    createtime:{type:Date,default:Date.now()},// 注册时间
    email:{type:String,default:''},// 邮箱
    token:{type:String,default:''}, // d登录验证token
    password:String, // 密码 MD5 加密的
    gender:String, //性别
    signature:{type:String,default:""},// 个性签名
    headportrait: { originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}},
    userpic:{ originalpic:{type:String,default:""},  //用户报名头像
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}},
    subject:{subjectid:{type:Number,default:0},
        name:{type:String,default:"准备报考"}}, // 要初始化 0 准备报考   当前科目
    carmodel:{modelsid:Number,name:String,code:String}, //报考车型 c1 c2
    logintime:{type:Date,default:Date.now()},  //登录时间
    address: String,  // 地址
    addresslist:[String],  //地址列表
    //维度
    latitude: {type:Number,default:0},
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    invitationcode:{type:String},  // 要初始化  邀请码
    referrerCode: String,   // 被邀请码
    referrerfcode: String,  //被邀请的Fcode
    applystate:{type:Number,default:0}, //报名状态  0 未报名 1 申请中 2 申请成功
    applycount:{type:Number,default:0}, // 报名次数
    //是否进行扫描验证码报名
    is_confirmbyscan:{ type: Boolean, default: false},
    // 扫描地址
    scanauditurl:String,
    // 报名信息
    applyinfo:{applytime:{type:Date,default:Date.now()},
     handelstate:{type:Number,default:0}, //处理状态 0 未处理 1 处理中 2 处理成功
        handelmessage:[String],
        handeltime:Date
    },
    applyschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 申请学校
    applyschoolinfo:{name:String,id:String}, //申请学校信息
    //------------- 申请教练信息
    applycoach:{type: Schema.Types.ObjectId, ref: 'coach'},
    applycoachinfo:{name:String,id:String},
    //---------------------申请课程信息
    applyclasstype:{type: Schema.Types.ObjectId, ref: 'classtype'},
    applyclasstypeinfo:{name:String,id:String,price:Number,
        onsaleprice:Number},

    displayuserid:{type:String,default:''}, //显示id
    wallet:{type:Number,default:0}, // 钱包
    is_lock: { type: Boolean, default: false},  //用户是否锁定
    idcardnumber:String, // 身份证
    telephone:String,  // 电话
   // 喜欢的教练
    favorcoach: [{type: Schema.Types.ObjectId, default:null, ref: 'coach'}],
    // 喜欢的驾校
    favorschool: [{type: Schema.Types.ObjectId, default:null, ref: 'DriveSchool'}],
    //科目一上课信息
    subjectone:{
        totalcourse:{type:Number,default:24},
        reservation:{type:Number,default:0},
        finishcourse:{type:Number,default:0},// 学习进度
        missingcourse:{type:Number,default:0}, // 漏课数量
        progress:{type:String,default:"未开始"}, // 学习进度
        reservationid:String, //学习进度id
        officialhours:{type:Number,default:0} // 官方学时
    },
    //科目二上课信息
    subjecttwo:{
        totalcourse:{type:Number,default:3},
        reservation:{type:Number,default:0},
        finishcourse:{type:Number,default:0},// 学习进度
        missingcourse:{type:Number,default:0}, // 漏课数量
        progress:{type:String,default:"未开始"}, // 学习进度
        reservationid:String, //学习进度id
        officialhours:{type:Number,default:0} // 官方学时
    },
    // 科目三上课信息
    subjectthree:{
        totalcourse:{type:Number,default:16},
        reservation:{type:Number,default:0},
        finishcourse:{type:Number,default:0},
        missingcourse:{type:Number,default:0}, // 漏课数量
        progress:{type:String,default:"未开始"}, // 学习进度
        reservationid:String, //学习进度id
        officialhours:{type:Number,default:0} // 官方学时
    },
    // 科目四学习
    subjectfour:{
        totalcourse:{type:Number,default:3},
        reservation:{type:Number,default:0},
        finishcourse:{type:Number,default:0},// 学习进度
        missingcourse:{type:Number,default:0}, // 漏课数量
        progress:{type:String,default:"未开始"}, //学习进度
        reservationid:String, //学习进度id
        officialhours:{type:Number,default:0} // 官方学时
    },
    vipserverlist:[{id:Number,name:String}], // 我所享受的vip服务列表
    // 是否进行报考验证
    is_enrollverification :{ type: Boolean, default: false},
    // 报考信息学号还有准考证号
    enrollverificationinfo:{studentid:String,
     ticketnumber:String},
    // 考试信息：
    examinationinfo:{
        subjecttwo:{
            examinationstate:{type:Number,default:0}, //科目二报考状态
            applydate:Date,  //  申请时间
            examinationdate:Date, // 考试信息
            // 申请处理信息
            examinationhandelinfo:String   //报考信息处理
        },
        subjectthree:{
            examinationstate:{type:Number,default:0}, // 科目三报考状态
            applydate:Date,  //  申请时间
            examinationdate:Date, // 考试信息
            // 申请处理信息
            examinationhandelinfo:String  // 报考信息处理
        }
    },
    //个人设置
    usersetting:{
        reservationreminder:{ type: Boolean, default: false}, //预约提醒
        newmessagereminder:{ type: Boolean, default: false},  //  新消息提醒
        classremind:{ type: Boolean, default: false}// 开课提醒
    },
    // 用户积分状态
    integralstate:{type:Number,default:0},
    // 用户积分发放人员列表
    integralpaylist:[{id:Number,userid:String,usertype:Number}],
    //是否已经注册mobim
    is_registermobim:{type:Number,default:0},
    // 学员来源
    source:{type:Number,default:0} ,  // 0 app 注册 2  后台添加  2 微信报名  .....
    // 用户支付类型
    paytype:{type:Number,default:1}, //  1 线下支付， 2 线上支付
    // 用户支付状态
    paytypestatus:{type:Number,default:0} // 0 未支付  20支付成功(等待验证)  30 支付失败
});
UserSchema.index({mobile: 1}, {unique: true});
module.exports = mongoose.model('User', UserSchema);

