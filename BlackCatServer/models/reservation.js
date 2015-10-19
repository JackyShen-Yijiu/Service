/**
 * Created by v-lyf on 2015/9/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema=new Schema({
    userid :{type: Schema.Types.ObjectId, ref: 'User'},// 预约课程
    coachid:{type: Schema.Types.ObjectId, ref: 'coach'}, //  预约教练
    trainfieldid:{type: Schema.Types.ObjectId, ref: 'trainingfield'}, //  练车场id 同车学员
    // 预约状态
    reservationstate:{type:Number,default:0},
    //预约时间
    reservationcreatetime:{type:Date,default:Date.now()},
    //  完成时间
    finishtime:Date,
    begintime:Date,
    endtime:Date,
    //预约课程
    reservationcourse: [{type: Schema.Types.ObjectId, default:null, ref: 'course'}],
    //是否评论
    is_comment:{ type: Boolean, default: false},
    //评论
    comment:{starlevel :Number, // 星级
        commentcontent:String  } , // 评论内容
    //教练是否评论
    is_coachcomment:{ type: Boolean, default: false},
    coachcomment:{starlevel :Number, // 星级
        commentcontent:String  } , // 评论内容
    //是否投诉
    is_complaint:{ type: Boolean, default: false},
    // 投诉内容
    complaint :{reason:String,complaintcontent:String},
    // 取消预约原因
    cancelreason:{reason:String,cancelcontent:String},
    // 是否接送
    is_shuttle:{ type: Boolean, default: false},
    // 接送地址
    shuttleaddress:String,

    //x学时
    coursehour:Number,
    subject:{subjectid:{type:Number,default:2},
        name:{type:String,default:"科目二"}},
});

module.exports = mongoose.model('reservation', ReservationSchema);