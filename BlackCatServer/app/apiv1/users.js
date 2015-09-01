var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var    customUserinfo = require('../../custommodel/userinfomodel.js').userInfo;
var mongodb = require('../../models/mongodb.js');
var userserver=require('../../Server/user_server');


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
 //  console.log("fetchCode mobile:"+mobile)
   userserver.getCodebyMolile(number,function(err){
      if(err){
        // console.log(number+"fabushi");
         return  res.json(
             new BaseReturnInfo(0,err,""));
      }
      else
      {
         return  res.json(
          new BaseReturnInfo(1,"","send success"));
      }
   });

};



exports.UserLogin=function(req,res){
   console.log(req.body);
  var mobile=req.body.mobile;
   var smscode=req.body.smscode;

};
exports.postSignUp=function(req,res){
   console.log(req.body);
   var usertype=req.body.usertype;
  var userinfo=new customUserinfo();
   userinfo.mobile=req.body.mobile;
   userinfo.smscode=req.body.smscode;
   userinfo.password=req.body.password;
   userinfo.referrerCode=req.body.referrerCode;

   console.log('moblie:'+userinfo.mobile);
   if (usertype===undefined||userinfo.mobile === undefined||
       userinfo.smscode === undefined||userinfo.password === undefined) {
      return res.json(
          new BaseReturnInfo(0,"参数错误",""));
   }

   userserver.userSignup(usertype,userinfo,function(err,data){
      console.log('kaishizhce');
      if(err){
         console.log('error');
         return res.json(new  BaseReturnInfo(0,err,""));
      }
      else{
         return res.json(new BaseReturnInfo(0,"",data));
      }
   });



};


