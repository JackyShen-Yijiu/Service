   /**
 * Created by v-yaf_000 on 2015/12/26.
 */
//优惠券信

   var mongoose = require('mongoose');
   var Schema = mongoose.Schema;

   var couponSchema=new Schema({
       userid:String, // 用户ID
       createtime:{type:Date,default:Date.now()}, //创建时间
       couponcomefrom:{type:Number,default:1},// 优惠券来源  1 报名奖励   2 活动奖励
       sysincomeid:String,  // 如果是报名所得，报名收入id
       is_forcash:{type:Boolean,default:false}, // 是否可以兑换现金
       state:{type:Number,default:0},    // 0未领取  1领取  2过期  3作废    4 已消费
       remark:String     // 备注信息
   });

   couponSchema.index({userid: 1});
   couponSchema.index({createtime:-1});
   module.exports = mongoose.model('coupon', couponSchema);