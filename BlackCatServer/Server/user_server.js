/**
 * Created by metis on 2015-08-31.
 */
var smscodemodule=require('../Common/sendsmscode').sendsmscode;
var addtestsmscode=require('../Common/sendsmscode').addsmscode;
var mongodb = require('../models/mongodb.js');
var geolib = require('geolib');
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var jwt = require('jsonwebtoken');
var userTypeEmun=require("../custommodel/emunapptype").UserType;
var resbaseuserinfomodel=require("../custommodel/returnuserinfo").resBaseUserInfo;
var resbasecoachinfomode=require("../custommodel/returncoachinfo").resBaseCoachInfo;
var appTypeEmun=require("../custommodel/emunapptype");
var regisermobIm=require('../Common/mobIm');
var appWorkTimes=require("../Config/commondata").worktimes;
var auditurl=require("../Config/sysconfig").validationurl;
var secretParam= require('./jwt-secret').secretParam;
var resendTimeout = 60;
var usermodel=mongodb.UserModel;
var coachmode=mongodb.CoachModel;
var userCountModel=mongodb.UserCountModel;
var schoolModel=mongodb.DriveSchoolModel;
var classtypeModel=mongodb.ClassTypeModel;
var trainfieldModel=mongodb.TrainingFieldModel;
var integralListModel=mongodb.IntegralListModel;
var mallProductModel=mongodb.MallProdcutsModel
var mallOrderModel=mongodb.MallOrderModel;
require('date-utils');

var timeout = 60 * 5;


/// ��������֤����Ϣ
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
                //console.log(now-instace.createdTime);
                if ((now-instace.createdTime)<resendTimeout*1000){
                    return callback("Wait a moment to send again");
                }
                else{
                    instace.remove(function(err){
                        if(err){
                            return callback("Error occured while removing: " + err,"");
                        }
                        if(mobilenumber.substr(0,8)=="18444444"){
                            addtestsmscode(mobilenumber,callback)
                        }else{
                        smscodemodule(mobilenumber,function(err,response){
                           // console.log('���óɹ�');
                            return  sendSmsResponse(err,response,callback);
                        });}
                    });
                }

            }
            else{
                // now send
                if(mobilenumber.substr(0,8)=="18444444"){
                    addtestsmscode(mobilenumber,callback)
                }else{
                smscodemodule(mobilenumber, function(error, response){
                 return   sendSmsResponse( error, response,callback);
                });}
            }


        }
    );
};
exports.verifyUserExists=function(usertype,mobile,callback){
    if (usertype==userTypeEmun.User) {
        usermodel.findOne({mobile: mobile})
            .select("_id")
            .exec(function (err, userinstace) {
            if (err)
            {
                return callback ("查找用户出错:"+ err);
            }
                if(!userinstace){
                    return callback(null,0);
                }else {
                            return callback(null,1);
                    }
        });
    }
   else if(usertype==userTypeEmun.Coach){
        coachmode.findOne({mobile: mobile})
            .select("_id")
            .exec(function (err, userinstace) {
                if (err)
                {
                    return callback ("查找用户出错:"+ err);
                }
                if(!userinstace){
                    return callback(null,0);
                }else {
                    return callback(null,1);
                }
            });
    }
}
// 修改记录
payuserIntegral=function(payinfo,callback){
    var integralinfo=new integralListModel;
    integralinfo.userid=payinfo.userid;
    integralinfo.usertype=payinfo.usertype;
    integralinfo.amount=payinfo.amount;
    integralinfo.type=payinfo.type;
    integralinfo.save(function(err,data){
        if(err){
            return callback("保存失败")
        }
        if(payinfo.usertype==appTypeEmun.UserType.User){
            usermodel.update({"_id":new mongodb.ObjectId(payinfo.userid)},{$inc: { wallet: payinfo.amount }},function(err,data){
                if(err){
                    return callback("保存失败")
                }
              return  callback(null,"suncess");
            })

        }else if(payinfo.usertype==appTypeEmun.UserType.Coach){
            coachmode.update({"_id":new mongodb.ObjectId(payinfo.userid)},{$inc: { wallet: payinfo.amount }},function(err,data){
                if(err){
                    return callback("保存失败")
                }
               return  callback(null,"suncess");
            })
        }
    })
}
userpayprocess=function(userdata,info,callback){
    mallProductModel.findById(new mongodb.ObjectId(info.productid),function(err,productdata){
        if (err){
            return  ("查找商品出错:"+err)
        }
        if(!productdata){
            if(!userdata){
                return callback("没有查找到商品");
            }
        }
        if(userdata.wallet<productdata.productprice){
            return callback("对不起，您的金币不足，无法购买商品");
        }
        var payinfo={
            userid:userdata._id,
            usertype:info.usertype,
            amount:productdata.productprice*(-1),
            type:appTypeEmun.IntegralType.buyproduct
        }
        payuserIntegral(payinfo,function(err,data){
            if(err){
                return callback("购买商品失败");
            }
            var order= new  mallOrderModel;
            order.userid=userdata._id;
            order.usertype=info.usertype;
            order.productid=productdata._id;
            order.orderstate=appTypeEmun.MallOrderState.applying;
            order.receivername=info.name;
            order.mobile=info.mobile;
            order.address=info.mobile;
            order.save(function(err,data){
                if(err){
                    return callback("保存订单出错:"+err);
                }
                mallOrderModel.update({_id:new mongodb.ObjectId(data._id)},
                    { $set: { "orderscanaduiturl":auditurl.producturl+data._id }},function(err){});
                userdata.scanauditurl=auditurl.applyurl+userdata._id;
                mallProductModel.update({_id:new mongodb.ObjectId(productdata._id)},{$inc: { buycount: 1 }},function(err){});
                return callback(null,"suncess");
            })
        })
    })
}
// 用户购买商品
exports.userBuyProduct=function(info,callback){
    if (info.usertype==userTypeEmun.User) {
        usermodel.findById(new mongodb.ObjectId(info.userid))
            .select("wallet")
            .exec(function(err,userdata){
                if(err){
                     return callback("查找用户出错误:"+err)
                }
                if(!userdata){
                    return callback("没有查找到用户")
                }
                userpayprocess(userdata,info,function(err,data){
                    if(err){
                        return callback(err);
                    }
                    else{
                        return callback(null,data);
                    }

                })

            })
    }
    else if(info.usertype==userTypeEmun.Coach){
        coachmode.findById(new mongodb.ObjectId(info.userid))
            .select("wallet")
            .exec(function(err,userdata){
                if(err){
                    return callback("查找用户出错误:"+err)
                }
                if(!userdata){
                    return callback("没有查找到用户")
                }
                userpayprocess(userdata,info,function(err,data){
                    if(err){
                        return callback(err);
                    }
                    else{
                        return callback(null,data);
                    }

                })

            })
    }
}

