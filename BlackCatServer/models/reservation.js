/**
 * Created by v-lyf on 2015/9/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema=new Schema({
    userid :{type: Schema.Types.ObjectId, ref: 'User'},// 预约课程
    coachid:{type: Schema.Types.ObjectId, ref: 'coach'}, //  预约教练
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
});

module.exports = mongoose.model('reservation', ReservationSchema);