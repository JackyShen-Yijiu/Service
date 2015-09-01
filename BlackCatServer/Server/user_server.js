/**
 * Created by metis on 2015-08-31.
 */
var smscodemodule=require('../Common/sendsmscode').sendsmscode;
var mongodb = require('../models/mongodb.js');

var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var jwt = require('jsonwebtoken');
var userTypeEmun=require("../custommodel/emunapptype").UserType;
var resendTimeout = 60;
var usermodel=mongodb.UserModel;
var secretParam= require('./jwt-secret').secretParam;
var timeout = 60 * 5;


/// 处理返回验证码信息
var sendSmsResponse = function( error, response,callback){
    if(error || response.statusCode != 200){
        return callback("Error occured in sending sms: " + error);
    }

    // get back to user
    return callback(null,"Error occured in sending sms: " + error);
};
exports.getCodebyMolile=function(mobilenumber,callback){
    smsVerifyCodeModel.findOne({mobile:mobilenumber},function(err,instace)
        {
            if(err)
            {
                return callback("Error occured: " + err);
            }
            if(instace){
                var  now= new Date();
                console.log(now-instace.createdTime);
                if ((now-instace.createdTime)<resendTimeout*1000){
                    return callback("Wait a moment to send again");
                }
                else{
                    instace.remove(function(err){
                        if(err){
                            return callback("Error occured while removing: " + err,"");
                        }
                        smscodemodule(mobilenumber,function(err,response){
                           // console.log('调用成功');
                            return  sendSmsResponse(err,response,callback);
                        });
                    });
                }

            }
            else{
                // now send
                smscodemodule(mobilenumber, function(error, response){
                 return   sendSmsResponse( error, response,callback);
                });
            }


        }
    );
};

exports.userSignup=function(usertype,userinfo,callback){
    console.log("检测验证码");
    checkSmsCode(userinfo.mobile,userinfo.smscode,function(err){
        if(err){
            return  callback(err);

        }
        if (usertype==userTypeEmun.User) {
            usermodel.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
                if (err) {
                    return callback( "find user err:" + err);
                }
                if (userinstace) {
                    return callback( "User already exists");
                   /* var token = jwt.sign({
                        userId: userinstace._id,
                        timestamp: new Date(),
                        aud: secretParam.audience
                    }, secretParam.secret);
                    userinstace.token = token;
                    userinstace.logintime = Date.now();
                    userinstace.save(function (err, newinstace) {
                        if (err) {
                            return res.status(500).json(new BaseReturnInfo(0, "find user err:" + err, ""));
                        }
                        return res.json(new BaseReturnInfo(1, '', {
                            token: token,
                            mobile: mobileObfuscator(req.body.mobile),
                            userId: newinstace._id
                        }));
                    });*/
                } else {
                    var newuser = new usermodel();
                    newuser.mobile = userinfo.mobile;
                    newuser.create = new Date();
                    newuser.referrerCode=userinfo.referrerCode;
                    newuser.password= userinfo.password;
                    newuser.save(function (err, newinstace) {
                        if (err) {
                            return callback("save user error");
                        }
                        var token = jwt.sign({
                            userId: newinstace._id,
                            timestamp: new Date(),
                            aud: secretParam.audience
                        }, secretParam.secret);
                        return callback(null,{
                            token: token,
                            mobile: mobileObfuscator(userinfo.mobile),
                            userId: newinstace._id
                        })

                    });
                }
            })
        }else if(usertype==userTypeEmun.Coach){
            callback("The method has not been achieved");
        }
    });
};

// 验证手机验证码
var checkSmsCode=function(mobile,code,callback){
    smsVerifyCodeModel.findOne({mobile:mobile,smsCode:code, verified: false},function(err,instace){
        if(err)
        {
            return callback("Error occured: "+ err);
        }
        if (!instace)
        {
            return callback("No such code/mobile was found");
        }
        var  now=new Date();
        if ((now-instace.createtime)>timeout*1000){
            return callback("Code timeout");
        }
        instace.verified=true;
        instace.save(function(err,temp){
            if (err)
            {
                return callback("Error occured:"+err);
            }
            return callback(null);
        })

    });
}
// 格式化手机号
var mobileObfuscator = function(mobile){
    mobile = mobile.substr(0, 3) + "****" + mobile.substr(7, 4);
    return mobile;
};