// 获取用户信息
var getUserinfo=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("_id  name mobile applystate applyinfo scanauditurl ")
        .populate("applyschool"," name logoimg  phone address")
        .exec(function(err,data){
            if(err){
                return callback("查询用户出错");
            }
            if (!data){
                return callback(null,{});
            }
            console.log(data.applyschool);
            var userinfo={
                userid:data._id,
                name: data.name,
                mobile:data.mobile,
                applytime:(data.applyinfo.applytime).toFormat("YYYY-MM-DD"),
                endtime:(data.applyinfo.applytime).addMonths(1).toFormat("YYYY-MM-DD"),
                 applystate:data.applystate,
                is_confirmbyscan:data.is_confirmbyscan,
                scanauditurl:data.scanauditurl,
                schoolid:data.applyschool? data.applyschool._id:"",
                schoolname:data.applyschool?data.applyschool.name:"",
                schoollogoimg:data.applyschool?data.applyschool.logoimg:"",
                schoolphone:data.applyschool?data.applyschool.phone:"",
                schooladdress:data.applyschool?data.applyschool.address:""
            };
            return callback(null,userinfo);
        })
}
// 获取用户购买商品列表
exports.getMyorderList=function(searchinfo,callback){
    mallOrderModel.find({userid:searchinfo.userid})
        .populate("productid","_id productname  productprice productimg  merchantid")
       // .populate("productid.merchantid","name  mobile address")
        .skip((searchinfo.index-1)*10)
        .limit(searchinfo.count)
        .sort({"createtime":-1})
        .exec(function(err ,orderdata){
            if(err){
                return  callback("查询订单出错："+err);
            };
            var opts = [{
                path   : 'productid.merchantid',
                select : 'name  mobile address',
                model  : 'merchant'
            }];

            mallOrderModel.populate(orderdata, opts, function(err, populatedDocs) {
               if(err){
                   return  callback("查询订单出错："+err);
               };
                getUserinfo(searchinfo.userid,function(err,userdata){
                process.nextTick(function(){
                    var orderlist=[];
                    populatedDocs.forEach(function(r,index){
                        var orderone={
                            orderid: r._id,
                            createtime: (r.createtime).toFormat("YYYY-MM-DD"),
                            endtime: (r.createtime).addMonths(1).toFormat("YYYY-MM-DD"),
                            finishtime: r.finishtime,
                            orderstate: r.orderstate,
                            receivername: r.receivername,
                            mobile: r.mobile,
                            address: r.address,
                            orderscanaduiturl: r.orderscanaduiturl,
                            is_confirmbyscan: r.is_confirmbyscan,
                            productid: r.productid._id,
                            productname:r.productid.productname,
                            productprice:r.productid.productprice,
                            productimg:r.productid.productimg,
                            merchantid:r.productid.merchantid._id,
                            merchantname:r.productid.merchantid.name,
                            merchantmobile:r.productid.merchantid.mobile,
                            merchantaddress:r.productid.merchantid.address
                        };
                        orderlist.push(orderone);
                    });
                    return callback(null,{ordrelist:orderlist,userdata:userdata});
                })
                })
            });


        });

}
// 用户登录
exports.userlogin= function(usertype,userinfo,callback){
    if (usertype==userTypeEmun.User) {
        usermodel.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
          if (err)
          {
           return callback ("查找用户出错:"+ err);
          } else
          {
              if(!userinstace){
                  return callback("用户不存在 ");
              }else {
                  if (userinstace.password == userinfo.password){
                       var token = jwt.sign({
                       userId: userinstace._id,
                       timestamp: new Date(),
                       aud: secretParam.audience
                       }, secretParam.secret);
                       userinstace.token = token;
                       userinstace.logintime = Date.now();
                       userinstace.save(function (err, newinstace) {
                       if (err) {
                           return callback("save  user login  err:" + err);
                       }
                           var returnmodel=new resbaseuserinfomodel(newinstace);
                           returnmodel.token=token;
                           returnmodel.displaymobile=mobileObfuscator(userinfo.mobile);
                           returnmodel.userid =newinstace._id;
                           returnmodel.idcardnumber=newinstace.idcardnumber;
                           returnmodel.usersetting=newinstace.usersetting;
                           if (newinstace.is_registermobim===undefined||newinstace.is_registermobim==0){
                               regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                                   usermodel.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                       { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                               })
                           }
                           return callback(null,returnmodel);

                       });
                  }
                  else{
                      return callback("用户名或者密码错误");
                  }
                      }

          }
        });
    }else if(usertype==userTypeEmun.Coach)
    {
        coachmode.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
            if (err)
            {
                return callback ("查找用户出错:"+ err);
            } else
            {
                if(!userinstace){
                    return callback("用户不存在");
                }else {
                    if (userinstace.password == userinfo.password){
                        var token = jwt.sign({
                            userId: userinstace._id,
                            timestamp: new Date(),
                            aud: secretParam.audience
                        }, secretParam.secret);
                        userinstace.token = token;
                        userinstace.logintime = Date.now();
                        userinstace.save(function (err, newinstace) {
                            if (err) {
                                return callback("save  user login  err:" + err);
                            }
                            var returnmodel=new resbasecoachinfomode(newinstace);
                            returnmodel.token=token;
                            //returnmodel.mobile=mobileObfuscator(userinfo.mobile);
                            returnmodel.usersetting=newinstace.usersetting;
                            returnmodel.idcardnumber=idCardNumberObfuscator(newinstace.idcardnumber);
                            returnmodel.coachid =newinstace._id;
                            if (newinstace.is_registermobim===undefined||newinstace.is_registermobim==0){
                                regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                                    coachmode.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                        { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                                })
                            }
                            return callback(null,returnmodel);

                        });
                    }
                    else{
                        return callback("用户名/密码错误");
                    }
                }

            }
        });
    }else{
        return callback("登录失败");
    }
};
exports.userSignup=function(usertype,userinfo,callback){
    console.log(userinfo);
    checkSmsCode(userinfo.mobile,userinfo.smscode,function(err){
        if(err){
            return  callback(err);

        }
        if (usertype==userTypeEmun.User) {
            usermodel.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
                if (err) {
                    return callback( "查找用户出错:" + err);
                }
                if (userinstace) {
                    return callback( "用户已存在请直接登录");

                } else {
                    var newuser = new usermodel();
                    newuser.mobile = userinfo.mobile;
                    newuser.create = new Date();
                    newuser.referrerCode=userinfo.referrerCode;
                    newuser.password= userinfo.password;
                    newuser.loc.coordinates=[newuser.longitude,newuser.latitude];
                    getUserCount(function(err,usercoutinfo){
                        if (err){
                            return callback( " 获取用户ID出错 :"+err);
                        }
                        newuser.displayuserid=usercoutinfo.value.displayid;
                        newuser.invitationcode=usercoutinfo.value.invitationcode;
                        newuser.save(function (err, newinstace) {
                            if (err) {
                                return callback("保存用户出错"+err);
                            }
                            var token = jwt.sign({
                                userId: newinstace._id,
                                timestamp: new Date(),
                                aud: secretParam.audience
                            }, secretParam.secret);
                            var returnmodel=new resbaseuserinfomodel(newinstace);
                            returnmodel.token=token;
                            returnmodel.displaymobile=mobileObfuscator(userinfo.mobile);
                            returnmodel.userid =newinstace._id;
                            usermodel.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                { $set: { token:token }},{safe: false},function(err,doc){});
                            regisermobIm.addsuer(newinstace._id,userinfo.password,function(err,data){
                                usermodel.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                    { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                            })
                            return callback(null,returnmodel);

                        });

                    });

                }
            })
        }else if(usertype==userTypeEmun.Coach){

            coachmode.findOne({mobile: userinfo.mobile}, function (err, coachuserinstace) {
                if (err) {
                    return callback( "查找用户出错:" + err);
                }
                if (coachuserinstace) {
                    return callback( "用户已存在");

                } else {
                    var newuser = new coachmode();
                    newuser.mobile = userinfo.mobile;
                    newuser.create = new Date();
                    newuser.referrerCode=userinfo.referrerCode;
                    newuser.password= userinfo.password;
                    newuser.loc.coordinates=[newuser.longitude,newuser.latitude];
                    getUserCount(function(err,usercoutinfo){
                        if (err){
                            return callback( " 获取教练ID出错:"+err);
                        }
                        newuser.displaycoachid=usercoutinfo.value.displayid;
                        newuser.invitationcode=usercoutinfo.value.invitationcode;
                        newuser.save(function (err, newinstace) {
                            if (err) {
                                return callback("保存用户出错："+err);
                            }
                            var token = jwt.sign({
                                userId: newinstace._id,
                                timestamp: new Date(),
                                aud: secretParam.audience
                            }, secretParam.secret);
                            var returnmodel=new resbasecoachinfomode(newinstace);
                            returnmodel.token=token;
                            returnmodel.mobile=mobileObfuscator(userinfo.mobile);
                            returnmodel.coachid =newinstace._id;
                            coachmode.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                { $set: { token:token }},{safe: false},function(err,doc){});
                            regisermobIm.addsuer(newinstace._id,userinfo.password,function(err,data){
                                coachmode.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                    { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                            })
                            return callback(null,returnmodel);

                        });

                    });

                }
            });
        }
    });
};
//用户修改手机号
exports.updateMobile=function(mobileinfo,callback){
    checkSmsCode(mobileinfo.mobile,mobileinfo.smscode,function(err){
        if(err){
            return  callback(err);
        }
        if (mobileinfo.usertype===undefined){
            mobileinfo.usertype=appTypeEmun.UserType.User;
        }
        if (mobileinfo.usertype==appTypeEmun.UserType.User) {
            usermodel.findOne({mobile: mobileinfo.mobile}, function (err, userinstace) {
                if (err) {
                    return callback("查找用户出错:" + err);
                }
                if (userinstace) {
                    return callback("改手机号已经存在，请更换手机号");
                }
            })
            usermodel.update({_id: new mongodb.ObjectId(mobileinfo.userid)}, {$set: {mobile: mobileinfo.mobile}}, function (err) {
                if (err) {
                    return callback("更新手机号出错：" + err)
                }
                return callback(null, "success");
            })
        }else if( mobileinfo.usertype==appTypeEmun.UserType.Coach)
        {
            coachmode.findOne({mobile: mobileinfo.mobile}, function (err, userinstace) {
                if (err) {
                    return callback("查找用户出错:" + err);
                }
                if (userinstace) {
                    return callback("改手机号已经存在，请更换手机号");
                }
            })
            coachmode.update({_id: new mongodb.ObjectId(mobileinfo.userid)}, {$set: {mobile: mobileinfo.mobile}}, function (err) {
                if (err) {
                    return callback("更新手机号出错：" + err)
                }
                return callback(null, "success");
            })
        }
    });
}
// 修改密码
exports.updatePassword=function(pwdinfo,callback){
    if (pwdinfo.usertype===undefined){
        pwdinfo.usertype=appTypeEmun.UserType.User;
    }
    if(pwdinfo.usertype==appTypeEmun.UserType.User){
        usermodel.findOne({mobile: pwdinfo.mobile},function(err,userdata){
  if(err||!userdata){
      return  callback("查询用户出错："+err);
  }
     checkSmsCode(userdata.mobile,pwdinfo.smscode,function(err) {
         if (err) {
             return callback("验证码错误" );

         }
         userdata.password=pwdinfo.password;
         userdata.save(function(err,newdata){
             if(err){
                 return  callback("保存用户信息出错："+err);
             }
             regisermobIm.userupdatepassword(newdata._id,newdata.password,function(err,data){
                 usermodel.update({"_id":new mongodb.ObjectId(newdata._id)},
                     { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
             })
             return callback(null,"success")
         });
     });
 });
   }else if(pwdinfo.usertype==appTypeEmun.UserType.Coach){
        coachmode.findOne({mobile: pwdinfo.mobile},function(err,userdata){
            if(err||!userdata){
                return  callback("查询用户出错："+err);
            }
            checkSmsCode(userdata.mobile,pwdinfo.smscode,function(err) {
                if (err) {
                    return callback("验证码出错");
                }
                userdata.password=pwdinfo.password;
                userdata.save(function(err,newdata){
                    if(err){
                        return  callback("保存用户信息出错："+err);
                    }
                    regisermobIm.userupdatepassword(newdata._id,newdata.password,function(err,data){
                        coachmode.update({"_id":new mongodb.ObjectId(newdata._id)},
                            { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                    })
                    return callback(null,"success")
                });
            });
        });
    }
}
// 获取附近的教练
exports.getNearCoach=function(latitude, longitude, radius,callback){
    coachmode.getNearCoach(latitude, longitude, radius ,function(err ,coachlist){
        if (err ) {
            console.log(err);
            callback("查找教练出错"+err);

        } else {
            process.nextTick(function() {
                rescoachlist=[];
                coachlist.forEach(function (r, idx) {
                    var returnmodel  = { //new resbasecoachinfomode(r);
                        coachid : r._id,
                    distance : geolib.getDistance(
                        {latitude: latitude, longitude: longitude},
                        {latitude: r.latitude, longitude: r.longitude},
                        10
                    ),
                        name: r.name,
                        driveschoolinfo: r.driveschoolinfo,
                        headportrait:r.headportrait,
                        starlevel: r.starlevel,
                        passrate: r.passrate,
                        Seniority: r.Seniority,
                        is_shuttle: r.is_shuttle,
                        latitude: r.latitude,
                        longitude: r.longitude,
                        subject: r.subject

                }
                    //  r.restaurantId = r._id;
                    // delete(r._id);
                    rescoachlist.push(returnmodel);
                });
                callback(null, rescoachlist);
            });
        }

    })

};
// 获取学校下面的教练
exports.getSchoolCoach=function(coachinfo,callback){
    //{"name":new RegExp(schoolname)}
    var searchinfo={"driveschool":new mongodb.ObjectId(coachinfo.schoolid)};
    if (coachinfo.name&&coachinfo.name!=""){
        searchinfo.name=new RegExp(coachinfo.name);
    }
    coachmode.find(searchinfo)
        .where("is_lock").equals("false")
        .where("is_validation").equals("true")
        .skip((coachinfo.index-1)*10)
        .limit(10)
        .exec(function(err ,coachlist){
        if (err || !coachlist ) {
            console.log(err);
            callback("查找教练出错"+err);

        }else if( coachlist.length == 0){
            callback(null,coachlist);
        }
        else {
            process.nextTick(function() {
                rescoachlist=[];
                coachlist.forEach(function (r, idx) {
                    var returnmodel  = { //new resbasecoachinfomode(r);
                        coachid : r._id,
                        name: r.name,
                        driveschoolinfo: r.driveschoolinfo,
                        headportrait:r.headportrait,
                        starlevel: r.starlevel,
                        is_shuttle: r.is_shuttle,
                        passrate: r.passrate,
                        Seniority: r.Seniority,
                        latitude: r.latitude,
                        longitude: r.longitude,
                        subject: r.subject

                    }
                    //  r.restaurantId = r._id;
                    // delete(r._id);
                    rescoachlist.push(returnmodel);
                });
                callback(null, rescoachlist);
            });
        }

    });

};
// 用户报考
exports.applyExamintion=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid),function(err,userdata){
        if(err)
        {
            return callback("查找用户出错："+err)
        }
        if(!userdata){
            return callback("没有找到相关用户");
        }
        if (userdata.is_lock || userdata.applystate!=appTypeEmun.ApplyState.Applyed){
            return callback("您暂时没有权限报考");
        }
        if (userdata.subject.subjectid!=2 && userdata.subject.subjectid!=3){
            return callback("该科目下无法报考");
        }

        if(userdata.subject.subjectid==2){
            if (userdata.subjecttwo.finishcourse+userdata.subjecttwo.reservation<userdata.subjecttwo.totalcourse){
                return callback("您的学时不够，无法报考");
            }
            userdata.examinationinfo.subjecttwo.applystate=appTypeEmun.ExamintionSatte.applying;
            userdata.examinationinfo.subjecttwo.applydate=new Date();
        }else if(userdata.subject.subjectid==3){

            if (userdata.subjectthree.finishcourse+userdata.subjectthree.reservation<userdata.subjectthree.totalcourse){
                return callback("您的学时不够，无法报考");
            }
            userdata.examinationinfo.subjectthree.applystate=appTypeEmun.ExamintionSatte.applying;
            userdata.examinationinfo.subjectthree.applydate=new Date();
        }
        userdata.save(function(err){
            if (err){
                return callback("保存报考信息出错："+err);
            }
            return callback(null,"success");
        })
    })
}
//教练端获取学生详情页
exports.getStudentInfo=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("_id mobile name headportrait subject subjecttwo subjectthree address applyschoolinfo " +
        " carmodel displayuserid")
        .exec(function(err,data){
            if(err){
                return callback("查询出错"+err);
            }

                    var subjectprocess="";
                    if (data.subject.subjectid==2){
                        subjectprocess= data.subjecttwo.progress;
                    }
                    else if(data.subject.subjectid==3)
                    {
                        subjectprocess=  data.subjecttwo.progress;
                    }
                    var user={
                        "_id": data._id,
                        "mobile": data.mobile,
                        "displayuserid":data.displayuserid,
                        "name": data.name,
                        "headportrait": data.headportrait,
                        "carmodel":data.carmodel,
                        "subject": data.subject,
                        "mobile":data.mobile,
                        "address":data.address,
                        "applyschoolinfo":data.applyschoolinfo,
                        "subjectprocess": subjectprocess

                    }

                return callback(null,user);
            })


}
//获取教练的学员列表
exports.getCoachStudentList=function(coachinfo,callback){
    usermodel.find({"applycoach":new mongodb.ObjectId(coachinfo.coachid)})
        .skip((coachinfo.index-1)*10)
        .limit(10)
        .sort({"createtime":-1})
        .select("_id mobile name headportrait subject subjecttwo subjectthree")
        .exec(function(err,data){
            if(err){
                return callback("查询出错"+err);
            }

            process.nextTick(function(){
                var userlist=[] ;
                data.forEach(function(r,index){
                    var subjectprocess="";
                    if (r.subject.subjectid==2){
                        subjectprocess= r.subjecttwo.progress;
                    }
                    else if(r.subject.subjectid==3)
                    {
                        subjectprocess=  r.subjecttwo.progress;
                    }
                    var user={
                        "_id": r._id,
                        "mobile": r.mobile,
                        "name": r.name,
                        "headportrait": r.headportrait,
                        "subject": r.subject,
                        "subjectprocess": subjectprocess

                    }
                    userlist.push(user);
                })
                return callback(null,userlist);
            })

        })
}
exports.setCoachClassInfo=function(classinfo,callback){
    coachmode.findOne({_id:new mongodb.ObjectId(classinfo.coachid)})
        .select("serverclasslist driveschool ")
        .exec(function(err,data){
            if(err||!data){
                return callback("查询教练出错"+err);
            }
            postclasslist=classinfo.classtypelist.split(",");
            classtypeModel.find({schoolid:data.driveschool,"is_using":true})
                .populate("vipserverlist")
                .exec(function(err,classlist){
                if(err){
                    return callback("查询课程出错");
                }
                process.nextTick(function(){
                    var is_shuttle=false;
                    classlist.forEach(function(r,index){
                        var idx=data.serverclasslist.indexOf(r._id);
                        if (idx != -1) {
                            data.serverclasslist.splice(idx, 1);;
                        }
                        var idx2=postclasslist.indexOf(r._id);
                        if(idx2>0){
                            r.vipserverlist.forEach(function(server,index2){
                                if (server.id==0){
                                    is_shuttle=true;
                                   // return;
                                }
                            })
                        }
                    })
                    postclasslist.forEach(function(r,index){
                        if(r.length>1){
                        var idx = data.serverclasslist.indexOf(new mongodb.ObjectId(r));
                        if (idx == -1) {
                            data.serverclasslist.push(new mongodb.ObjectId(r));
                        }}
                    })
                    var shuttlemsg="暂不提供接送服务";
                    if(is_shuttle){
                        shuttlemsg="根据报考班型提供接送服务";
                    };

                    coachmode.update({_id:new mongodb.ObjectId(classinfo.coachid)} ,
                        {$set: { serverclasslist: data.serverclasslist,"is_shuttle":is_shuttle,"shuttlemsg":shuttlemsg }},
                    function(err){
                        if(err){
                        return callback("保存用户课程错误："+err);
                    }
                    return callback(null,"success")}
                    );



                })
            })
        })
}
// 交流获取我课程班级信息
exports.getCoachClassInfo=function(userid,callback){
    coachmode.findById(new mongodb.ObjectId(userid))
        .select("serverclasslist driveschool")
        .populate("driveschool","address")
        .exec(function(err,data){
            if(err||!data){
                return callback("查询教练出错"+err);
            }
            classtypeModel.find({schoolid:data.driveschool,"is_using":true})
                .populate("vipserverlist"," name  color id")
                .exec(function(err,classlist){
                if(err){
                    return callback("查询课程出错");
                }
                process.nextTick(function(){
                    var list=[];
                    classlist.forEach(function(r,index){
                        var ind=data.serverclasslist.indexOf(r._id);
                        var listone={
                            classid: r._id,
                            classname: r.classname,
                            price: r.price,
                            onsaleprice: r.price,
                            address:  data.driveschool.address,
                            vipserverlist: r.vipserverlist,
                            is_choose:ind<0?false:true
                        }
                        list.push(listone);
                    })

                    return callback(null,list);
                })
            })
        })
}
exports.getUsefulCoachList=function(useid,index,callback){
    usermodel.findById(new mongodb.ObjectId(useid),function(err,user){
        if(err){
            return callback("查询出错"+err);
        }
        if(!user){
            return callback("没有查到相关用户信息");
        }
        //判断用户状态
        if(user.is_lock==true)
        {
            return  callback("此用户已锁定，请联系客服");
        }
        //判断用户的预约权限
        if(user.applystate!=2)
        {
            return  callback("用户没有报名的权限");
        }
        if(user.subject.subjectid!=2&&user.subject.subjectid!=3){
            return  callback("该用户现阶段不能预约课程:"+userdata.subject.name);
        }
        coachmode.find({is_lock:false,is_validation:true,
            driveschool:new mongodb.ObjectId(user.applyschool),
            //"carmodel.modelsid":user.carmodel.modelsid,
        "subject.subjectid":{'$in':[user.subject.subjectid]}})
            .sort({"passrate": -1})
            .skip((index-1)*10)
            .limit(10)
            .exec(function(err ,coachlist) {
                if (err || !coachlist  ) {
                    console.log(err);
                    return callback("get coach list failed" + err);

                } else if(coachlist.length == 0)
                {
                     return callback(null,coachlist);
                }
                else {
                    process.nextTick(function () {
                        rescoachlist = [];
                        coachlist.forEach(function (r, idx) {
                            var returnmodel = { //new resbasecoachinfomode(r);
                                coachid: r._id,

                                name: r.name,
                                driveschoolinfo: r.driveschoolinfo,
                                headportrait: r.headportrait,
                                starlevel: r.starlevel,
                                is_shuttle: r.is_shuttle,
                                passrate: r.passrate,
                                Seniority: r.Seniority,
                                latitude: r.latitude,
                                longitude: r.longitude,
                                subject: r.subject

                            }
                            //  r.restaurantId = r._id;
                            // delete(r._id);
                            rescoachlist.push(returnmodel);
                        });
                        callback(null, rescoachlist);
                    });
                }
            });

    });

}
// 添加我喜歡的教練
exports.addFavoritCoach=function(userid,coachid,callback){
    usermodel.findById(new mongodb.ObjectId(userid), function(err, user) {
        if (err) {
            return callback('查找用戶出錯：'+err);
        }

        if (!user){
            return callback('沒有找到相关的用户');
        }

        if (user.favorcoach) {
            var idx = user.favorcoach.indexOf(new mongodb.ObjectId(coachid));
            if (idx == -1) {
                user.favorcoach.push(new mongodb.ObjectId(coachid));
            }
            else {
                return callback('已经存在');
            }
        } else {
            user.favorcoach = [new mongodb.ObjectId(coachid)];
        }

        user.save(function (err) {
            if (err) {
                return callback('保存出錯：' + err);
            }
            return callback(null, "success");

        })
    });
}
// 删除我喜欢的教练
exports.delFavoritCoach=function(userid,coachid,callback){
    usermodel.findById(new mongodb.ObjectId(userid), function(err, user) {
        if (err) {
            return callback('查找用戶出錯：'+err);
        }

        if (!user){
            return callback('沒有找到相关的用户');
        }

        if (user.favorcoach) {
            var idx = user.favorcoach.indexOf(new mongodb.ObjectId(coachid));
            if (idx != -1) {
                user.favorcoach.splice(idx, 1);
                user.save(function (err) {
                    if (err) {
                        return callback('保存出錯：' + err);
                    }
                    return callback(null, "success");

                })
            }
            else{
                return  callback('该教练不存在我的喜欢列表中：');}
        }
        else{
            return  callback('该教练不存在我的喜欢列表中：');}


    });
}
// 获取我喜欢的教练
exports.FavoritCoachList=function(userid,callback){
usermodel.findById(new mongodb.ObjectId(userid))
    .select("favorcoach")
    .populate("favorcoach")
    .exec(function(err,data){
        if(err||!data){
            return callback("查詢出錯:"+err);
        }
        if (data.favorcoach){
            process.nextTick(function() {
                rescoachlist=[];
                data.favorcoach.forEach(function (r, idx) {
                    var returnmodel  = { //new resbasecoachinfomode(r);
                        coachid : r._id,
                        /*distance : geolib.getDistance(
                            {latitude: latitude, longitude: longitude},
                            {latitude: r.latitude, longitude: r.longitude},
                            10
                        ),*/
                        name: r.name,
                        driveschoolinfo: r.driveschoolinfo,
                        headportrait:r.headportrait,
                        starlevel: r.starlevel,
                        is_shuttle: r.is_shuttle,
                        passrate: r.passrate,
                        Seniority: r.Seniority,
                        latitude: r.latitude,
                        longitude: r.longitude,
                        subject: r.subject

                    }
                    //  r.restaurantId = r._id;
                    // delete(r._id);
                    rescoachlist.push(returnmodel);
                });
                callback(null, rescoachlist);
            });
        }

    })
}

