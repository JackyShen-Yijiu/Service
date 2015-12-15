/**
 * Created by li on 2015/11/9.
 */
// 商城系统 产品列表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 商场列表
var MallProductSchema=new Schema({
    productname:String,  // 商品名字
    productprice:Number, // 商品价格金币
    productimg:String,  //商品图片
    productdesc:String, //商品描述
    viewcount:{type:Number,default:0}, // 浏览次数
    buycount:{type:Number,default:0},//  购买数量
    detailsimg:String, //产品详细描述图片
    productcount:{type:Number,default:10},  // 产品数量y
    buyprcoss:{type:String,default:''}, // 兑换流程
    is_top:{ type: Boolean, default: false}, // 是否置顶
    is_using:{ type: Boolean, default: true}, // 产品是否显示
    merchantid:{type: Schema.Types.ObjectId, ref: 'merchant'}, //商家信息
    is_scanconsumption:{ type: Boolean, default: false} //是否进行扫码消费

});


//UserSchema.index({mobile: 1}, {unique: true});
module.exports = mongoose.model('mallproduct', MallProductSchema);
