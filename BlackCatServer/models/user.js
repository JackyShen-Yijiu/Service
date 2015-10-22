/**
 * Created by metis on 2015-08-17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ImgInfo= new Schema({
    imgid :Number,
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
    gender:String, //性别
    signature:String,// 个性签名
    headportrait: { originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}},
    subject:{subjectid:{type:Number,default:0},
        name:{type:String,default:"准备报考"}}, // 要初始化 0 准备报考
    carmodel:{modelsid:Number,name:String,code:String},
    logintime:{type:Date,default:Date.now()},
    address: String,
    addresslist:[String],  //地址列表
    //维度
    latitude: {type:Number,default:0},
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    invitationcode:{type:String},  // 要初始化
    referrerCode: String,   // 被邀请码
    applystate:{type:Number,default:0}, //报名状态  0 未报名 1 申请中 2 申请成功
    // 报名信息
    applyinfo:{applytime:{type:Date,default:Date.now()},
     handelstate:{type:Number,default:0}, //处理状态 0 未处理 1 处理中 2 处理成功
        handelmessage:[String]
    },
    applyschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 申请学校
    applyschoolinfo:{name:String,id:String}, //申请学校信息
    //------------- 申请教练信息
    applycoach:{type: Schema.Types.ObjectId, ref: 'coach'},
    applycoachinfo:{name:String,id:String},
    //---------------------申请课程信息
    applyclasstype:{type: Schema.Types.ObjectId, ref: 'classtype'},
    applyclasstypeinfo:{name:String,id:String,price:Number},

    displayuserid:{type:String,default:''},
    wallet:{type:Number,default:0}, // 钱包
    is_lock: { type: Boolean, default: false},  //用户是否锁定
    idcardnumber:String, // 身份证
    telephone:String,  // 电话
   // 喜欢的教练
    favorcoach: [{type: Schema.Types.ObjectId, default:null, ref: 'coach'}],
    // 喜欢的驾校
    favorschool: [{type: Schema.Types.ObjectId, default:null, ref: 'DriveSchool'}],
    //科目二上课信息
    subjecttwo:{
        totalcourse:{type:Number,default:24},
        reservation:{type:Number,default:0},
        finishcourse:{type:Number,default:0}
    },
    // 科目三上课信息
    subjectthree:{
        totalcourse:{type:Number,default:16},
        reservation:{type:Number,default:0},
        finishcourse:{type:Number,default:0}
    },
    vipserverlist:[{id:Number,name:String}], // 我所享受的vip服务列表
    // 是否进行报考验证
    is_enrollverification :{ type: Boolean, default: false},
    // 报考信息学号还有准考证号
    enrollverificationinfo:{studentid:String,
     ticketnumber:String}

});
UserSchema.index({mobile: 1}, {unique: true});
module.exports = mongoose.model('User', UserSchema);