//获取我喜欢的驾校
exports.FavoritSchoolList=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("favorschool")
        .populate("favorschool")
        .exec(function(err,data){
            if(err||!data){
                return callback("查詢出錯:"+err);
            }
            if (data.favorschool){
                process.nextTick(function(){
                    driveschoollist=[];
                    data.favorschool.forEach(function(r, idx){
                        var oneschool= {
                          /*  distance : geolib.getDistance(
                                {latitude: latitude, longitude: longitude},
                                {latitude: r.latitude, longitude: r.longitude},
                                10),*/
                            schoolid: r._id,
                            name:r.name,
                            logoimg:r.logoimg,
                            latitude: r.latitude,
                            longitude: r.longitude,
                            address: r.address,
                            passingrate: r.passingrate
                        }
                        driveschoollist.push(oneschool)
                        //  r.restaurantId = r._id;
                        // delete(r._id);
                    });
                    callback(null,driveschoollist);
                });
            }

        })
}
// 添加我喜歡的驾校
exports.addFavoritSchool=function(userid,schoolid,callback){
    usermodel.findById(new mongodb.ObjectId(userid), function(err, user) {
        if (err) {
            return callback('查找用戶出錯：'+err);
        }

        if (!user){
            return callback('沒有找到相关的用户');
        }

        if (user.favorschool) {
            var idx = user.favorschool.indexOf(new mongodb.ObjectId(schoolid));
            if (idx == -1) {
                user.favorschool.push(new mongodb.ObjectId(schoolid));
            }
            else {
                return callback('已经存在');
            }
        } else {
            user.favorschool = [new mongodb.ObjectId(schoolid)];
        }

        user.save(function (err) {
            if (err) {
                return callback('保存出錯：' + err);
            }
            return callback(null, "success");

        })
    });
}
// 删除我喜欢的驾校
exports.delFavoritSchool=function(userid,schoolid,callback){
    usermodel.findById(new mongodb.ObjectId(userid), function(err, user) {
        if (err) {
            return callback('查找用戶出錯：'+err);
        }

        if (!user){
            return callback('沒有找到相关的用户');
        }

        if (user.favorschool) {
            var idx = user.favorschool.indexOf(new mongodb.ObjectId(schoolid));
            if (idx != -1) {
                user.favorschool.splice(idx, 1);
                user.save(function (err) {
                    if (err) {
                        return callback('保存出錯：' + err);
                    }
                    return callback(null, "success");

                })
            }
            else{
                return  callback('该驾校不存在我的喜欢列表中：');}
        }
        else{
            return  callback('该驾校不存在我的喜欢列表中：');}


    });
}
 // 获取我的钱包历史
