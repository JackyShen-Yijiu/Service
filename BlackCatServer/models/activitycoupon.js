/**
 * Created by v-yaf_000 on 2016/1/29.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitycouponSchema=new Schema({
    mobile:String, // 用户ID
    createtime:{type:Date,default:Date.now()}, //创建时间
    endtime:{type:Date,default:Date.now()},
    usetime:Date,
    couponcode:String,  //优惠码
    couponmoney:Number, // 优惠金额
    state:{type:Number,default:0},    //   1未消费  2过期  3作废    4 已消费
    remark:String,   // 备注信息
});
ActivitycouponSchema.index({mobile: 1});
ActivitycouponSchema.index({couponcode:-1});
module.exports = mongoose.model('activitycoupon', ActivitycouponSchema);