/**
 * Created by v-yaf_000 on 2016/3/12.
 */
/**
 * Created by v-yaf_000 on 2016/3/11.
 */

var  app=require("../Config/sysconfig").weixinconfig;
var  merchant=require("../Config/sysconfig").merchant;
var fs=require("fs");
var WXPay = require('weixin-pay');

var wxpay = WXPay({
    appid: app.id,
    mch_id: merchant.id,
    partner_key:merchant.key , //微信商户平台API密钥
    pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书
});

//wxpay.createUnifiedOrder({
//    body: '扫码支付测试',
//    out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
//    total_fee: 1,
//    spbill_create_ip: '192.168.2.210',
//    notify_url: 'http://wxpay_notify_url',
//    trade_type: 'APP',
//   // product_id: '1234567890'
//}, function(err, result){
//    console.log(err);
//    console.log(result);
//});

exports.createUnifiedOrder=function(payinfo,callback){

    wxpay.createUnifiedOrder(payinfo,function(err,data){
        console.log(err);
        console.log(data);
        callback(err,data);
    })
}

exports.sign=function(parm){
    return wxpay.sign(parm);
}
exports.paycallback=wxpay.useWXCallback(function(msg, req, res, next){
    // 处理商户业务逻辑
    console.log(msg);
    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    res.success();
})