getMyWalletlist=function(queryinfo,callback){

    if(queryinfo.seqindex==0){
        queryinfo.seqindex=Number.MAX_VALUE;
    }
    integralListModel.find({userid:queryinfo.userid,usertype:queryinfo.usertype,
        seqindex:{$lt:queryinfo.seqindex}})
        .sort({seqindex:-1})
        .limit(queryinfo.count)
        .exec(function (err,data){
            if(err){
                return callback("查找用户出错");
            }
            else {
                var  list =[];
                data.forEach(function(r,index){
                    var listone={
                        createtime: r.createtime,
                        amount: r.amount,
                        type: r.type,
                        seqindex: r.seqindex
                    }
                    list.push(listone)
                })
                return callback(null,list);
            }
        })
}
// 获取我的钱包
exports.getMyWallet=function(queryinfo,callback){
    if(queryinfo.usertype==appTypeEmun.UserType.User){
        usermodel.findById(new mongodb.ObjectId(queryinfo.userid))
            .select(" is_lock wallet")
            .exec(function(err,data){
                if(err){
                    return callback("查询用户出错："+err);
                }
                if (!data){
                    return callback("没有查到此用户的信息");
                }
                if(data.is_lock){
                    return callback("用户已锁定无法获取用户钱包信息");
                }

                getMyWalletlist(queryinfo,function(err,listdata){
                    if(err){
                        return callback(err)
                    }
                    var wallet={
                        wallet:data.wallet,
                        list:listdata
                    }
                    return callback(null,wallet);
                })
            })

    } else if(queryinfo.usertype==appTypeEmun.UserType.Coach){
        coachmode.findById(new mongodb.ObjectId(queryinfo.userid))
            .select(" is_lock wallet")
            .exec(function(err,data){
                if(err){
                    return callback("查询用户出错："+err);
                }
                if (!data){
                    return callback("没有查到此用户的信息");
                }
                if(data.is_lock){
                    return callback("用户已锁定无法获取用户钱包信息");
                }
                getMyWalletlist(queryinfo,function(err,listdata){
                    if(err){
                        return callback(err)
                    }
                    var wallet={
                        wallet:data.wallet,
                        list:listdata
                    }
                    return callback(null,wallet);
                })
            })
    }
}
// 获取学习进度
exports.getMyProgress=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("subject subjecttwo subjectthree")
        .exec(function(err,userdata){
            if(err){
                return  callback("查询错误："+err);
            }
            return callback(null,userdata);
        })
}
// 获取用户的报名状态
  exports.getMyApplyState=function(userid,callback){
      usermodel.findById(new mongodb.ObjectId(userid))
          .select("applystate applyinfo")
          .exec(function(err,userdata){
              if(err){
                  return  callback("查询错误："+err);
              }
              return callback(null,userdata);
          })
  }
