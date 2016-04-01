/**
 * Created by metis on 2015-08-31.
 */
var async = require('async');
var smscodemodule=require('../Common/sendsmscode').sendsmscode;
var addtestsmscode=require('../Common/sendsmscode').addsmscode;
var  app=require("../Config/sysconfig").weixinconfig;
var  merchant=require("../Config/sysconfig").merchant;
var mongodb = require('../models/mongodb.js');
var geolib = require('geolib');
var  weixinpauserver=require("./weixin_payserver");
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var jwt = require('jsonwebtoken');
var userTypeEmun=require("../custommodel/emunapptype").UserType;
var resbaseuserinfomodel=require("../custommodel/returnuserinfo").resBaseUserInfo;
var resbasecoachinfomode=require("../custommodel/returncoachinfo").resBaseCoachInfo;
var appTypeEmun=require("../custommodel/emunapptype");
var regisermobIm=require('../Common/mobIm');
var appWorkTimes=require("../Config/commondata").worktimes;
var subjectlist=require("../Config/commondata").subject;
var colorarray=require("../Config/sysconfig").coachtagcolor;
var auditurl=require("../Config/sysconfig").validationurl;
var secretParam= require('./jwt-secret').secretParam;
var basedatafun=require("./basedatafun");
var cache=require('../Common/cache');
var resendTimeout = 60;
var usermodel=mongodb.UserModel;
var coachmode=mongodb.CoachModel;
var coursemode=mongodb.CourseModel;
var userCountModel=mongodb.UserCountModel;
var schoolModel=mongodb.DriveSchoolModel;
var classtypeModel=mongodb.ClassTypeModel;
var trainfieldModel=mongodb.TrainingFieldModel;
var integralListModel=mongodb.IntegralListModel;
var mallProductModel=mongodb.MallProdcutsModel;
var mallOrderModel=mongodb.MallOrderModel;
var userfcode= mongodb.UserFcode;
var IncomeDetails= mongodb.IncomeDetails;
var SystemIncome=mongodb.SystemIncome;
var coupon=mongodb.Coupon;
var CoachTag=mongodb.CoachTagsModel;
var UserCashOutModel=mongodb.UserCashOutModel;
var SystemMessage=mongodb.SystemMessageModel;
var UserPayModel=mongodb.UserPayModel;
var HeadMaster=mongodb.HeadMasterModel;
var activityCouponModel=mongodb.ActivityCouponModel;
var userAvailableFcodeModel=mongodb.UserAvailableFcodeModel;
require('date-utils');
var _ = require("underscore");

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
                return callback("发送验证码错误: " + err);
            }
            if(instace){
                var  now= new Date();
                //console.log(now-instace.createdTime);
                if ((now-instace.createdTime)<resendTimeout*1000){
                    return callback("您发送过于频繁，请稍后再发");
                }
                else{
                    instace.remove(function(err){
                        if(err){
                            return callback("发送验证码错误: " + err);
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
};
exports.verificationSmscode=function(mobile,code,callback){
    checkSmsCode(mobile,code,function(err) {
        if (err) {
            return callback(err);
        }
        return callback(null,"suncess");
    })
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
        //优惠券购买
        if(productdata.is_scanconsumption){
            if(info.couponid===undefined||info.couponid==""){
                return callback("不存在优惠券");
            }
            coupon.findById(new mongodb(info.couponid),function(err,data){
                if (err){
                    return callback("查询优惠码出错:"+err);
                }
                if(!data){
                    return callback("没有查询到优惠券信息");
                }
                // 优惠券已失效
                if (data.state!=0&&data.state!=1){
                    return callback("此优惠券已使用");
                }
                // 更改优惠卷的状态
                data.state=4;  // 已消费
                data.usetime=new Date();
                data.remark="购买商品";
                data.productid=info.productid;
                data.save(function(err,newdata){
                    if (err){
                        return callback("购买失败："+err);
                    }

                    var order= new  mallOrderModel;
                    order.userid=userdata._id;
                    order.usertype=info.usertype;
                    order.productid=productdata._id;
                    order.orderstate=appTypeEmun.MallOrderState.applying;
                    order.receivername=info.name;
                    order.mobile=info.mobile;
                    order.address=info.mobile;
                    //order.is_confirmbyscan=true;
                    order.couponid=newdata._id;
                    order.save(function(err,data){
                        if(err){
                            return callback("保存订单出错:"+err);
                        }
                        mallOrderModel.update({_id:new mongodb.ObjectId(data._id)},
                            { $set: { "orderscanaduiturl":auditurl.producturl+data._id }},function(err){});
                        userdata.scanauditurl=auditurl.applyurl+userdata._id;
                        mallProductModel.update({_id:new mongodb.ObjectId(productdata._id)},{$inc: { buycount: 1 }},function(err){});
                        var  orderinfo={
                            orderid:data._id,
                            orderscanaduiturl:auditurl.producturl+data._id,
                            finishorderurl:auditurl.orderfinishurl+data._id
                        }
                        return callback(null,"suncess",orderinfo);
                    })
                })
            })
        }
        else {

            //积分购买
            if (userdata.wallet < productdata.productprice) {
                return callback("对不起，您的金币不足，无法购买商品");
            }
            var payinfo = {
                userid: userdata._id,
                usertype: info.usertype,
                amount: productdata.productprice * (-1),
                type: appTypeEmun.IntegralType.buyproduct
            }
            payuserIntegral(payinfo, function (err, data) {
                if (err) {
                    return callback("购买商品失败");
                }
                var order = new mallOrderModel;
                order.userid = userdata._id;
                order.usertype = info.usertype;
                order.productid = productdata._id;
                order.orderstate = appTypeEmun.MallOrderState.applying;
                order.receivername = info.name;
                order.mobile = info.mobile;
                order.address = info.mobile;
                order.save(function (err, data) {
                    if (err) {
                        return callback("保存订单出错:" + err);
                    }
                    mallOrderModel.update({_id: new mongodb.ObjectId(data._id)},
                        {$set: {"orderscanaduiturl": auditurl.producturl + data._id}}, function (err) {
                        });
                    userdata.scanauditurl = auditurl.applyurl + userdata._id;
                    mallProductModel.update({_id: new mongodb.ObjectId(productdata._id)}, {$inc: {buycount: 1}}, function (err) {
                    });
                    var orderinfo = {
                        orderid: data._id,
                        orderscanaduiturl: auditurl.producturl + data._id,
                        finishorderurl:auditurl.orderfinishurl+data._id
                    }
                    return callback(null, "suncess", orderinfo);
                })
            })
        }
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
                userpayprocess(userdata,info,function(err,data,extrainfo){
                    if(err){
                        return callback(err);
                    }
                    else{
                        return callback(null,data,extrainfo);
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
// 用户通过验证码的登录
exports.studentLoginByCode=function(userinfo,callback){
    checkSmsCode(userinfo.mobile,userinfo.smscode,function(err) {
        if (err) {
            return callback(err);
        }
        usermodel.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
            if (err) {
                return callback( "查找用户出错:" + err);
            }
            if (userinstace) {
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
                    returnmodel.password=newinstace.password;
                    regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){

                    })
                    return callback(null,returnmodel);

                });

            } else {
                var newuser = new usermodel();
                newuser.mobile = userinfo.mobile;
                newuser.create = new Date();
                //newuser.referrerCode=userinfo.referrerCode;
                newuser.password= "93e6bf49e71743b00cee035c0f3fc92f";
                newuser.loc.coordinates=[0,0];
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
                        returnmodel.idcardnumber=newinstace.idcardnumber;
                        returnmodel.usersetting=newinstace.usersetting;
                        returnmodel.password= "93e6bf49e71743b00cee035c0f3fc92f";
                        usermodel.update({"_id":new mongodb.ObjectId(newinstace._id)},
                            { $set: { token:token }},{safe: false},function(err,doc){});
                        regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                            //usermodel.update({"_id":new mongodb.ObjectId(newinstace._id)},
                            //    { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                            return callback(null,returnmodel);
                        })


                    });

                });

            }
        })

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
                           var returnmodel=new resbaseuserinfomodel(newinstace);
                           returnmodel.token=token;
                           returnmodel.displaymobile=mobileObfuscator(userinfo.mobile);
                           returnmodel.userid =newinstace._id;
                           returnmodel.idcardnumber=newinstace.idcardnumber;
                           returnmodel.usersetting=newinstace.usersetting;
                           //if (newinstace.is_registermobim===undefined||newinstace.is_registermobim==0){
                           //
                           //}
                           regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                               usermodel.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                   { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                           })
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
        coachmode.findOne({mobile: userinfo.mobile})
            .populate("tagslist"," _id  tagname tagtype color")
            .exec(function (err, userinstace) {
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
                            returnmodel.tagslist=userinstace.tagslist;
                            //if (newinstace.is_registermobim===undefined||newinstace.is_registermobim==0){
                            //
                            //}

                            regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                                coachmode.update({"_id":new mongodb.ObjectId(newinstace._id)},
                                    { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                            });
                            userfcode.findOne({"userid":newinstace._id})
                                .select("userid fcode money")
                                .exec(function(err, fcodedata){
                                    returnmodel.fcode=fcodedata&&fcodedata.fcode?fcodedata.fcode:"";
                                    return callback(null,returnmodel);
                                })


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
    //console.log(userinfo);
    checkSmsCode(userinfo.mobile,userinfo.smscode,function(err){
        //if(err){
        //    return  callback(err);
        //
        //}
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
                            returnmodel.usersetting=newinstace.usersetting;
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
                    return callback("该手机号已经存在，请更换手机号");
                }
                usermodel.update({_id: new mongodb.ObjectId(mobileinfo.userid)}, {$set: {mobile: mobileinfo.mobile}}, function (err) {
                    if (err) {
                        return callback("更新手机号出错：" + err)
                    }
                    return callback(null, "success");
                })
            })

        }else if( mobileinfo.usertype==appTypeEmun.UserType.Coach)
        {
            coachmode.findOne({mobile: mobileinfo.mobile}, function (err, userinstace) {
                if (err) {
                    return callback("查找用户出错:" + err);
                }
                if (userinstace) {
                    return callback("该手机号已经存在，请更换手机号");
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
  if(err){
      return  callback("查询用户出错："+err);
  }
            if (!userdata){
                return  callback("用户未注册");
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
};
// 按条件查找教练
exports.searchCoach=function(searchinfo,callback){
    var searchcondition= {
        is_lock:false,
        is_validation:true,
    };
    if (searchinfo.licensetype!=""&&parseInt(searchinfo.licensetype)!=0){
        searchcondition={
            "carmodel.modelsid":parseInt(searchinfo.licensetype),
            is_lock:false,
            is_validation:true,
        };
    }
    if (searchinfo.cityname!=""){
        searchcondition.city=new RegExp(searchinfo.cityname);
    }else{
        searchcondition.loc={$nearSphere:{$geometry:{type:'Point',
            coordinates:[searchinfo.longitude, searchinfo.latitude]}, $maxDistance: 100000}}
    }
    if (searchinfo.coachname!=""){
        searchcondition.name=new RegExp(searchinfo.coachname);
    }

    var ordercondition={};
    // 0 默认 1距离 2 评分  3 价格
    if(searchinfo.ordertype==2){
        ordercondition.starlevel=-1;
    }
    if(searchinfo.ordertype==3){
        ordercondition.minprice=1;
    }
    //console.log(searchcondition);
    coachmode.find(searchcondition)
        .select("")
        .sort(ordercondition)
        .skip((searchinfo.index-1)*searchinfo.count)
        .limit(searchinfo.count)
        .exec(function(err,driveschool){
            if (err ) {
                console.log(err);
                callback("查找教练出错："+err);
            } else {
                process.nextTick(function(){
                    driveschoollist=[];
                    driveschool.forEach(function(r, idx){
                        var oneschool= {
                            coachid : r._id,
                            distance : geolib.getDistance(
                                {latitude: searchinfo.latitude, longitude: searchinfo.longitude},
                                {latitude: r.latitude, longitude: r.longitude},
                                10
                            ),
                            name: r.name,
                            driveschoolinfo: r.driveschoolinfo,
                            headportrait:r.headportrait,
                            starlevel: r.starlevel?r.starlevel:4,
                            passrate: r.passrate?r.passrate:99,
                            Seniority: r.Seniority?r.Seniority:1,
                            is_shuttle: r.is_shuttle,
                            latitude: r.latitude,
                            longitude: r.longitude,
                            subject: r.subject,
                            Gender: r.Gender,
                            commentcount: r.commentcount,
                            maxprice: r.maxprice?r.maxprice:0,  // 最高价格
                            minprice: r.minprice?r.minprice:0,  // 最低价格
                        }
                        driveschoollist.push(oneschool);
                    });
                    if (searchinfo.ordertype==0||searchinfo.ordertype==1)
                    {
                        driveschoollist=  _.sortBy(driveschoollist,"distance")
                    }
                    callback(null,driveschoollist);
                });
            }
        })
};
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
    var searchinfo={"driveschool":new mongodb.ObjectId(coachinfo.schoolid),"is_lock":false,
    "is_validation": true};
    if (coachinfo.name&&coachinfo.name!=""){
        searchinfo.name=new RegExp(coachinfo.name);
    }
    coachmode.find(searchinfo)
        .populate("serverclasslist","classname carmodel cartype  price onsaleprice",{"is_using":true})
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
                        subject: r.subject,
                        Gender: r.Gender,
                        commentcount: r.commentcount,
                        maxprice: r.maxprice?r.maxprice:0,  // 最高价格
                        minprice: r.minprice?r.minprice:0,  // 最低价格
                        carmodel: r.carmodel,
                        serverclasslist: r.serverclasslist? r.serverclasslist:[]

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
        .exec(function(err,data) {
            if (err) {
                return callback("查询出错" + err);
            }
            if(!data){
                return callback("没有查询到此用户");
            }
            var subjectprocess = "";
            var leavecoursecount = 0;
            var missingcoursecount = 0;
            if (data.subject){
                if (data.subject.subjectid == 2) {
                    subjectprocess = data.subjecttwo.progress;
                    leavecoursecount = data.subjecttwo.totalcourse -
                        data.subjecttwo.finishcourse - (data.subjecttwo.missingcourse ? data.subjecttwo.missingcourse : 0);
                    missingcoursecount = data.subjecttwo.missingcourse ? data.subjecttwo.missingcourse : 0;
                }
                else if (data.subject.subjectid == 3) {
                    subjectprocess = data.subjectthree.progress;
                    leavecoursecount = data.subjectthree.totalcourse -
                        data.subjectthree.finishcourse - (data.subjectthree.missingcourse ? data.subjectthree.missingcourse : 0);
                    missingcoursecount = data.subjectthree.missingcourse ? data.userid.subjectthree.missingcourse : 0;
                }
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
                        "subjectprocess": subjectprocess,
                        "leavecoursecount":leavecoursecount,
                        "missingcoursecount":missingcoursecount

                    }

                return callback(null,user);
            })


}
//获取教练的学员列表
exports.getCoachStudentList=function(coachinfo,callback){
    var  searchinfo={};
    // 查询类型   // 0 全部 1 理论学员  2  上车学员  3 领证学员
    if(coachinfo.studenttype==1){
        searchinfo={
            "$or":[{"subject.subjectid":1},{"subject.subjectid":4}]
        }
    }
    if(coachinfo.studenttype==2){
        searchinfo={
            "$or":[{"subject.subjectid":2},{"subject.subjectid":3}]
        }
    }
    if(coachinfo.studenttype==3){
        searchinfo={
            "$or":[{"subject.subjectid":5},{"subject.subjectid":6}]
        }
    }
    // 是否 全部
    var limintcount=coachinfo.index==0?Number.MAX_VALUE:10;
    if(coachinfo.index==0){
        coachinfo.index=1;
    }
      searchinfo.applycoach=mongodb.ObjectId(coachinfo.coachid);
    searchinfo.applystate=2;
    usermodel.find(searchinfo)
        .skip((coachinfo.index-1)*10)
        .limit(limintcount)
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
                    var leavecoursecount=0;
                    var missingcoursecount=0;
                    if (r.subject.subjectid==2){
                        subjectprocess= r.subjecttwo.progress?r.subjecttwo.progress:"";
                        leavecoursecount=r.subjecttwo.totalcourse-
                        r.subjecttwo.finishcourse-(r.subjecttwo.missingcourse?r.subjecttwo.missingcourse:0);
                        missingcoursecount= r.subjecttwo.missingcourse?r.subjecttwo.missingcourse:0;
                    }
                    else if(r.subject.subjectid==3)
                    {

                        subjectprocess= r.subjectthree.progress?r.subjecttwo.progress:"";
                        leavecoursecount=r.subjectthree.totalcourse-
                        r.subjectthree.finishcourse-(r.subjectthree.missingcourse?r.subjectthree.missingcourse:0);
                        missingcoursecount= r.subjectthree.missingcourse?r.subjectthree.missingcourse:0;
                    }
                    var user={
                        "_id": r._id,
                        "mobile": r.mobile,
                        "name": r.name,
                        "headportrait": r.headportrait,
                        "subject": r.subject,
                        "subjectprocess": subjectprocess,
                        "leavecoursecount":leavecoursecount,
                        "missingcoursecount":missingcoursecount

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
            console.log(postclasslist);
            classtypeModel.find({schoolid:data.driveschool,"is_using":true})
                .populate("vipserverlist")
                .exec(function(err,classlist){
                if(err){
                    return callback("查询课程出错");
                }
                process.nextTick(function(){
                    var is_shuttle=false;
                    classlist.forEach(function(r,index){
                        var idx=-1;
                        if (data.serverclasslist!=undefined&& data.serverclasslist.length>0){
                         idx=data.serverclasslist.indexOf(r._id);}
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
                            var idx=-1;
                            if (data.serverclasslist!=undefined&& data.serverclasslist.length>0){
                         idx = data.serverclasslist.indexOf(new mongodb.ObjectId(r));}

                        if (idx == -1) {
                            if (data.serverclasslist==undefined||data.serverclasslist==null){
                                data.serverclasslist=[];
                            }
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
                        var ind =-1;
                        if (data.serverclasslist!=undefined&&data.serverclasslist.length>0){
                            ind=data.serverclasslist.indexOf(r._id);}
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
//获取当前时段可以预约教练
exports.getUsefulCoachListtimely=function(useid,index,coursedate,timeid,callback){
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
            return  callback("该用户现阶段不能预约课程:"+user.subject.name);
        }
        var _date= new Date( new Date(coursedate).toFormat("YYYY-MM-DD").toString());
        coursemode.aggregate([
                {"$project":{
                    "driveschool":"$driveschool",
                    "coursedate":"$coursedate",
                    "coursetime":"$coursetime",
                    "coachid":"$coachid",
                    "val": { $subtract : [ "$coursestudentcount", "$selectedstudentcount" ] },
                }},
                {$match:{
                    "driveschool":new mongodb.ObjectId(user.applyschool),
                    "coursedate": _date
                    ,"coursetime.timeid":parseInt(timeid)
                    ,"val":{$gt:0}
                }}
                ,{$group:{_id:"$coachid",coachcount : {$sum : 1}}}
            ],
            function(err,data) {
                console.log(data);
                if(data&&data.length>0){
                    var coachidlist=[];
                    data.forEach(function(r,indx){
                        coachidlist.push(r._id);
                    })
                    coachmode.find({is_lock:false,is_validation:true,
                        driveschool:new mongodb.ObjectId(user.applyschool),
                        _id:{"$in":coachidlist}},function(err,coachdata){
                        process.nextTick(function () {
                            rescoachlist = [];
                            coachdata.forEach(function (r, idx) {
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
                                    subject: r.subject,
                                    Gender: r.Gender,
                                    commentcount: r.commentcount
                                }
                                rescoachlist.push(returnmodel);
                            });
                            callback(null, rescoachlist);
                        })
                    })
                }
                else {
                    return callback(err,[])
                }

            })
        //coachmode.find({is_lock:false,is_validation:true,
        //        driveschool:new mongodb.ObjectId(user.applyschool),
        //        //"carmodel.modelsid":user.carmodel.modelsid,
        //        "subject.subjectid":{'$in':[user.subject.subjectid]}})
        //    .sort({"passrate": -1})
        //    //.skip((index-1)*10)
        //    //.limit(10)
        //    .exec(function(err ,coachlist) {
        //        if (err || !coachlist  ) {
        //            console.log(err);
        //            return callback("get coach list failed" + err);
        //
        //        } else if(coachlist.length == 0)
        //        {
        //            return callback(null,coachlist);
        //        }
        //        else {
        //            coursemode.findfullCourseTimely(timeid,coursedate,user.applyschool,function(err,coursedata){
        //               if(err) {
        //                   return callback("查询教练出错：" + err);
        //               }
        //                //console.log(coursedata);
        //                //console.log(coachlist.length);
        //                process.nextTick(function () {
        //                    rescoachlist = [];
        //                    coachlist.forEach(function (r, idx) {
        //                        //console.log(r._id);
        //                         if (coursedata.indexOf(r._id)==-1) {
        //                             var returnmodel = { //new resbasecoachinfomode(r);
        //                                 coachid: r._id,
        //                                 name: r.name,
        //                                 driveschoolinfo: r.driveschoolinfo,
        //                                 headportrait: r.headportrait,
        //                                 starlevel: r.starlevel,
        //                                 is_shuttle: r.is_shuttle,
        //                                 passrate: r.passrate,
        //                                 Seniority: r.Seniority,
        //                                 latitude: r.latitude,
        //                                 longitude: r.longitude,
        //                                 subject: r.subject,
        //                                 Gender: r.Gender
        //                             }
        //                             //  r.restaurantId = r._id;
        //                             // delete(r._id);
        //                             rescoachlist.push(returnmodel);
        //                         }
        //                    });
        //                    callback(null, rescoachlist);
        //                });
        //            })
        //
        //        }
        //    });

    });
};

// 第一次预约获取教练
exports.getUserFirstCoach=function(userid,subjectid,callback){
    usermodel.findById(new mongodb.ObjectId(userid),function(err,user){
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
            return  callback("该用户现阶段不能预约课程:"+user.subject.name);
        }
        coachmode.findOne({is_lock:false,is_validation:true,
                driveschool:new mongodb.ObjectId(user.applyschool),
                //"carmodel.modelsid":user.carmodel.modelsid,
                "subject.subjectid":{'$in':[subjectid]}})
            .sort({"passrate": -1})
            .exec(function(err ,coachdata) {
                if (err || !coachdata  ) {
                    console.log(err);
                    return callback("获取教练失败：" + err);

                }
                var returnmodel = { //new resbasecoachinfomode(r);
                    coachid: coachdata._id,
                    name: coachdata.name,
                    driveschoolinfo: coachdata.driveschoolinfo,
                    headportrait:coachdata.headportrait,
                    starlevel: coachdata.starlevel,
                    is_shuttle: coachdata.is_shuttle,
                    passrate: coachdata.passrate,
                    Seniority: coachdata.Seniority,
                    subject: coachdata.subject,
                    Gender: coachdata.Gender
                }
                return callback(null,returnmodel);
            });

    });
}
exports.getUsefulCoachList=function(useid,index,searchname,callback){
    var limintcount=10;
    if(index==-1){
        limintcount=100;
        index=1;
    }
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
            return  callback("该用户现阶段不能预约课程:"+user.subject.name);
        }
        coachmode.find({is_lock:false,is_validation:true,
            driveschool:new mongodb.ObjectId(user.applyschool),
            name:new RegExp(searchname),
            //"carmodel.modelsid":user.carmodel.modelsid,
        "subject.subjectid":{'$in':[user.subject.subjectid]}})
            .sort({"passrate": -1})
            .skip((index-1)*10)
            .limit(limintcount)
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
                                subject: r.subject,
                                Gender: r.Gender,
                            commentcount: r.commentcount
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
                cache.set("Favoritcoach"+userid,user.favorcoach,function(err){});
                return callback('已经存在');
            }
        } else {
            user.favorcoach = [new mongodb.ObjectId(coachid)];
        }

        user.save(function (err,data) {
            if (err) {
                return callback('保存出錯：' + err);
            }
            cache.set("Favoritcoach"+userid,data.favorcoach,function(err){});
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
                user.save(function (err,data) {
                    if (err) {
                        return callback('保存出錯：' + err);
                    }
                    cache.set("Favoritcoach"+userid,data.favorcoach,function(err){});
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
                return callback("查询出错:"+err);
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
                        driveschoollist.push(oneschool);
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

        user.save(function (err,data) {
            if (err) {
                return callback('保存出錯：' + err);
            }
            cache.set("FavoritSchool"+userid,data.favorschool,function(err){});
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
                user.save(function (err,data) {
                    if (err) {
                        cache.set("FavoritSchool"+userid,data.favorschool,function(err){});
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
};

// 验证Y吗 是否存在
exports.verifyFcodeCorrect=function(queryinfo,callback){
    cache.get("fcode"+queryinfo.fcode,function(err,data){
        if(err){
            return callback("查询出错："+err);
        }
        if (data){
            return callback(null,data);
        }
        userfcode.findOne({"fcode":queryinfo.fcode})
            .select("userid fcode usertype")
            .exec(function(err, data){
                if(err){
                    return callback("查询出错："+err);
                }
                if(!data){
                    return callback("不存在Y吗");
                }
                var usertypeobject;
                if(data.usertype==appTypeEmun.UserType.User){
                    usertypeobject=usermodel;
                }else {
                    usertypeobject=coachmode;
                }
                usertypeobject.findById(new mongodb.ObjectId(data.userid))
                    .select(" name   mobile headportrait ")
                    .exec(function(err,userdata){
                        var userinfo={};
                        if(userdata){
                            userinfo.userid=userdata._id;
                            userinfo.name=userdata.name;
                            userinfo.mobile=userdata.mobile;
                            userinfo.headportrait=userdata.headportrait;
                        }
                        cache.set("fcode"+queryinfo.fcode,userinfo,60*10,function(err,data){});
                        return callback(null,userinfo);
                    })
            })

    })
};
// 领取优惠券
exports.receiveMyCupon=function(queryinfo,callback){
    coupon.findOne({"userid":queryinfo.userid,"_id":queryinfo.cuponid})
        .exec(function(err,data){
            if(err){
                return callback("查询优惠卷出错："+err);
            }
            if (!data){
              return  callback("没有查询到此优惠卷");
            }
            if(data.state!=0){
                return  callback("此优惠劵无法领取");
            }
            if(queryinfo.receivetype==0){
                data.state=1;
                data.usetime=new Date();
                data.save(function(err,data){
                    if(err){
                        return callback("领取失败："+err);
                    }
                    return callback(null,"sucess");
                })
            }
            else  if(queryinfo.receivetype==1){
                if(!data.is_forcash||data.sysincomeid==""){
                    return  callback("此优惠劵无法兑换现金");
                }
                SystemIncome.findById(new mongodb.ObjectId(data.sysincomeid),function(err,SystemIncomedata){
                    if(err||!SystemIncomedata){
                        return  callback("此优惠劵无法兑换现金");
                    }
                    if(SystemIncomedata.rewardstate!=0||SystemIncomedata.useractualincome>0){
                        return  callback("此优惠劵无法兑换现金");
                    }
                    SystemIncomedata.useractualincome= SystemIncomedata.userdeserveincome;
                    SystemIncomedata.systemsurplus=SystemIncomedata.systemsurplus-SystemIncomedata.userdeserveincome;
                    SystemIncomedata.save(function(err,newdata){
                        if(err){
                            return callback("领取失败："+err);
                        }
                        data.state=1;
                        data.usetime=new Date();
                        data.save(function(err,data){
                            if(err){
                                return callback("领取失败："+err);
                            }
                            return callback(null,"sucess");
                        })
                    })
                });

            }
            else{
                callback("参数错误");
            }

        })
};
// 获取我可以使用的Y码
exports.getUserAvailableFcode=function(queryinfo,callback){
    userAvailableFcodeModel.find({"userid":queryinfo.userid},function(err,data){
        if(err){
            return callback("查找可用Y码出错");
        }
        var  returndatalist=[];
        data.forEach(function(r,index){
            var Ycode={
                Ycode: r.fcode,
                name: r.name,
                date: r.createtime.toFormat("YYYY/MM/DD")
            }
            returndatalist.push(Ycode);
        })
        return callback(null,returndatalist);
    })
}
exports.getmyCupon=function(queryinfo,callback){
    coupon.find({"userid":queryinfo.userid})
        .select("userid   createtime couponcomefrom is_forcash state")
        .exec(function(err,data){
            if(err){
                return callback("查询优惠卷出错："+err);
            }
            callback(err,data);
        })
};
// 用户提现申请
exports.userCashOut=function(cashinfo,callback){
    var usertypeobject;
    if(bindbankinfo.usertype==appTypeEmun.UserType.User){
        usertypeobject=usermodel;
    }else {
        usertypeobject=coachmode;
    }
    usertypeobject.findById(new mongodb.ObjectId(bindbankinfo.userid))
        .exec(function(err,data){
            if(err){
                return callback("查询用户出错："+err);
            }
            if (!data){
                return callback("没有查到此用户的信息");
            }
            if(data.is_lock){
                return callback("用户已锁定无法绑定");
            }
            if(bindbankinfo.cardtype!=3){
                return callback("在不支持此类型的提现");
            }
            userfcode.findOne({"userid":data._id})
                .exec(function(err, moneydata){
                   if (err){
                       return callback("查询用户金额出错"+err);
                   }
                    if(!moneydata){
                        return callback("没有查询到用户的现金信息");
                    }
                    if (moneydata.money<cashinfo.money){
                        return callback("金额不足");
                    }
                    moneydata.money=moneydata.money-cashinfo.money;
                    moneydata.save(function(err,newmymoneydata){
                        var tempincomedetail=new IncomeDetails();
                        tempincomedetail.userid=newmymoneydata.userid;
                        tempincomedetail.createtime=new Date();
                        tempincomedetail.usertype=newmymoneydata.usertype;
                        tempincomedetail.income=cashinfo.money*(-1);
                        tempincomedetail.type=0;    // 支出
                        tempincomedetail.state=1;  // 有效
                        tempincomedetail.save(function(err,incomedetaildata){
                            var  tempusercashmodel=new UserCashOutModel();
                            tempusercashmodel.userid=bindbankinfo.userid;
                            tempusercashmodel.createtime=new Date();
                            tempusercashmodel.usertype=bindbankinfo.usertype;
                            tempusercashmodel.money=bindbankinfo.money;
                            tempusercashmodel.cashoutstate=1;
                            tempusercashmodel.cardtype=bindbankinfo.cardtype;
                            tempusercashmodel.name=bindbankinfo.name;
                            tempusercashmodel.cardnumber=bindbankinfo.cardnumber;
                            tempusercashmodel.cardbank=bindbankinfo.cardbank;
                            tempusercashmodel.save(function(err,data){
                                if (err){
                                    return callback("保存取现信息错误"+err);
                                }
                                return callback(null,"sucess");
                            })
                        })
                    });
                })

        })
}
//绑定银行卡
exports.bindBank=function(bindbankinfo,callback){
    var usertypeobject;
    if(bindbankinfo.usertype==appTypeEmun.UserType.User){
        usertypeobject=usermodel;
    }else {
        usertypeobject=coachmode;
    }
    usertypeobject.findById(new mongodb.ObjectId(bindbankinfo.userid))
        .exec(function(err,data){
            if(err){
                return callback("查询用户出错："+err);
            }
            if (!data){
                return callback("没有查到此用户的信息");
            }
            if(data.is_lock){
                return callback("用户已锁定无法绑定");
            }
            if(bindbankinfo.cardtype!=3){
                return callback("在不支持此类型的绑定");
            }
            for(var i=0;i<data.bankcardlist.length;i++){
                if (data.bankcardlist[i].cardnumber==bindbankinfo.cardnumber){
                    return  callback("已绑定此银行卡");
                    break;
                }
            }
            var onebank={
                name:bindbankinfo.name,
                cardnumber:bindbankinfo.cardnumber,
                cardbank:bindbankinfo.cardbank
            }
            data.bankcardlist.push(onebank);
            data.save(function(err,data){
                if(err){
                    return callback("绑定银行卡出错"+err);
                }
                return callback(null,"sucess");
            })
        })

}
exports.getMymoneyList=function(queryinfo,callback){
    userfcode.findOne({"userid":queryinfo.userid})
        .select("userid fcode money")
        .exec(function(err, data){
            if(err){
                callback("查找用户出错:"+err);
            }
            if(!data){
                var moneyinfo={
                    userid:queryinfo.userid,
                    fcode:"",
                    money:0,
                    moneylist:[]
                }
                return callback(null,moneyinfo);
            }else {
                IncomeDetails.find({"userid":queryinfo.userid,"state":1})
                    .select("userid createtime income type")
                    .sort({"createtime" : -1})
                    .skip((queryinfo.index-1)*10)
                    .limit(queryinfo.count)
                    .exec(function(err,moneydata){
                        if (err){
                            callback("查找用户金钱出错:"+err);
                        }
                       var  moneylist=[];
                        moneydata.forEach(function(r,index){
                            money={
                                createtime: r.createtime,
                                type: r.type,
                                income: r.income,
                            }
                            moneylist.push(money);
                        })
                        var moneyinfo={
                            userid:queryinfo.userid,
                            fcode:data.fcode,
                            money:data.money,
                            moneylist:moneylist,
                        }
                        return callback(null,moneyinfo);

                    })
            }

        })
}
exports.getmymoney=function(queryinfo,callback){
    var usertypeobject;
    if(queryinfo.usertype==appTypeEmun.UserType.User){
        usertypeobject=usermodel;
    }else {
        usertypeobject=coachmode;
    }
    async.parallel([
        function(cb) {
            usertypeobject.findById(new mongodb.ObjectId(queryinfo.userid))
                .select(" is_lock wallet")
                .exec(function(err,data){
                    if(err){
                        return cb("查询用户出错："+err);
                    }
                    if (!data){
                        return cb("没有查到此用户的信息");
                    }
                    if(data.is_lock){
                        return cb("用户已锁定无法获取用户钱包信息");
                    }
                    return cb(null,data.wallet);
                })
        },
        function(cb) {
            userfcode.findOne({"userid":queryinfo.userid})
                .select("userid fcode money")
                .exec(function(err, data){
                    cb(err,data);
                })
        },
        function(cb) {
            coupon.find({"userid":queryinfo.userid,$or:[{state:0},{state:1},{state:2}]})
                .select("userid  couponcomefrom is_forcash state")
                .exec(function(err,data){
                    cb(err,data);
                })
        }
    ], function (err, results) {
        if(err){
         return  callback("查询出错:"+err);
        }
        var  couponremindlist=[];
        if (results[2])
        {
            for(i=0;i<results[2].length;i++){

                if(results[2][i].state==0&&results[2][i].is_forcash==true){
                    console.log(results[2][i]);
                    couponremindlist.push(results[2][i]);
                }
            }
        }
        returninfo={
            userid:queryinfo.userid,
            wallet:results[0]?results[0]:0,
            fcode:results[1]? (results[1].fcode?results[1].fcode:""):"",
            money:results[1]? (results[1].money?results[1].fcode:0):0,
            couponcount:results[2]? results[2].length:0,
            couponremindlist:couponremindlist,
        };
        return callback(null,returninfo)
    });
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
exports.getapplyschoolinfo=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("_id  name mobile applystate applyinfo   scanauditurl applyschool displayuserid" +
            " applyschoolinfo  applycoachinfo carmodel applyclasstypeinfo paytype  paytypestatus")
        .populate("applyschool"," _id  applynotes logoimg")
        .exec(function(err,data){
            if(err){
                return callback("查询用户出错");
            }
            if (!data){
                return callback("没有查询到用户的相关信息");
            }
            if(data.applystate==appTypeEmun.ApplyState.NotApply){
                return callback("该用户没有提交报名申请");
            }
            userfcode.findOne({"userid":userid})
                .select("userid fcode money")
                .exec(function(err, userfcode){
                    var userinfo={
                        userid:data._id,
                        name: data.name,
                        mobile:data.mobile,
                        scanauditurl:data.scanauditurl,
                        applystate:data.applystate,
                        applytime:(data.applyinfo.applytime).toFormat("YYYY-MM-DD"),
                        endtime:(data.applyinfo.applytime).addMonths(1).toFormat("YYYY-MM-DD"),
                        applyschoolinfo:data.applyschoolinfo,
                        applycoachinfo:data.applycoachinfo,
                        carmodel:data.carmodel,
                        applyclasstypeinfo:data.applyclasstypeinfo,
                        paytype:data.paytype,
                        paytypestatus:data.paytypestatus,
                        applyorderid:data.displayuserid,
                        schoollogoimg:data.applyschool?data.applyschool.logoimg.originalpic:"",
                        applynotes:data.applyschool.applynotes?data.applyschool.applynotes:"",
                        fcode:userfcode?userfcode.fcode:""
                    };
                    if(userinfo.applyclasstypeinfo.onsaleprice===undefined||userinfo.applyclasstypeinfo.onsaleprice==0){
                        userinfo.applyclasstypeinfo.onsaleprice=data.applyclasstypeinfo.price;
                    }
                    if (userinfo.applystate == 2) {
                        userinfo.paytypestatus = 20
                    }
                    return callback(null,userinfo);
                })

        })
}

// 获取学习进度
exports.getMyProgress=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("subject subjectone subjecttwo subjectthree subjectfour")
        .exec(function(err,userdata){
            if(err){
                return  callback("查询错误："+err);
            }
            if(!userdata){
                return  callback("不存在学员信息");
            }
            return callback(null,userdata);
        })
}
// 获取用户的报名状态
  exports.getMyApplyState=function(userid,callback){
      usermodel.findById(new mongodb.ObjectId(userid))
          .select("applystate applyinfo applycount paytype paytypestatus")
          .exec(function(err,userdata){
              if(err){
                  return  callback("查询错误："+err);
              }
              if(!userdata){
                  return  callback("没有查询到用户信息");
              }
              userdata.applycount=userdata.applycount?userdata.applycount:0;
              userdata.paytype=userdata.paytype?userdata.paytype:1;   // 线下支付
              userdata.paytypestatus=userdata.paytypestatus?userdata.paytypestatus:0;   // 未支付
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
exports.postenrollverificationv2=function(applyinfo,callback){
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
        if (applyinfo.applyagain!=1){
            if(userdata.applystate>appTypeEmun.ApplyState.NotApply){
                return  callback("此用户已经报名，请查看报名详情页");
            }
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
                        if (applyinfo.carmodel.modelsid!=classtypedata.carmodel.modelsid){
                            return callback("所报车型与课程的类型不同，请重新选择");
                        }
                        for (i=0;i<subjectlist.length;i++){
                            if(subjectlist[i].subjectid==applyinfo.subjectid){
                                userdata.subject=subjectlist[i];
                                break;
                            }
                        }
                        userdata.name =applyinfo.name;
                        userdata.telephone=applyinfo.telephone;
                        userdata.carmodel=applyinfo.carmodel;
                            userdata.applyschool=applyinfo.schoolid;
                        userdata.applyschoolinfo.id=applyinfo.schoolid;
                        userdata.applyschoolinfo.name=schooldata.name;

                        userdata.applycoach=applyinfo.coachid;
                        userdata.applycoachinfo.id=applyinfo.coachid;
                        userdata.applycoachinfo.name=coachdata.name;
                        userdata.is_enrollverification=true;

                        userdata.applyclasstype=applyinfo.classtypeid;
                        userdata.applyclasstypeinfo.id=applyinfo.classtypeid;
                        userdata.applyclasstypeinfo.name=classtypedata.classname;
                        userdata.applyclasstypeinfo.price=classtypedata.price;
                        userdata.vipserverlist=classtypedata.vipserverlist;
                        userdata.applystate=appTypeEmun.ApplyState.Applying;//appTypeEmun.ApplyState.Applyvalidation;
                        userdata.applyinfo.applytime=new Date();
                        userdata.applyinfo.handelstate=appTypeEmun.ApplyHandelState.NotHandel;
                        //userdata.scanauditurl=auditurl.applyurl+userdata._id;
                        //console.log(userdata);
                        // 保存 申请信息
                        userdata.save(function(err,newuserdata){
                            if(err){
                                return   callback("保存申请信息错误："+err);
                            }
                            classtypedata.applycount=classtypedata.applycount+1;
                            coachdata.studentcoount=coachdata.studentcoount+1;
                            classtypedata.save();
                            coachdata.save();
                            return callback(null,"success");
                        });

                    });
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
      //if(userdata.applycount>10){
      //    return  callback("您已经超过了最大报名次数");
      //}
      if(userdata.applystate>appTypeEmun.ApplyState.Applying){
          return  callback("您已经报名成功，请不要重复报名");
      }
      if (applyinfo.applyagain!=1 &&userdata.applystate==appTypeEmun.ApplyState.Applying){
      if(userdata.applystate>appTypeEmun.ApplyState.NotApply){
          return  callback("此用户已经报名，请查看报名详情页");
      }

      }
      var searchcoachinfo={};
      if(applyinfo.coachid==-1||applyinfo.coachid=="-1"|| applyinfo.coachid.length<5){
          searchcoachinfo.driveschool=new mongodb.ObjectId(applyinfo.schoolid);
          searchcoachinfo.is_validation=true
      }else{
          searchcoachinfo._id=new mongodb.ObjectId(applyinfo.coachid)
      }
      var searchcoachinfo={};
      if(applyinfo.coachid==-1||applyinfo.coachid=="-1"|| applyinfo.coachid.length<5){
          searchcoachinfo.driveschool=new mongodb.ObjectId(applyinfo.schoolid);
          searchcoachinfo.is_validation=true
      }else{
          searchcoachinfo._id=new mongodb.ObjectId(applyinfo.coachid)
      }
      // 检查报名驾校和教练
      coachmode.findOne(searchcoachinfo,function(err,coachdata){
          if(err){
              return callback("不能找到报名的教练");
          }
          applyinfo.coachid=coachdata?coachdata._id:"";
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
                      getuserpayorder(applyinfo.userid,function(err,payorder){
                          if(err){
                              return callback("查询订单出错："+err);
                          }
                          if (payorder==1){
                              return callback("您有需要支付的订单，请先支付");
                          }

                  userdata.idcardnumber=applyinfo.idcardnumber?applyinfo.idcardnumber:userdata.idcardnumber;
                  userdata.name =applyinfo.name;
                  userdata.telephone=applyinfo.telephone;
                  userdata.address=applyinfo.address;
                  userdata.carmodel=applyinfo.carmodel;
                  userdata.userpic=applyinfo.userpic?applyinfo.userpic:userdata.userpic,
                  userdata.applyschool=applyinfo.schoolid;
                  userdata.applyschoolinfo.id=applyinfo.schoolid;
                  userdata.applyschoolinfo.name=schooldata.name;
                      userdata.referrerfcode=applyinfo.fcode;
                      userdata.applycount=userdata.applycount?userdata.applycount:0;
                      userdata.applycount=userdata.applycount+1;
                          if (applyinfo.coachid != "") {
                              userdata.applycoach=applyinfo.coachid;
                              userdata.applycoachinfo.id=applyinfo.coachid;
                              userdata.applycoachinfo.name=coachdata?coachdata.name:"";
                          }


                  userdata.applyclasstype=applyinfo.classtypeid;
                  userdata.applyclasstypeinfo.id=applyinfo.classtypeid;
                  userdata.applyclasstypeinfo.name=classtypedata.classname;
                  userdata.applyclasstypeinfo.price=classtypedata.price;
                          userdata.applyclasstypeinfo.onsaleprice=classtypedata.onsaleprice;
                  userdata.vipserverlist=classtypedata.vipserverlist;
                  userdata.applystate=appTypeEmun.ApplyState.Applying;
                  userdata.applyinfo.applytime=new Date();
                  userdata.applyinfo.handelstate=appTypeEmun.ApplyHandelState.NotHandel;
                      userdata.scanauditurl=auditurl.applyurl+userdata._id;
                          userdata.paytype=applyinfo.paytype;
                          userdata.paytypestatus=0;
                  //console.log(userdata);
                  // 保存 申请信息
                  userdata.save(function(err,newuserdata){
                      if(err){
                       return   callback("保存申请信息错误："+err);
                      }
                      classtypedata.applycount=classtypedata.applycount+1;
                      if(coachdata){
                          coachdata.studentcoount=coachdata.studentcoount+1;
                          coachdata.save();
                      }
                      classtypedata.save();
                      createuserpayorder(newuserdata,classtypedata,function(err,payorderdata){
                          basedatafun.getschoolinfo(newuserdata.applyschool,function(err,schooldata) {
                              payorderdata.schoollogoimg = schooldata ? schooldata.logoimg.originalpic : "";
                              payorderdata.schooladdress = schooldata ? schooldata.address:"";
                              payorderdata.applycoachinfo=newuserdata.applycoachinfo;
                              return callback(null, "success", payorderdata);
                          })

                      })
                      //if (applyinfo.paytype==2){
                      //
                      //}else
                      //{
                      //    return callback(null,"success");
                      //}
                  });
                      })

              });
          });

      });


  });
};


var getuserpayorder=function(userid,callback){
    UserPayModel.update({userid:userid,userpaystate:0},{userpaystate:4},function(err,data){
        return callback (err,0);
    });
    //UserPayModel.findOne({userid:userid},function(err,userpaydata){
    //    if(userpaydata){
    //        if (userpaydata.userpaystate==1||userpaydata.userpaystate==0||userpaydata.userpaystate==3) {
    //            return callback(err, 1);
    //        }else {
    //            return callback (err,0);
    //        }
    //    }
    //    else {
    //        return callback (err,0);
    //    }
    //})
}
// 用户取消订单
exports.userCancelOrder=function(userid,callback){
    usermodel.findById(userid)
        .exec(function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            if (userData.applystate != 1) {
                return callback("该订单无法取消");
            }
            UserPayModel.update({userid: userData._id, userpaystate: 0}, {userpaystate: 4}, function (err, excdata) {
            });

            userData.applystate = 0;  // 未报名
            userData.paytypestatus = 0;
            userData.save(function (err, data) {
                if (err) {
                    return callback("取消订单失败：" + err);
                }
                return callback(null, "", "success");
            })
        })
};
exports.getmyOrder=function(userid,callback){
    usermodel.findById(userid)
        .exec(function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            if (userData.applystate == 0) {
                return callback("用户未报名");
            }
            UserPayModel.findOne({"userid":userData._id,'$or':[{"userpaystate":0},{"userpaystate":2}]},
                function(err,payorderdata){
                    if (err) {
                        return callback("查询订单出错"+err);
                    }
                    //if(!payorderdata){
                    //    return callback("没有查询到订单信息");
                    //}
                    basedatafun.getschoolinfo(userData.applyschool,function(err,schooldata){
                    var returndata = {
                        applystate:userData.applystate,
                        schoollogoimg:schooldata?schooldata.logoimg.originalpic:"",
                        schooladdress :schooldata ? schooldata.address:"",
                        applycoachinfo:userData.applycoachinfo,
                        applyschoolinfo: userData.applyschoolinfo,
                        applyclasstypeinfo: userData.applyclasstypeinfo,
                        applytime: userData.applyinfo.applytime.toFormat("YYYY/MM/DD"),
                        endapplytime:userData.applyinfo.applytime.addMonths(1).toFormat("YYYY/MM/DD"),
                        scanauditurl: userData.scanauditurl,
                        orderid:payorderdata? payorderdata._id:userData._id,
                        name: userData.name,
                        mobile: userData.mobile,
                        paytype: userData.paytype,
                        paytypestatus: userData.paytypestatus,
                    };
                        if(!returndata.applyclasstypeinfo.onsaleprice||returndata.applyclasstypeinfo.onsaleprice==0){
                            returndata.applyclasstypeinfo.onsaleprice=returndata.applyclasstypeinfo.price;
                        }
                        returndata.applycoachinfo.coachid=returndata.applycoachinfo.id;
                        returndata.applyclasstypeinfo._id=returndata.applyclasstypeinfo.id;
                        returndata.applyclasstypeinfo.classname=returndata.applyclasstypeinfo.name;
                        if (userData.applystate == 2) {
                        returndata.paytypestatus = 20
                    }
                    return callback(null, returndata);
                    })
                })

        })
};
// 用户确认支付
exports.confirmPayOrder=function(payInfo,callback){
    usermodel.findById(payInfo.userid)
        .exec(function (err, userData) {
            if (err) {
                return callback("查找用户出错");
            }
            if (!userData) {
                return callback("没有查询到用户信息");
            }
            if (userData.applystate !=1) {
                return callback("用户未报名");
            }
            UserPayModel.findOne({"userid":userData._id,"userpaystate":0},
                function(err,payorderdata){
                    if (err) {
                        return callback("查询订单出错"+err);
                    }
                    if(!payorderdata){
                        return callback("没有查询到订单信息");
                    }
                    usermodel.update({"_id":userData._id},{"paytype":payInfo.paytype>0?2:1,"bcode":payInfo.bcode},{safe: false},function(err,data){});
                    payorderdata.paychannel=payInfo.paytype;
                    payorderdata.save(function(err,data){
                        return callback(null, "success");
                    })
                })

        })
};
//   用户线上支付 生成支付订单
var createuserpayorder=function(userdata,classdata,callback){
    var  userpayinfo=new  UserPayModel();
    userpayinfo.userid=userdata._id;
    userpayinfo.userpaystate=0;
    userpayinfo.creattime=new Date();
    userpayinfo.payendtime=(new Date()).addDays(3);
    userpayinfo.applyschoolinfo=userdata.applyschoolinfo;
    userpayinfo.applyclasstypeinfo.id=classdata._id;
    userpayinfo.applyclasstypeinfo.name=classdata.classname;
    userpayinfo.applyclasstypeinfo.price=classdata.price;
    userpayinfo.applyclasstypeinfo.onsaleprice=classdata.onsaleprice?classdata.onsaleprice:classdata.price;
    userpayinfo.paymoney=classdata.onsaleprice?classdata.onsaleprice:classdata.price;
    userpayinfo.save(function(err,data){
        if(err){
           return callback("生成支付订单失败："+err);
        }
        return callback(null,data);

    });
};

//　用户获取我的报名支付订单列表
exports.getMyApplyPayOrder=function(userid,orderstate,callback){
    var seacrchinfo={
        userid:userid
    }
    if (orderstate>-1){
        seacrchinfo.userpaystate=orderstate;
    }
    UserPayModel.find(seacrchinfo,function(err,userpaydata){
        if(err){
            return callback("查询支付订单失败:"+err);
        }
        var returndatalist=[];
        userpaydata.forEach(function(r,index){
        var returndata ={
            _id:r._id,
            userpaystate:r.userpaystate,
            creattime:r.creattime,
            payendtime:r.payendtime,
            beginpaytime:r.beginpaytime,
            paychannel:r.paychannel,
            applyschoolinfo:r.applyschoolinfo,
            applyclasstypeinfo:r.applyclasstypeinfo,
            discountmoney:r.discountmoney,
            paymoney:r.paymoney,
            activitycoupon:r.activitycoupon?r.activitycoupon:"",
            couponcode:r.couponcode?r.couponcode:"",
        };
            returndatalist.push(returndata);
        })
        return callback(null,returndatalist);
    })
}
// 用户订单使用优惠
exports.usercouponforpay=function(payconfirminfo,callback){
    UserPayModel.findOne({"_id":payconfirminfo.payoderid,
        "userid":payconfirminfo.userid},function(err,userpaydata){
        if (err){
            return callback("查询支付信息失败："+err);
        }
        if (!userpaydata){
            return callback("没有查询到订单信息");
        }
        if(userpaydata.userpaystate!=0){
            return callback("订单状态不能使用优惠券");
        }
        activityCouponModel.findOne({"_id":payconfirminfo.couponid,"couponcode":payconfirminfo.couponcode,"state":1,
                "endtime":{$gt: (new Date())}})
            .exec(function(err,data){
                if (!data){
                    return callback ("没有找到优惠券信息");
                }
                userpaydata.activitycoupon=data._id;
                userpaydata.couponcode=data.couponcode;
                userpaydata.discountmoney=data.couponmoney;
                userpaydata.paymoney=(userpaydata.applyclasstypeinfo.onsaleprice?
                        userpaydata.applyclasstypeinfo.onsaleprice:userpaydata.applyclasstypeinfo.price)-data.couponmoney;
                userpaydata.save(function(err,newuserpaydata){
                    if (err){
                        return callback ("使用优惠券失败");
                    }
                    data.usetime=new Date();
                    data.state=4; // 以消费
                    data.save(function(err,data){});
                    return callback(null,newuserpaydata);

                });

            })
    })
};
//用户生成微信预支付订单
exports.getprepayinfo=function(payconfirminfo,callback){
    UserPayModel.findOne({"_id":payconfirminfo.payoderid,
        "userid":payconfirminfo.userid},function(err,userpaydata) {
        if (err) {
            return callback("查询支付信息失败：" + err);
        }
        if (!userpaydata) {
            return callback("没有查询到订单信息");
        }
        if (userpaydata.userpaystate != 0) {
            return callback("订单状态不能支付");
        }

        var weixinpayinfo={
            body: userpaydata.applyschoolinfo.name+" "+userpaydata.applyclasstypeinfo.name,
            out_trade_no: userpaydata._id.toString(),
            total_fee: userpaydata.paymoney*100,
            spbill_create_ip: payconfirminfo.clientip,
            notify_url: merchant.notify_url,
            trade_type: 'APP',
            // product_id: '1234567890'
        };
        console.log("开始请求微信支付");
        console.log(weixinpayinfo);
        if(userpaydata.weixinpayinfo!=undefined&&userpaydata.weixinpayinfo!=""){
            console.log("已经获取过预支付信息");
            return callback(null,JSON.parse(userpaydata.weixinpayinfo));
        }
        weixinpauserver.createUnifiedOrder(weixinpayinfo,function(err,weixinpaydata){
            if(err){
                return callback("创建微信订单失败："+err);
            }
            if(weixinpaydata.return_code=="FAIL"){
                return callback("创建微信订单失败："+weixinpaydata.return_msg);
            }
            else {
                var reqparam = {
                    appid: app.id,
                    timestamp: Math.floor(Date.now()/1000)+"",
                    noncestr: weixinpaydata.nonce_str,
                    prepayid:weixinpaydata.prepay_id,
                    //sign:weixinpaydata.sign,
                    package: "Sign=WXPay",
                    partnerid:merchant.id
                };
                reqparam.sign = weixinpauserver.sign(reqparam);
                //reqparam.partnerid=merchant.id;
                UserPayModel.update({"_id":payconfirminfo.payoderid},
                    {$set:{weixinpayinfo:JSON.stringify(reqparam)}},function(err,data){});
                return callback(null,reqparam);
            }
        })
    })
}
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
        coachdata.coachtype=applyinfo.coachtype ? applyinfo.coachtype:coachdata.coachtype;
        coachdata.is_validation=false;
        if (applyinfo.driveschoolid){
           schoolModel.findById(new mongodb.ObjectId(applyinfo.driveschoolid),function(err,schooldata){
                if(err||!schooldata){
                    return callback("查询驾校出错："+err);
                }
                coachdata.driveschool=new mongodb.ObjectId(applyinfo.driveschoolid);
                coachdata.driveschoolinfo.id=applyinfo.driveschoolid;
                coachdata.driveschoolinfo.name=schooldata.name;
                coachdata.province=schooldata.province;
                coachdata.city=schooldata.city;
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
    var   weeklist=timeinfo.workweek.split(",");
    var weekdesc="";
    if (weeklist.length==7){
        weekdesc="全周";
    }
    else{
        for(i=0;i<weeklist.length;i++){

            if(appTypeEmun.weeks[weeklist[i]-1]!=undefined){
            weekdesc=weekdesc+appTypeEmun.weeks[weeklist[i]-1];}
        }
    }
    weekdesc =weekdesc +" "+timeinfo.begintimeint+":00--"+timeinfo.endtimeint+":00";

    coachmode.findById(new mongodb.ObjectId(timeinfo.coachid),function(err,coachdata){
        if (err||!coachdata){
            return  callback("查询教练出错："+err);
        }
       var   weeklist=timeinfo.workweek.split(",");
        coachdata.workweek=weeklist;
        coachdata.worktimedesc=weekdesc;
        coachdata.worktimespace.begintimeint=timeinfo.begintimeint;
        coachdata.worktimespace.endtimeint=timeinfo.endtimeint;
        var worktimes=[];
        //console.log(timeinfo);
        for(var i=parseInt(timeinfo.begintimeint);i<=parseInt(timeinfo.endtimeint);i++){
            appWorkTimes.forEach(function(r,index){

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
            coachdata.coachtype = updateinfo.coachtype ? updateinfo.coachtype : coachdata.coachtype;
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
                    coachdata.province=schooldata.province;
                    coachdata.city=schooldata.city;
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
                                return callback(null, "success",data.subject);
                            })

                        })
                    }
                    else
                    {
                    coachdata.save(function (err, data) {
                        if (err) {
                            return callback("保存教练信息出错：" + err);
                        }
                        return callback(null, "success",data.subject);
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

                        return callback(null, "success",data.subject);
                    })

                })
            }
            else {
                coachdata.save(function (err, data) {
                    if (err) {
                        return callback("保存教练信息出错：" + err);
                    }
                    return callback(null, "success",data.subject);
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
//IM 获取用户信息
exports.getImUserInfo=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("name  nickname headportrait")
        .exec(function(err,userdata){
            if(err){
                return callback("查询用户出错：" + err);
            }
            if(userdata){
                return callback(null,userdata);
            }else {
                coachmode.findById(new mongodb.ObjectId(userid))
                    .select("name   headportrait")
                    .exec(function(err,userdata){
                        if(err){
                            return callback("查询用户出错：" + err);
                        }
                        if(userdata) {
                            return callback(null, userdata);
                        }
                        else {
                            HeadMaster.findById(new mongodb.ObjectId(userid))
                                .select("name   headportrait")
                                .exec(function(err,userdata){
                                    if(err){
                                        return callback("查询用户出错：" + err);
                                    }
                                    if(userdata) {
                                        return callback(null, userdata);
                                    }
                                    else {
                                        return callback("没有查询到此用户");
                                    }
                                })
                        }
                    })
            }

    })
}
//获取用户信息
exports.getUserinfoServer=function(type,userid,getuserid,callback){
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
        coachmode.findById(new mongodb.ObjectId(userid))
            .populate("tagslist"," _id  tagname tagtype color")
            .populate("trainfield"," _id  pictures fieldname phone")
            .populate("serverclasslist","classname carmodel cartype begindate enddate classdesc price onsaleprice",{"is_using":true})
            .exec(function(err,coachdata){
            if (err || !coachdata) {
                return callback("查询教练出错：" + err);
            }
            var returnmodel=new resbasecoachinfomode(coachdata);
            returnmodel.token="";
            //returnmodel.mobile=mobileObfuscator(userinfo.mobile);
            returnmodel.coachid =coachdata._id;
                returnmodel.tagslist=coachdata.tagslist;
                returnmodel.trainfield=coachdata.trainfield;
                returnmodel.serverclasslist=coachdata.serverclasslist;
                returnmodel.is_favoritcoach=0;

                if (getuserid){
                    cache.get("Favoritcoach"+getuserid,function(err,data){
                        if(data){
                            var idx = data.indexOf(coachdata._id.toString());
                            if (idx != -1) {
                                returnmodel.is_favoritcoach=1;
                            }
                        }
                        return callback(null,returnmodel);
                    })
                }
                else {
                 return callback(null,returnmodel);
                }
        });
    }else
    {
        return callback("查询用户类型出错")
    }
};
exports.getCoachinfoServer=function(userid,callback){
    coachmode.findById(new mongodb.ObjectId(userid))
        .populate("tagslist"," _id  tagname tagtype color")
        .exec(function(err,coachdata) {
        if (err || !coachdata) {
            return callback("查询教练出错：" + err);
        }
        var returnmodel=new resbasecoachinfomode(coachdata);
        returnmodel.token=coachdata.token;
        returnmodel.usersetting=coachdata.usersetting;
        returnmodel.idcardnumber=idCardNumberObfuscator(coachdata.idcardnumber);
            returnmodel.tagslist=coachdata.tagslist;
        returnmodel.coachid =coachdata._id;
        userfcode.findOne({"userid":coachdata._id})
            .select("userid fcode money")
            .exec(function(err, fcodedata){
                returnmodel.fcode=fcodedata&&fcodedata.fcode?fcodedata.fcode:"";
                return callback(null,returnmodel);
            })
    });
};
//提醒用户报考
exports.remindExam=function(info,callback){
    usermodel.findOne({"_id":new  mongodb.ObjectId(info.userid),"applycoach":new mongodb.ObjectId(info.coachid)})
        .select("subject  subjecttwo  subjectthree d")
        .exec(function(err,data){
            if(err){
                return callback("查找用户出错："+err);
            }
            if (!data){
                return callback("没有查询到此学员的信息")
            }
            if( data.subject.subjectid==2){
                if (data.subjecttwo.finishcourse+data.subjecttwo.reservation<data.subjecttwo.totalcourse){
                    return callback("该学院的课时没有学满，无法报考");
                }
                if (data.examinationinfo.subjecttwo.examinationstate!=appTypeEmun.ExamintionSatte.noapply){
                    return callback("用户已经报考");
                }
                usermodel.update({"_id":new  mongodb.ObjectId(info.userid)},
                    {"examinationinfo.subjecttwo.examinationstate": appTypeEmun.ExamintionSatte.canapply},{safe: false},
                function(err,data){
                    return callback(null,"sucess");
                });
            }else  if ( data.subject.subjectid==3){
                if (data.subjectthree.finishcourse+data.subjectthree.reservation<data.subjectthree.totalcourse){
                    return callback("该学院的课时没有学满，无法报考");
                }
                if (data.examinationinfo.subjectthree.examinationstate!=appTypeEmun.ExamintionSatte.noapply){
                    return callback("用户已经报考");
                }
                usermodel.update({"_id":new  mongodb.ObjectId(info.userid)},
                    {"examinationinfo.subjecttwo.examinationstate": appTypeEmun.ExamintionSatte.canapply},{safe: false},
                    function(err,data){
                        return callback(null,"sucess");
                    });
            }else {
                return callback("该用户当前科目无法报考");
            }

        })
};
var  getcoachchoosetag=function(coachid,callback){
    try {
        coachmode.findById(new mongodb.ObjectId(coachid))
            .select("tagslist")
            .exec(function(err,data){
                if(err||!data){
                    return callback([]);
                }
                return callback(data.tagslist?data.tagslist:[]);
            })
    }catch(ex){
        return callback ([]);
    }
}
//获取教练所有的tag
exports.getAllCoachtags=function(coachid,callback){
    CoachTag.find({tagtype:0},function(err,systemdata){
        if  (err){
            return callback("查询标签出出错"+err);
        }
        CoachTag.find({tagtype:1,coachid:coachid},function(err,slefdata){
            if  (err){
                return callback("查询标签出出错"+err);
            }
            getcoachchoosetag(coachid,function(choosedata){
                systemdata= _.map(systemdata,function(item,i){
                  var colorid =parseInt(Math.random()*8, 10)
                    var systemitem={
                        _id:item._id,
                        tagname:item.tagname,
                        tagtype:item.tagtype,
                        coachid:item.coachid,
                        is_audit:item.is_audit,
                        color:item.color?item.color:colorarray[colorid],
                        is_choose: choosedata.indexOf(item._id.toString())>-1?true:false,
                    }
                    return  systemitem;
                });
                slefdata= _.map(slefdata,function(item,i){
                    var colorid =parseInt(Math.random()*8, 10);
                    var systemitem={
                        _id:item._id,
                        tagname:item.tagname,
                        tagtype:item.tagtype,
                        coachid:item.coachid,
                        is_audit:item.is_audit,
                        color:item.color?item.color:colorarray[colorid],
                        is_choose: choosedata.indexOf(item._id.toString())>-1?true:false,
                }
                    return  systemitem;
                });

                var returndata={
                    systemtag:systemdata,
                    selft:slefdata
                }
                return callback(null,returndata);
            })
        })
    })
};
// 添加教练自定义标签
exports.coachAddTag=function(taginfo,callback){
    var temptag=new CoachTag();
    var colorid =parseInt(Math.random()*8, 10);
    temptag.tagtype=1;
    temptag.tagname=taginfo.tagname;
    temptag.coachid=taginfo.coachid;
    temptag.is_audit=false;
    temptag.color=colorarray[colorid];
    temptag.save(function(err,data){
        if(err){
            return  callback("保存标签出错："+err);
        }
        return callback(null,data);
    })
}
// 删除教练自定义标签
exports.coachDeletetag=function(taginfo,callback){
    CoachTag.remove({_id:new mongodb.ObjectId(taginfo.tagid),tagtype:1,is_audit:false,coachid:taginfo.coachid},function(err,data){
        if(err){
            return callback("删除标签出错");
        }
        return callback(null,"success");
    });
};
// 教练设置自己标签
exports.coachSetTags =function(taginfo,callback){
    taglist=taginfo.tagslist.split(",");
    if(taginfo.lengt==0){
        taglist=[];
    }
    coachmode.update({"_id":taginfo.coachid}, { $set: { tagslist: taglist}},function(err,data){
        if(err){
            return callback("保存教练标签出错");
        }
        return  callback(null,"sucess");
    })
};
// 教练 获取系统消息
exports.getSystemInfo =function(searchinfo,callback){
    SystemMessage.find({userid:searchinfo.coachid})
        .skip((searchinfo.index-1)*searchinfo.count)
        .limit(searchinfo.count)
        .sort({"createtime":-1})
        .exec(function(err,data){
            if (err){
                return callback("查询系统消息出错："+err);
            }
            return callback(null,data);
        })
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
            return callback("验证码错误，请重新发送");
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

