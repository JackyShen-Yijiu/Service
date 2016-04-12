/**
 * Created by v-lyf on 2015/9/6.
 */
// 预约
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema=new Schema({
    userid :{type: Schema.Types.ObjectId, ref: 'User'},// 预约课程
    coachid:{type: Schema.Types.ObjectId, ref: 'coach'}, //  预约教练
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    trainfieldid:{type: Schema.Types.ObjectId, ref: 'trainingfield'}, //  练车场id 同车学员
    trainfieldlinfo:{name:String,id:String}, //训练成信息信息

    // 预约状态
    reservationstate:{type:Number,default:0},
    //预约时间
    reservationcreatetime:{type:Date,default:Date.now()},
    // 预约 开始第几个课时
    startclassnum:Number,
        // 预约到第几个课时
    endclassnum:Number,
        //
    //  完成时间
    finishtime:Date,
    begintime:Date,
    endtime:Date,
    classdatetimedesc:String, // 上课时间描述
    //预约课程
    reservationcourse: [{type: Schema.Types.ObjectId, default:null, ref: 'course'}],
    //是否评论
    is_comment:{ type: Boolean, default: false},
    //评论
    comment:{starlevel :Number, // 星级
        attitudelevel:Number, //态度级别
        timelevel:Number,  //时间观念星级
        abilitylevel:Number,  // 能力星级
        commentcontent:String,
        commenttime:Date} , // 评论内容
    //教练是否评论
    is_coachcomment:{ type: Boolean, default: false},
    coachcomment:{starlevel :Number, // 星级
        attitudelevel:Number, //态度级别
        timelevel:Number,  //时间观念星级
        abilitylevel:Number,  // 能力星级
        commentcontent:String,
    commenttime:Date} , // 评论内容
    //是否投诉
    is_complaint:{ type: Boolean, default: false},
    // 投诉内容
    complaint :{reason:String,complaintcontent:String,complainttime:Date},
    complainthandinfo:{
        handlestate:{ type: Number, default: 0},  // 0 没有处理 ， 1 处理结束 2 处理完成
        handlemessage:{ type: String, default: ""}, // 处理消息
        operator:{ type: String, default: ""}, // 处理人
        handledatetime:Date      //处理时间
    },
    is_signin:{type: Boolean, default: false}, // 是否签到
    sigintime:Date,   // 签到时间
    // 取消预约原因
    cancelreason:{reason:String,cancelcontent:String},
    // 是否接送
    is_shuttle:{ type: Boolean, default: false},
    // 接送地址
    shuttleaddress:String,
   // 学习内容
    learningcontent:String,
    //
    contentremarks:String,
    //x学时
    coursehour:Number,
    // 课程进度描述
    courseprocessdesc :String,

    // 科目
    subject:{subjectid:{type:Number,default:2},
        name:{type:String,default:"科目二"}},
    carmodelid:Number,   // 教练类型id 12  c1 C2
    coachname:String,   //  教练名称
    username:String,    // 用户 名称
    idcardnumber:String,  // 用户身份证号
    usermobile:String,// 学员手机号
    is_sendsms:{type:Boolean,default: false}, //是否发送学员通知短信
    is_sendmessage:{type:Boolean,default: false}, // 是否发送系统通知
});

module.exports = mongoose.model('reservation', ReservationSchema);