// 报名验证
exports.enrollverification=function(applyinfo,callback){
    usermodel.findById(new mongodb.ObjectId(applyinfo.userid),function(err,userdata){
        if(err|!userdata)
        {
            return  callback("不能找到此用户");
        }
        //判断用户状态
        if(userdata.is_lock==true)
        {
            return  callback("此用户已锁定，请联系客服");
        }
        if(userdata.applystate!=appTypeEmun.ApplyState.NotApply){
            return  callback("此用户已经报名，请查看报名详情页");
        }

            // 检查教练
            schoolModel.findById(new mongodb.ObjectId(applyinfo.schoolid),function(err,schooldata){
                if(err||!schooldata){
                    return callback("不能找到报名的驾校");
                };

                    userdata.idcardnumber=applyinfo.idcardnumber;
                    userdata.name =applyinfo.name;
                    userdata.telephone=applyinfo.telephone;
                    userdata.address=applyinfo.address;


                    userdata.applyschool=applyinfo.schoolid;
                    userdata.applyschoolinfo.id=applyinfo.schoolid;
                    userdata.applyschoolinfo.name=schooldata.name;


                    userdata.applystate=appTypeEmun.ApplyState.Applying;
                    userdata.applyinfo.applytime=new Date();
                    userdata.is_enrollverification=true;
                    userdata.enrollverificationinfo.studentid=applyinfo.studentid;
                    userdata.enrollverificationinfo.ticketnumber=applyinfo.ticketnumber;

                    userdata.applyinfo.handelstate=appTypeEmun.ApplyHandelState.NotHandel;
                    // 保存 申请信息
                    userdata.save(function(err,newuserdata){
                        if(err){
                            return   callback("保存申请信息错误："+err);
                        }
                        //classtypedata.applycount=classtypedata.applycount+1;
                        return callback(null,"success");
                    });

                });





    });
}

