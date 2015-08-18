var    BaseReturnInfo = require('../Module/basereturnmodel.js');
var mongodb = require('../BlackCatDal/mongodb.js');
var  commondata=require('../Common/commondata');
var smscodemodule=require('../Common/sendsmscode').sendsmscode;
var jwt = require('jsonwebtoken');
var usermodel=mongodb.UserModel;
var secretParam= require('./jwt-secret').secretParam;

var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var resendTimeout = 60;
var timeout = 60 * 5;
var mobileVerify = /^1\d{10}$/;
// 获取手机验证码
exports.fetchCode=function(req,res){
   var mobile = req.params.mobile;

   if (mobile === undefined) {
      //req.log.warn({err: 'no mobile in query string'});
      return; res.status(400).json(
          new BaseReturnInfo(0,"No mobile number",""));
   }
   var number = mobileVerify.exec(mobile);
   if (number != mobile) {
      //req.log.warn({err: 'invalid mobile number'});
      return res.status(400).json(
          new BaseReturnInfo(0,"Bad mobile number","")
      );
   }
   //console.log("fetchCode mobile:"+mobile)
   smsVerifyCodeModel.findOne({mobile:mobile},function(err,instace)
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
             else{
                instace.remove(function(err){
                   if(err){
                      return  res.status(500).json(
                          new  BaseReturnInfo(0,"Error occured while removing: " + err,"")
                      );
                   }
                   smscodemodule(mobile,function(err,response){
                      sendSmsResponse(res,err,response);
                   });
                });
             }

          }
          else{
             // now send
             smscodemodule(req.params.mobile, function(error, response){
                sendSmsResponse(res, error, response);
             });


          }


       }
   );

};

/// 处理返回验证码信息
var sendSmsResponse = function(res, error, response){
   if(error || response.statusCode != 200){
      res.status(500).json(
          new BaseReturnInfo(0,"Error occured in sending sms: " + error,"")
      );
      return;
   }

   // get back to user
   res.status(200).json(
       new BaseReturnInfo(1," ","send success"));
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

exports.UserLogin=function(req,res){
   console.log(req.body);
  var mobile=req.body.mobile;
   var smscode=req.body.smscode;
   checkSmsCode(mobile,smscode,function(err){
      if(err){
         return res.status(500).json(new BaseReturnInfo(0,err,""));

      }
      usermodel.findOne({mobile:mobile}, function (err, userinstace) {
         if(err){
            return res.status(500).json(new BaseReturnInfo(0,"find user err:"+err,""));
         }
         if (userinstace)
         {
            var token = jwt.sign({userId: userinstace._id, timestamp: new Date(), aud: secretParam.audience}, secretParam.secret);
            userinstace.token=token;
            userinstace.logintime=Date.now();
            userinstace.save(function(err,newinstace){
               if(err){
                  return res.status(500).json(new BaseReturnInfo(0,"find user err:"+err,""));
               }
               return res.json(new BaseReturnInfo(1,'',{
                  token: token,
                  mobile: mobileObfuscator(req.body.mobile),
                  userId: newinstace._id
               }));
            });
         }else{
            var newuser=new usermodel();
             newuser.mobile=mobile;
             newuser.create=new Date();
             usermodel.save(function(err,newinstace){
                if(err){
                   return res.status(500).json(new BaseReturnInfo(0,"find user err:"+err,""));
                }
                var token = jwt.sign({userId: newinstace._id, timestamp: new Date(), aud: secretParam.audience}, secretParam.secret);
                return res.json(new BaseReturnInfo(1,'',{
                   token: token,
                   mobile: mobileObfuscator(req.body.mobile),
                   userId: newinstace._id
                }));
             });
         }
      })
   });
};
var mobileObfuscator = function(mobile){
   mobile = mobile.substr(0, 3) + "****" + mobile.substr(7, 4);
   return mobile;
};

//获取科目
exports.GetSubject=function(req,res){
   var subject=commondata.subject;
   return res.json( new BaseReturnInfo(1,'',subject));
}
exports.GetCarModel=function(req,res){
   var carmodels=commondata.carmodels;
   return res.json(new BaseReturnInfo(1,'',carmodels));
}