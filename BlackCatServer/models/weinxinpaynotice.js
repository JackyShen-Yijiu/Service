/**
 * Created by v-yaf_000 on 2016/1/31.
 */
// 微信支付通知

// 参数说明网
//https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.Lc515P&treeId=59&articleId=103666&docType=1
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weixinPayNoticeSchema= new Schema({
    "appid":String,    //微信开放平台审核通过的应用APPID
    "bank_type": String,//银行类型，采用字符串类型的银行标识，银行类型见银行列表
    "cash_fee": String,   //现金支付金额订单现金支付金额，详见支付金额
    "fee_type": String,   //货币类型，符合ISO4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型
    "is_subscribe": String, //用户是否关注公众账号，Y-关注，N-未关注，仅在公众账号类型支付有效
    "mch_id": String,   //微信支付分配的商户号
    "nonce_str": String,  //随机字符串，不长于32位
    "openid": String,     //用户在商户appid下的唯一标识
    "out_trade_no":String,   // 商户网站唯一订单号	String(64)	对应商户网站的订单系统中的唯一订单号，非支付宝交易号。需保证在商户网站中的唯一性。
    // 是请求时对应的参数，原样返回。	可空	0822152226127
    "result_code": String,      //SUCCESS/FAIL
    "err_code": String,      //错误返回的信息描述
    "err_code_des": String,      //错误返回的信息描述
    "return_code": String,      // SUCCESS/FAIL此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断
    "return_msg": String,      // 返回信息，如非空，为错误原因签名失败参数格式校验错误
    "sign": String,                 //签名，详见签名算法
    "time_end": String,      //支付完成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其
    "total_fee": String,   //订单总金额，单位为分
    "trade_type": String,     //APP
    "transaction_id": String,   //微信支付订单号
    is_deal:{type:Number,default:0}, //  是否处理  0 未处理 1 已处理  2 处理失败  3 暂时不用处理  4 返回结果错误
    dealreamk:String,

});

weixinPayNoticeSchema.index({transaction_id: 1});
module.exports = mongoose.model('weixinpaynotice', weixinPayNoticeSchema);/**
 * Created by v-yaf_000 on 2016/3/15.
 */