//报名申请
exports.applyschoolinfo=function(applyinfo,callback){
  usermodel.findById(new mongodb.ObjectId(applyinfo.userid),function(err,userdata){
      if(err|!userdata)
      {
          return  callback("不能找到此用户");
      }
      //判断用户状态
      if(userdata.is_lock==true)
      {
          return  callback("此用户已锁定，请联系客服");
      }
      if(userdata.applystate>appTypeEmun.ApplyState.NotApply){
          return  callback("此用户已经报名，请查看报名详情页");
      }
      // 检查报名驾校和教练
      coachmode.findById(new mongodb.ObjectId(applyinfo.coachid),function(err,coachdata){
          if(err||!coachdata){
              return callback("不能找到报名的教练");
          }
          // 检查教练
          schoolModel.findById(new mongodb.ObjectId(applyinfo.schoolid),function(err,schooldata){
              if(err||!schooldata){
                  return callback("不能找到报名的驾校");
              };
              // 检查所报的课程类型
              classtypeModel.findById(new mongodb.ObjectId(applyinfo.classtypeid))
                  .populate("vipserverlist")
                  .exec(function(err,classtypedata){
                  if (err|| !classtypedata){
                      return callback("不能找到该申请课程"+err);
                  }
                  // 判断 报的车型与课程里面的课程是否一样
                  console.log("applyinfo.carmodel.modelsid:"+applyinfo.carmodel.modelsid);
                  console.log("classtypedata.carmodel.modelsid:"+classtypedata.carmodel.modelsid);
                  if (applyinfo.carmodel.modelsid!=classtypedata.carmodel.modelsid){
                      return callback("所报车型与课程的类型不同，请重新选择");
                  }
                  userdata.idcardnumber=applyinfo.idcardnumber;
                  userdata.name =applyinfo.name;
                  userdata.telephone=applyinfo.telephone;
                  userdata.address=applyinfo.address;
                  userdata.carmodel=applyinfo.carmodel;
                  userdata.userpic=applyinfo.userpic,
                  userdata.applyschool=applyinfo.schoolid;
                  userdata.applyschoolinfo.id=applyinfo.schoolid;
                  userdata.applyschoolinfo.name=schooldata.name;

                  userdata.applycoach=applyinfo.coachid;
                  userdata.applycoachinfo.id=applyinfo.coachid;
                  userdata.applycoachinfo.name=coachdata.name;

                  userdata.applyclasstype=applyinfo.classtypeid;
                  userdata.applyclasstypeinfo.id=applyinfo.classtypeid;
                  userdata.applyclasstypeinfo.name=classtypedata.classname;
                  userdata.applyclasstypeinfo.price=classtypedata.price;
                  userdata.vipserverlist=classtypedata.vipserverlist;
                  userdata.applystate=appTypeEmun.ApplyState.Applying;
                  userdata.applyinfo.applytime=new Date();
                  userdata.applyinfo.handelstate=appTypeEmun.ApplyHandelState.NotHandel;
                      userdata.scanauditurl=auditurl.applyurl+userdata._id;
                  //console.log(userdata);
                  // 保存 申请信息
                  userdata.save(function(err,newuserdata){
                      if(err){
                       return   callback("保存申请信息错误："+err);
                      }
                      classtypedata.applycount=classtypedata.applycount+1;
                      coachdata.studentcoount=coachdata.studentcoount+1;
                      return callback(null,"success");
                  });

              });
          });

      });


  });
};

