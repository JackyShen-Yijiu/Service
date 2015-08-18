/**
 * Created by metis on 2015-08-17.
 */

var mongodb = require('../BlackCatDal/mongodb.js');
var request = require('superagent');

var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;

exports.sendsmscode=function(mobile,callback){
    var smscode=parseInt(Math.random()*90000+10000);
    console.log("sendsmscode mobile:"+mobile);
    var smscodeInstace=new smsVerifyCodeModel();
    smscodeInstace.mobile=mobile;
    smscodeInstace.smsCode=smscode;
    smscodeInstace.createdTime=Date.now();
    smscodeInstace.save(function(err,user){
        if(err){
            if(callback!=undefined){
                return callback(err);
            }
        }
        var sms = '????????' + smscode + '???????????????????????????????????????';
        var options  = {
            "sn": "SDK-WSS-010-08341",
            "pwd": "DD6929B3420DA8E2785261FBF1074440",
            "mobile": mobile,
            "content": sms,
            "ext":"",
            "stime":"",
            "rrid":"",
            "msgfmt":""
        };
        request
            //.post('http://yunpian.com/v1/sms/send.json')
            //.get('http://sdk2.zucp.net:8060/webservice.asmx/mt') // gb2312 interface, no 'msgfmt' field
            //.get('http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend')  // utf8 interface
            .post('http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend')  // utf8 interface
            //.set('Content-Type', 'text/plain')        // enable this when use gb2312
            //.query(queryString)                       // enable this when use gb2312
            //.query(options)
            .send(options)
            .type('form')
            .end(function(err, res){
                //console.log(res)
                callback(err, res);
            });

    });
}

