/**
 * Created by v-yaf_000 on 2015/12/8.
 */
//商家信息表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 商场列表
var MerchantSchema=new Schema({
    name:String,  // 商家名字
    mobile: { type: String, index: true},  // 手机号
    address:String,  // 商家地址
    desc:String, //商家描述
    confirmnum:String, // 商家确认码
    confirmmobilelist:[String] ,//  商家用于确认的手机号
    province: {type:String,default:''}, // 省
    city: {type:String,default:''}, // 市
    county:{type:String,default:''},// 县
    address:{type:String,default:''}  // 地址
});


module.exports = mongoose.model('merchant', MerchantSchema);