//更新用户信息
exports.updateUserServer=function(updateinfo,callback){
    usermodel.findById(new mongodb.ObjectId(updateinfo.userid),function(err,userdata){
        if (err||!userdata){
           return  callback("查询用户出错："+err);
        }
        userdata.name=updateinfo.name ? updateinfo.name:userdata.name;
        userdata.nickname= updateinfo.nickname? updateinfo.nickname:userdata.nickname;
        userdata.email= updateinfo.email?updateinfo.email:userdata.email;
        userdata.headportrait= updateinfo.headportrait?updateinfo.headportrait:userdata.headportrait;
        userdata.address= updateinfo.address?updateinfo.address:userdata.address;
        userdata.gender=updateinfo.gender?updateinfo.gender:userdata.gender;
        userdata.signature=updateinfo.signature?updateinfo.signature:userdata.signature;
        if(updateinfo.address){
            var idx = userdata.addresslist.indexOf(updateinfo.address);
            if (idx == -1) {
                userdata.addresslist.push(updateinfo.address);
            }
        }
        userdata.save(function(err,newdata){
            if(err){
                return  callback("保存用户信息出错："+err);
            }
            return callback(null,"success")
        });
    });
}
 // 教练提交审核申请
exports.applyVerification=function(applyinfo,callback){
    coachmode.findById(new mongodb.ObjectId(applyinfo.coachid),function(err,coachdata){
        if (err||!coachdata){
            return  callback("查询教练出错："+err);
        }
        if(coachdata.validationstate==appTypeEmun.CoachValidationState.Validated||coachdata.validationstate==appTypeEmun.CoachValidationState.Validationing){
            return callback("该验证状态下不允许提交验证申请");
        }
        coachdata.name=applyinfo.name ? applyinfo.name:coachdata.name;
        coachdata.idcardnumber=applyinfo.idcardnumber ? applyinfo.idcardnumber:coachdata.idcardnumber;
        coachdata.drivinglicensenumber=applyinfo.drivinglicensenumber ? applyinfo.drivinglicensenumber:coachdata.drivinglicensenumber;
        coachdata.coachnumber=applyinfo.coachnumber ? applyinfo.coachnumber:coachdata.coachnumber;
        coachdata.validationstate=appTypeEmun.CoachValidationState.Validationing;
        coachdata.is_validation=false;
        if (applyinfo.driveschoolid){
           schoolModel.findById(new mongodb.ObjectId(applyinfo.driveschoolid),function(err,schooldata){
                if(err||!schooldata){
                    return callback("查询驾校出错："+err);
                }
                coachdata.driveschool=new mongodb.ObjectId(applyinfo.driveschoolid);
                coachdata.driveschoolinfo.id=applyinfo.driveschoolid;
                coachdata.driveschoolinfo.name=schooldata.name;
                coachdata.save(function(err,data){
                    if(err)
                    {
                        return callback("保存教练信息出错："+err);
                    }
                    return callback(null,"success");
                })

            })

        }
        else{
            coachdata.save(function(err,data){
                if(err)
                {
                    return callback("保存教练信息出错："+err);
                }
                return callback(null,"success");
            })
        }

    });
}
// 更新教练的工作时间
exports.coachSetWorkTime=function(timeinfo,callback){
    coachmode.findById(new mongodb.ObjectId(timeinfo.coachid),function(err,coachdata){
        if (err||!coachdata){
            return  callback("查询教练出错："+err);
        }
       var   weeklist=timeinfo.workweek.split(",");
        coachdata.workweek=weeklist;
        coachdata.worktimedesc=timeinfo.worktimedesc;
        coachdata.worktimespace.begintimeint=timeinfo.begintimeint;
        coachdata.worktimespace.endtimeint=timeinfo.endtimeint;
        var worktimes=[];
        console.log(timeinfo);
        for(var i=parseInt(timeinfo.begintimeint);i<=parseInt(timeinfo.endtimeint);i++){
            console.log(i.toString()+":00:00");
            appWorkTimes.forEach(function(r,index){
                console.log(r.begintime);
                console.log(i.toString()+":00:00");
                if(r.begintime== i.toString()+":00:00"){
                    worktimes.push(appWorkTimes[index]);
                }

            })
        }
        coachdata.worktime=worktimes;
        coachdata.save(function(err,data){
            if(err)
            {
                return callback("保存教练信息出错："+err);
            }
            return callback(null,"success");
        })
    })
}
// 同步个性化设置
exports.personalSetting=function(settingifo,callback){
    if (settingifo.usertype==appTypeEmun.UserType.User){
        usermodel.update({_id:new mongodb.ObjectId(settingifo.userid)},{ $set:
        { "usersetting.reservationreminder": settingifo.reservationreminder==1?true:false,
            "usersetting.newmessagereminder": settingifo.newmessagereminder==1?true:false,
            "usersetting.classremind": settingifo.classremind==1?true:false }},function(err){
            if(err){
                return callback("保存个性化设置失败："+err);
            }
            return callback(null,"success");
        })

    }
    else if(settingifo.usertype==appTypeEmun.UserType.Coach){
        coachmode.update({_id:new mongodb.ObjectId(settingifo.userid)},{ $set:
        { "usersetting.reservationreminder": settingifo.reservationreminder==1?true:false,
            "usersetting.newmessagereminder": settingifo.newmessagereminder==1?true:false,
            "usersetting.classremind": settingifo.classremind==1?true:false }},function(err){
            if(err){
                return callback("保存个性化设置失败："+err);
            }
            return callback(null,"success");
        })
    }
}
//更新教练信息
exports.updateCoachServer=function(updateinfo,callback){
    try {
        coachmode.findById(new mongodb.ObjectId(updateinfo.coachid), function (err, coachdata) {
            if (err || !coachdata) {
                return callback("查询教练出错：" + err);
            }
            coachdata.name = updateinfo.name ? updateinfo.name : coachdata.name;
            coachdata.Gender = updateinfo.gender ? updateinfo.gender : coachdata.Gender;
            coachdata.introduction = updateinfo.introduction ? updateinfo.introduction : coachdata.introduction;
            //coachdata.email=updateinfo.email ? updateinfo.email:coachdata.email;
            coachdata.headportrait = updateinfo.headportrait ? updateinfo.headportrait : coachdata.headportrait;
            coachdata.address = updateinfo.address ? updateinfo.address : coachdata.address;
            coachdata.subject = updateinfo.subject ? updateinfo.subject : coachdata.subject;
            coachdata.Seniority = updateinfo.Seniority ? updateinfo.Seniority : coachdata.Seniority;
            coachdata.passrate = updateinfo.passrate ? updateinfo.passrate : coachdata.passrate;
            //coachdata.worktime=updateinfo.worktime ? updateinfo.worktime:coachdata.worktime;
            //coachdata.coursestudentcount=updateinfo.coursestudentcount ? updateinfo.coursestudentcount:coachdata.coursestudentcount;
            coachdata.idcardnumber = updateinfo.idcardnumber ? updateinfo.idcardnumber : coachdata.idcardnumber;
            coachdata.drivinglicensenumber = updateinfo.drivinglicensenumber ? updateinfo.drivinglicensenumber : coachdata.drivinglicensenumber;
            coachdata.coachnumber = updateinfo.coachnumber ? updateinfo.coachnumber : coachdata.coachnumber;
            //coachdata.carmodel=updateinfo.carmodel ? updateinfo.carmodel:coachdata.carmodel;
            coachdata.platenumber = updateinfo.platenumber ? updateinfo.platenumber : coachdata.platenumber;
            //coachdata.shuttlemsg=updateinfo.shuttlemsg ? updateinfo.shuttlemsg:coachdata.shuttlemsg;
            //coachdata.is_shuttle=updateinfo.is_shuttle ? (updateinfo.carmodel==0? false:true) :coachdata.carmodel;
            if (updateinfo.driveschoolid) {
                schoolModel.findById(new mongodb.ObjectId(updateinfo.driveschoolid), function (err, schooldata) {
                    if (err || !schooldata) {
                        return callback("查询驾校出错：" + err);
                    }
                    coachdata.driveschool = new mongodb.ObjectId(updateinfo.driveschoolid);
                    coachdata.driveschoolinfo.id = updateinfo.driveschoolid;
                    coachdata.driveschoolinfo.name = schooldata.name;
                    if (updateinfo.trainfield) {
                        trainfieldModel.findById(new mongodb.ObjectId(updateinfo.trainfield), function (err, trainfielddata) {
                            if (err || !trainfielddata) {
                                return callback("查询训练场：" + err);
                            }
                            coachdata.trainfield = new mongodb.ObjectId(updateinfo.trainfield);
                            coachdata.trainfieldlinfo.id = updateinfo.trainfield;
                            coachdata.trainfieldlinfo.name = trainfielddata.fieldname;
                            coachdata.latitude = trainfielddata.latitude;
                            coachdata.longitude = trainfielddata.longitude;
                            coachdata.loc.coordinates = [trainfielddata.longitude, trainfielddata.latitude];
                            coachdata.save(function (err, data) {
                                if (err) {
                                    return callback("保存教练信息出错：" + err);
                                }
                                return callback(null, "success");
                            })

                        })
                    }
                    else
                    {
                    coachdata.save(function (err, data) {
                        if (err) {
                            return callback("保存教练信息出错：" + err);
                        }
                        return callback(null, "success");
                    })}

                })
            } else if (updateinfo.trainfield) {
                trainfieldModel.findById(new mongodb.ObjectId(updateinfo.trainfield), function (err, trainfielddata) {
                    if (err || !trainfielddata) {
                        return callback("查询训练场：" + err);
                    }
                    coachdata.trainfield = new mongodb.ObjectId(updateinfo.trainfield);
                    coachdata.trainfieldlinfo.id = updateinfo.trainfield;
                    coachdata.trainfieldlinfo.name = trainfielddata.fieldname;
                    coachdata.latitude = trainfielddata.latitude;
                    coachdata.longitude = trainfielddata.longitude;
                    coachdata.loc.coordinates = [trainfielddata.longitude, trainfielddata.latitude];
                    coachdata.save(function (err, data) {
                        if (err) {
                            return callback("保存教练信息出错：" + err);
                        }
                        return callback(null, "success");
                    })

                })
            }
            else {
                coachdata.save(function (err, data) {
                    if (err) {
                        return callback("保存教练信息出错：" + err);
                    }
                    return callback(null, "success");
                })
            }

        });
    }catch (err)
    {
        console.log("保存病人信息错误");
        console.log(err);
        return callback("保存病人信息错误:"+err);
    }
};

