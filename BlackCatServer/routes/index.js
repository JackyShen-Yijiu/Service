
var    BaseReturnInfo = require('../Module/basereturnmodel.js');
var mongodb = require('../BlackCatDal/mongodb.js');
var smscodemodule=require('../Common/sendsmscode').sendsmscode;
var  Apperversion= mongodb.AppVersionModel;
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
//var mobileVerify = /^13\d{9}|14[57]\d{8}|15[012356789]\d{8}|18[01256789]\d{8}|170\d{8}$/;
var resendTimeout = 60;
//var mobileVerify = /^13\d{9}|14[57]\d{8}|15[012356789]\d{8}|18[01256789]\d{8}|170\d{8}$/;
var mobileVerify = /^1\d{10}$/;
/**
 * 测试api 调用方法
 **/
exports.TestAPI = function (req, res) {
 return  res.json(
      new BaseReturnInfo(1,"","hello, BlackCate"))

}
/*
获取app的版本信息
*/

exports.appVersion=function(req,res){
  var apptype=req.params.type;
   if (apptype>4||apptype<1||apptype === undefined)
   {
       return res.status(500).send(new BaseReturnInfo(0,"请求参数错误",""));
   }
   /* var appverison =new Apperversion();
    appverison.name="andorid yonghukehuand";
    appverison.apptype=1;
    appverison.versionCode='v1.0';
    appverison.updateMessage="�???";
    appverison.downloadUrl="www.baidu.com";
    appverison.updateTime=Date.now();

    appverison.save(function(err, data) {
        if (err) {
            console.log("save appverison err"+err);
        }
        else
        {
            console.log("save appverison  sucess");
        }
    });*/
    Apperversion.getVersionInfo(apptype, function(err, data) {
        if (err) {
            return res.status(500).send(new BaseReturnInfo(0, "Internal Server Error", err));
        }
        return res.json(
         new BaseReturnInfo(1,"",data)
        );
    })
};

// 获取手机验证码
exports.fetchCode=function(req,res){
    var mobile = req.params.mobile;
    if (mobile === undefined) {
        req.log.warn({err: 'no mobile in query string'});
        return; res.status(400).json(
            new BaseReturnInfo(0,"No mobile number",""));
    }
    var number = mobileVerify.exec(mobile);
    if (number != mobile) {
        req.log.warn({err: 'invalid mobile number'});
        return res.status(400).json(
            new BaseReturnInfo(0,"Bad mobile number","")
           );
    }
    smsVerifyCodeModel.findOne({mobile:req.params.mobile},function(err,instace)
        {
            if(err)
            {
               return  res.status(500).json(
                   new BaseReturnInfo(0,"Error occured: " + err,"")
               );
            }
            if(instace){
                var  now= new Date();
                if ((now-instace.createdTime)<resendTimeout*1000){
                    return res.status(500).json(
                        new BaseReturnInfo(0,"","Wait a moment to send again"))
                }

            }
            else{
                instace.remove(function(err){
                    if(err){
                        return  res.status(500).json.(
                            new  BaseReturnInfo(0,"Error occured while removing: " + err,"")
                            );
                    }
                    smscodemodule(mobile,function)
                });


            }


        }
    );

};

/// ???????????
var sendSmsResponse = function(res, error, response){
    if(error || response.statusCode != 200){
        res.status(500).json({
            type: false,
            message: "Error occured in sending sms: " + error
        });
        return;
    }

    // get back to user
    res.status(200).json({
        timeout: resendTimeout
    });
};



