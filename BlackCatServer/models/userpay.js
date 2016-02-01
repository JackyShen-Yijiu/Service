/**
 * Created by v-yaf_000 on 2016/1/30.
 */

// 用户支付信息
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPaySchema= new Schema({
    userid:{type: Schema.Types.ObjectId, ref: 'User'},   // 用户userid
    userpaystate:{type:Number,default:0} , // 0 订单生成    2 支付成功 3 支付失败 4 订单取消
    creattime:Date,  // 订单生成时间
    payendtime:Date,                  // 支付订单结束时间
    beginpaytime:Date,// 开始 支付时间
    paychannel:{type:Number,default:0} , // 支付渠道  0 暂未选择  1 支付宝  2 微信
    applyschoolinfo:{name:String,id:String}, //申请学校信息
    applyclasstypeinfo:{name:String,id:String,price:Number,onsaleprice:Number}, // 报考班型 信息
    // 活动优惠卷
    activitycoupon:{type: Schema.Types.ObjectId, ref: 'activitycoupon'},
    couponcode:String,  // 优惠卷
    // 优惠金额
    discountmoney:{type:Number,default:0},
    paymoney:Number,   // 实际支付金额
    trade_no:String, // 支付宝中生成的交易号
    paynoticeid:String // 关联支付宝通知表
});

UserPaySchema.index({userid: 1});
module.exports = mongoose.model('userpay', UserPaySchema);