//获取用户信息
exports.getUserinfoServer=function(type,userid,callback){
    if(type==appTypeEmun.UserType.User){
        usermodel.findById(new mongodb.ObjectId(userid),function(err,userdata) {
            if (err || !userdata) {
                return callback("查询用户出错：" + err);
            }
            var returnmodel=new resbaseuserinfomodel(userdata);
            returnmodel.token="";
            returnmodel.displaymobile=mobileObfuscator(userdata.mobile);
            returnmodel.userid =userdata._id;
            return callback(null,returnmodel);
        })

    } else if(type==appTypeEmun.UserType.Coach) {
        coachmode.findById(new mongodb.ObjectId(userid),function(err,coachdata) {
            if (err || !coachdata) {
                return callback("查询教练出错：" + err);
            }
            var returnmodel=new resbasecoachinfomode(coachdata);
            returnmodel.token="";
            //returnmodel.mobile=mobileObfuscator(userinfo.mobile);
            returnmodel.coachid =coachdata._id;
            return callback(null,returnmodel);
        });
    }else
    {
        return callback("查询用户类型出错")
    }
};
exports.getCoachinfoServer=function(userid,callback){
    coachmode.findById(new mongodb.ObjectId(userid),function(err,coachdata) {
        if (err || !coachdata) {
            return callback("查询教练出错：" + err);
        }
        var returnmodel=new resbasecoachinfomode(coachdata);
        returnmodel.token=coachdata.token;
        returnmodel.usersetting=coachdata.usersetting;
        returnmodel.idcardnumber=idCardNumberObfuscator(coachdata.idcardnumber);
        returnmodel.coachid =coachdata._id;
        return callback(null,returnmodel);
    });
}

// 获取用户显示id和邀请码
var  getUserCount=function(callback){
    userCountModel.getUserCountInfo(function(err,data){
    //userCountModel.findAndModify({}, [],{$inc:{'displayid':1},$inc:{'invitationcode':1}},
      //  {new: true, upsert: true},function(err,data){
        if(err){
           return  callback(err)}
       // console.log("get user count:"+ data);
      //  console.log("get user count:"+ data.value.displayid);
        if(!data)
        {
            var usercountinfo=new userCountModel();
            usercountinfo.save(function(errsave,savedata){
               if (errsave){
                   return callback(errsave);
               }
                return callback(null,savedata);
            });
        }
        else{
           return  callback(null,data);
        }
    });
}
// ��֤�ֻ���֤��
var  checkSmsCode=function(mobile,code,callback){
    smsVerifyCodeModel.findOne({mobile:mobile,smsCode:code, verified: false},function(err,instace){
        if(err)
        {
            return callback("查询出错: "+ err);
        }
        if (!instace)
        {
            return callback("没有查询到此手机号");
        }
        //console.log(instace);
        var  now=new Date();
        /*console.log(now);
        console.log(instace.createdTime);
        console.log(now-instace.createdTime);*/
        if ((now-instace.createdTime)>timeout*1000){
            return callback("您已超时请重新发送");
        }
        instace.verified=true;
        instace.save(function(err,temp){
            if (err)
            {
                return callback("服务器内部错误:"+err);
            }
            return callback(null);
        })

    });
}
// ��ʽ���ֻ���
var mobileObfuscator = function(mobile){
    mobile = mobile.substr(0, 3) + "****" + mobile.substr(7, 4);
    return mobile;
};

var idCardNumberObfuscator = function(idCardNumber){
    if (idCardNumber!=undefined && idCardNumber.length>0) {
        idCardNumber = idCardNumber.substr(0, 14) + "****";
    }
    return idCardNumber;
};

