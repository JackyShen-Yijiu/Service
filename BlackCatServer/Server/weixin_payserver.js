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
var mongodb = require('../models/mongodb.js');
var moneyCalculation=require("./purse/moneyCalculation");
var WeiXinPayNotice =mongodb.WeiXinPayNotice;
var UserPayModel=mongodb.UserPayModel;
var  UserModel=mongodb.UserModel;

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
    console.log("收到微信支付回传");
    console.log(msg);
    var tempnotice = new WeiXinPayNotice(msg);
    tempnotice.save(function (err, savenoticedata) {
        if (err) {
            res.fail();
        }

        //////////////////////////////////////////////////////////////////////////////////////////
        //请在这里加上商户的业务逻辑程序代码

        //——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
        if (msg.return_code == "FAIL") {
            savenoticedata.is_deal = 4; //返回 结果错误
            savenoticedata.dealreamk = "结果错误："+msg.return_msg;
            savenoticedata.save(function (err, data) {
            });
            res.success();
        }else if(msg.result_code == "FAIL"){
            savenoticedata.is_deal = 4; //返回 结果错误
            savenoticedata.dealreamk = "结果错误："+msg.err_code+msg.err_code_des;
            savenoticedata.save(function (err, data) {
            });
        }
        else if (msg.result_code == "SUCCESS") {

            UserPayModel.findById(msg.out_trade_no, function (err, userpaydata) {
                if (err) {
                    savenoticedata.is_deal = 2; //暂时不用处理
                    savenoticedata.dealreamk = "查询订单失败：" + err;
                    savenoticedata.save(function (err, data) {
                    });
                    res.fail();
                }
                if (!userpaydata||userpaydata===undefined) {
                    savenoticedata.is_deal = 2; //暂时不用处理
                    savenoticedata.dealreamk = "没有查询到订单";
                    savenoticedata.save(function (err, data) {
                    });
                    res.success();
                }
                // 判断订单状态
                if (userpaydata.userpaystate == 2 || userpaydata.userpaystate==4) {
                    savenoticedata.is_deal = 2; //暂时不用处理
                    savenoticedata.dealreamk = "订单状态是" + userpaydata.userpaystate + "不做处理";
                    savenoticedata.save(function (err, data) {
                    });
                    res.success();
                }
                // 判断订单金额
                if (msg.total_fee != userpaydata.paymoney*100) {
                    savenoticedata.is_deal = 2; //暂时不用处理
                    savenoticedata.dealreamk = "订单金额不对无法完成支付";
                    savenoticedata.save(function (err, data) {
                    });
                    res.fail();
                }
                // 可以支付
                userpaydata.userpaystate = 2; // 支付成功
                userpaydata.beginpaytime = new Date();
                userpaydata.paychannel = 2; //微信
                userpaydata.trade_no = msg.transaction_id;
                userpaydata.paynoticeid = savenoticedata._id;
                userpaydata.save(function (err, data) {
                    if (err) {
                        savenoticedata.is_deal = 2; //失败
                        savenoticedata.dealreamk = "保存订单完成 失败：" + err;
                        savenoticedata.save(function (err, data) {
                        });
                        res.end("fail");
                    }
                    UserModel.update({"_id":data.userid},{"paytypestatus":20,"applystate":2,"paytype":2},{safe: false},function(err,data){});
                    UserModel.findById(new mongodb.ObjectId(data.userid),function(err,userdata){
                        var  userinfo={
                            referrerfcode:userdata.referrerfcode,
                            userid:userdata._id,
                            usertype:1,
                            invitationcode:userdata.invitationcode,
                            "applyclasstype":userdata.applyclasstype
                        }
                        moneyCalculation.applySuccess(userinfo,function(err,data){});
                    });
                    savenoticedata.is_deal = 1; //成功
                    savenoticedata.dealreamk = "保存订单更新成功";
                    savenoticedata.save(function (err, data) {
                    });
                    res.end("success");
                })
            })
            //判断该笔订单是否在商户网站中已经做过处理
            //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
            //如果有做过处理，不执行商户的业务程序

            //注意：
            //该种交易状态只在一种情况下出现——开通了高级即时到账，买家付款成功后。
        } else {
            savenoticedata.is_deal = 3; //暂时不用处理
            savenoticedata.dealreamk = "暂时不用处理";
            savenoticedata.save(function (err, data) {
            });
            res.end("success");
        }

        //——请根据您的业务逻辑来编写程序（以上代码仅作参考）——

        res.end("success");	//请不要修改或删除——
    })
    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    res.success();
})

