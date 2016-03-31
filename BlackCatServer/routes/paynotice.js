/**
 * Created by v-yaf_000 on 2016/1/30.
 */
var express   = require('express');
var router = express.Router();
var mongodb = require('../models/mongodb.js');
var UserPayModel=mongodb.UserPayModel;
var AliPayNoticeModel=mongodb.AliPayNoticeModel;
var  UserModel=mongodb.UserModel;
var  weixinpauserver=require("../Server/weixin_payserver");
var AlipayConfig=require("../Config/sysconfig").AlipayConfig;
var moneyCalculation=require("../Server/purse/moneyCalculation");
var AlipayNotify={
    verity:function(params,callback){
        var mysign=getMySign(params);
        var sign = params["sign"]?params["sign"]:"";
        //console.log("sign");
        //console.log(sign);
        //console.log("mysine");
        //console.log(mysign);
        //console.log(mysign==sign);
        if(mysign==sign){

            var responseTxt = "true";
            if(params["notify_id"]) {
                //获取远程服务器ATN结果，验证是否是支付宝服务器发来的请求

                var partner = AlipayConfig.partner;
                var veryfy_path = AlipayConfig.HTTPS_VERIFY_PATH + "partner=" + partner + "&notify_id=" + params["notify_id"];
                //console.log(veryfy_path);
                requestUrl(AlipayConfig.ALIPAY_HOST,veryfy_path,function(responseTxt){
                    console.log("responseTxt");
                    console.log(responseTxt);
                    if(responseTxt=="true"){

                        callback(true);
                    }else{
                        callback(false);
                    }
                });
            }
            else{
                callback(false);
            }
        } else{
            callback(false);
        }

        //写日志记录（若要调试，请取消下面两行注释）
        //String sWord = "responseTxt=" + responseTxt + "\n notify_url_log:sign=" + sign + "&mysign="
        //              + mysign + "\n 返回参数：" + AlipayCore.createLinkString(params);
        //AlipayCore.logResult(sWord);


        //验证
        //responsetTxt的结果不是true，与服务器设置问题、合作身份者ID、notify_id一分钟失效有关
        //mysign与sign不等，与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
    }
};
//获取验证码
var getMySign = function (params) {
    var sPara=[];//转换为数组利于排序 除去空值和签名参数
    if(!params) return null;
    for(var key in params) {
        if((!params[key])|| key == "sign" || key == "sign_type"){
            console.log('null:'+key);
            continue;
        } ;
        sPara.push([key,params[key]]);
    }
    sPara.sort();
    //生成签名结果
    var prestr = "";
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    for (var i2 = 0; i2 < sPara.length; i2++) {
        var obj = sPara[i2];
        if (i2 == sPara.length - 1) {
            prestr = prestr + obj[0] + "=" + obj[1];
        } else {
            prestr = prestr + obj[0] + "=" + obj[1] + "&";
        }

    }
    //prestr = prestr + AlipayConfig.key; //把拼接后的字符串再与安全校验码直接连接起来
    //body=Hello&buyer_email=13758698870&buyer_id=2088002007013600&discount=-5&extra_common_param=你好，这是测试商户的广告。
    // &gmt_close=2008-10-22 20:49:46&gmt_create=2008-10-22 20:49:31&gmt_payment=2008-10-22 20:49:50&
    // gmt_refund=2008-10-29 19:38:25&is_total_fee_adjust=N&notify_id=70fec0c2730b27528665af4517c27b95&notify_time=2009-08-12
    // 11:08:32&notify_type=交易状态同步通知(trade_status_sync)&out_trade_no=3618810634349901&payment_type=1&price=10.00&quantity=1
    // &refund_status=REFUND_SUCCESS&seller_email=chao.chenc1@alipay.com&seller_id=2088002007018916&
    // sign=_p_w_l_h_j0b_gd_aejia7n_ko4_m%2Fu_w_jd3_nx_s_k_mxus9_hoxg_y_r_lunli_pmma29_t_q%3D%3D&sign_type=DSA&subject=iphone手机
    // &total_fee=10.00&trade_no=2008102203208746&trade_status=TRADE_FINISHED&use_coupon=N

    console.log(prestr);
    var crypto = require('crypto');
    //return crypto.createHash('md5').update(prestr, AlipayConfig.input_charset).digest("hex");
   //return crypto.createHash('RSA-SHA1').update(prestr, AlipayConfig.input_charset).digest("hex");
    var sign = params["sign"]?params["sign"]:"";
    var verify = crypto.createVerify('RSA-SHA1');
    verify.update(prestr,"UTF-8");
    var result = verify.verify(AlipayConfig.alipaypubkey, sign);
    console.log("验证结果："+result);
     return sign;
};
var requestUrl=function(host,path,callback){
    var https = require('https');

    var options = {
        host: host,
        port: 443,
        path: path,
        method: 'GET'
    };
    var str="";
    console.log("开始请求");
    var req = https.request(options, function(res) {
        //console.log("statusCode: ", res.statusCode);
        //console.log("headers: ", res.headers);

        var responseText='';
        res.on('data', function(chunk){
            responseText += chunk;
        });
        res.on('end', function(){
            callback && callback(responseText);
        });

    });
    req.end();
    req.on('error', function(e) {
        console.error(e);
    });
};
router.post("/alipay",function(req,res){
    //http://127.0.0.1:3000/paynotify?trade_no=2008102203208746&out_trade_no=3618810634349901&discount=-5&payment_type=1&subject=iphone%E6%89%8B%E6%9C%BA&body=Hello&price=10.00&quantity=1&total_fee=10.00&trade_status=TRADE_FINISHED&refund_status=REFUND_SUCCESS&seller_email=chao.chenc1%40alipay.com&seller_id=2088002007018916&buyer_id=2088002007013600&buyer_email=13758698870&gmt_create=2008-10-22+20%3A49%3A31&is_total_fee_adjust=N&gmt_payment=2008-10-22+20%3A49%3A50&gmt_close=2008-10-22+20%3A49%3A46&gmt_refund=2008-10-29+19%3A38%3A25&use_coupon=N&notify_time=2009-08-12+11%3A08%3A32&notify_type=%E4%BA%A4%E6%98%93%E7%8A%B6%E6%80%81%E5%90%8C%E6%AD%A5%E9%80%9A%E7%9F%A5%28trade_status_sync%29&notify_id=70fec0c2730b27528665af4517c27b95&sign_type=DSA&sign=_p_w_l_h_j0b_gd_aejia7n_ko4_m%252Fu_w_jd3_nx_s_k_mxus9_hoxg_y_r_lunli_pmma29_t_q%253D%253D&extra_common_param=%E4%BD%A0%E5%A5%BD%EF%BC%8C%E8%BF%99%E6%98%AF%E6%B5%8B%E8%AF%95%E5%95%86%E6%88%B7%E7%9A%84%E5%B9%BF%E5%91%8A%E3%80%82
    //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
    var params=req.body;
    console.log(req.body);
    var trade_no = req.body.trade_no;				//支付宝交易号
    var out_trade_no = req.body.out_trade_no;	        //获取订单号
    var total_fee = req.body.total_fee;	        //获取总金额
    var subject = req.body.subject;//商品名称、订单名称
    var body = "";
    if(req.query.body != null){
        body = req.query.body;//商品描述、订单备注、描述
    }
    var buyer_email = req.body.buyer_email;		//买家支付宝账号
    var trade_status = req.body.trade_status;		//交易状态
    //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//
    try {
        AlipayNotify.verity(params, function (result) {
            if (result) {
                console.log("验证成功");
                var tempnotice = new AliPayNoticeModel(params);
                tempnotice.save(function (err, savenoticedata) {
                    if (err) {
                        res.end("fail");
                    }

                    //////////////////////////////////////////////////////////////////////////////////////////
                    //请在这里加上商户的业务逻辑程序代码

                    //——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
                    if (trade_status == "TRADE_FINISHED") {
                        savenoticedata.is_deal = 3; //暂时不用处理
                        savenoticedata.dealreamk = "订单完成,暂时不用处理";
                        savenoticedata.save(function (err, data) {
                        });
                        res.end("success");
                        //判断该笔订单是否在商户网站中已经做过处理
                        //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                        //如果有做过处理，不执行商户的业务程序

                        //注意：
                        //该种交易状态只在两种情况下出现
                        //1、开通了普通即时到账，买家付款成功后。
                        //2、开通了高级即时到账，从该笔交易成功时间算起，过了签约时的可退款时限（如：三个月以内可退款、一年以内可退款等）后。
                    } else if (trade_status == "TRADE_SUCCESS") {

                        UserPayModel.findById(out_trade_no, function (err, userpaydata) {
                            if (err) {
                                savenoticedata.is_deal = 2; //暂时不用处理
                                savenoticedata.dealreamk = "查询订单失败：" + err;
                                savenoticedata.save(function (err, data) {
                                });
                                res.end("fail");
                            }
                            if (!userpaydata||userpaydata===undefined) {
                                savenoticedata.is_deal = 2; //暂时不用处理
                                savenoticedata.dealreamk = "没有查询到订单";
                                savenoticedata.save(function (err, data) {
                                });
                               return res.end("fail");
                            }
                            // 判断订单状态
                            if (userpaydata.userpaystate == 2 || userpaydata.userpaystate==4) {
                                savenoticedata.is_deal = 2; //暂时不用处理
                                savenoticedata.dealreamk = "订单状态是" + userpaydata.userpaystate + "咱不做处理";
                                savenoticedata.save(function (err, data) {
                                });
                                res.end("fail");
                            }
                            // 判断订单金额
                            if (total_fee != userpaydata.paymoney) {
                                savenoticedata.is_deal = 2; //暂时不用处理
                                savenoticedata.dealreamk = "订单金额不对无法完成支付";
                                savenoticedata.save(function (err, data) {
                                });
                                res.end("fail");
                            }
                            // 可以支付
                            userpaydata.userpaystate = 2;
                            userpaydata.beginpaytime = new Date();
                            userpaydata.paychannel = 1; // 支付宝
                            userpaydata.trade_no = trade_no;
                            userpaydata.paynoticeid = savenoticedata._id;
                            userpaydata.save(function (err, data) {
                                if (err) {
                                    savenoticedata.is_deal = 2; //失败
                                    savenoticedata.dealreamk = "保存订单完成 失败：" + err;
                                    savenoticedata.save(function (err, data) {
                                    });
                                    res.end("fail");
                                }
                                UserModel.update({"_id":data.userid},{"paytypestatus":20,"applystate":2,"paytype":2,
                                "subject.subjectid":1, "subject.name":"科目一"},{safe: false},function(err,data){});
                               //生成Y吗
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
                //////////////////////////////////////////////////////////////////////////////////////////
            } else {
                console.log("验证失败");
                res.end("fail");
            }

        });
    }
    catch (ex){
        console.log("接受支付宝消息失败："+ex);
    }

});

router.post("/weixin",weixinpauserver.paycallback);


module.exports = router;