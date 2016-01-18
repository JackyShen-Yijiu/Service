/**
 * Created by v-yaf_000 on 2016/1/15.
 */
// 微信相关操作

var request = require('superagent');
var cache=require("./cache");
var sign = require('./wenxin/sign.js');
//获取微信的accesstoken
var  getaccesstoken=function(callback){
    cache.get("weixinaccesstoken",function(err,data) {
        //if(err){
        //    return callback(err);
        //}
        if (data) {
            return callback(null, data);
        } else {
            request
                .get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx687edf91584139a4&secret=ceed3256fd3787839e0d16bf1c98338f")
                .end(function (err, res) {
                    if (err) {
                        return callback("获取accesstoken出错：" + err);
                    }
                    if (res.statusCode == 200) {
                        var resmsg=JSON.parse(res.text);
                        console.log(resmsg.access_token);
                        if (resmsg.access_token === undefined) {
                            return callback("没有获取到accesstoken，errcode：" + resmsg.errcode + resmsg.errmsg);
                        }
                        var weixinaccesstoken = resmsg.access_token;
                        cache.set("weixinaccesstoken", weixinaccesstoken, resmsg.expires_in, function (err, coachdata) {
                        });
                        return callback(null, weixinaccesstoken);
                        //access_token
                        //expires_in
                    }
                    else {
                        return callback("获取accesstoken出错:" + res.statusCode)
                    }

                    //statusCode
                    //text

                })
        }
    });
};

//  获取jsapi_ticket
var getjsapi_ticket=function(callback){
    getaccesstoken(function(err,accesstokendata){
        if(err){
            return  callback(err);
        }
        cache.get("weixinjsapi_ticket",function(err,data) {
            if(err){
                return callback(err);
            }
            if (data) {
                return callback(null, data);
            } else {
                request
                    .get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+accesstokendata+"&type=jsapi")
                    .end(function (err, res) {
                        if (err) {
                            return callback("getjsapi_ticket：" + err);
                        }
                        console.log(res.body);
                        if (res.statusCode == 200) {


                            if (res.body.errcode != 0) {
                                return callback("getjsapi_ticket，errcode：" + res.body.errcode + res.body.errmsg);
                            }
                            var jsapi_ticket = res.body.ticket;
                            cache.set("weixinjsapi_ticket", jsapi_ticket, res.body.expires_in, function (err, coachdata) {});
                            return callback(null, jsapi_ticket);
                        }
                        else {
                            return callback("获取getjsapi_ticket出错:" + res.statusCode)
                        }

                    })
            }
        });
    });
}

// 生成签名
var  getwenxinsing=function(callback){
        cache.get("getwenxinsing",function(err,data) {
            //if(err){
            //    return callback(err);
            //}
            if (data) {
                return callback(null, data);
            } else {
                getjsapi_ticket(function (err, jsapidata) {
                    if (err) {
                        return callback(err);
                    }
                    var signinfo = sign(jsapidata, "www.baidu.com");
                    var retruninfo = {
                        appId: "wx687edf91584139a4",
                        timestamp: signinfo.timestamp,
                        nonceStr: signinfo.nonceStr,
                        signature: signinfo.signature
                    }
                    cache.set("getwenxinsing", retruninfo, 60*60, function (err, coachdata) {
                    });
                    return callback(null, retruninfo);
                })
            }});
}

exports.weixinSignature=getwenxinsing;
//getwenxinsing(function(err,data){
//    console.log(data)
//})
//{
//    "errcode":0,
//    "errmsg":"ok",
//    "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
//    "expires_in":7200
//}

/*
 *something like this
 *{
 *  jsapi_ticket: 'jsapi_ticket',
 *  nonceStr: '82zklqj7ycoywrk',
 *  timestamp: '1415171822',
 *  url: 'http://example.com',
 *  signature: '1316ed92e0827786cfda3ae355f33760c4f70c1f'
 *}
 */

//wx.config({
//    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//    appId: '', // 必填，公众号的唯一标识
//    timestamp: , // 必填，生成签名的时间戳
//    nonceStr: '', // 必填，生成签名的随机串
//    signature: '',// 必填，签名，见附录1
//    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//});