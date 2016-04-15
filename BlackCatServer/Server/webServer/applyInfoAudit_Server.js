/**
 * Created by v-yaf_000 on 2015/12/7.
 */

var mongodb = require('../../models/mongodb.js');
var typeEmun=require("../../custommodel/emunapptype");
var pushstudent=require("../../Common/PushStudentMessage");
var userserver=require("../user_server");
var usermodel=mongodb.UserModel;
var coachmodel=mongodb.CoachModel;
var schoolModel=mongodb.DriveSchoolModel;
var mallProductModel=mongodb.MallProdcutsModel
var mallOrderModel=mongodb.MallOrderModel;
var merChantModel=mongodb.MerChantModel;
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var moneyCalculation=require("../purse/moneyCalculation");
var cache=require("../../Common/cache");
require('date-utils');

var timeout = 60 * 5;
var  checkSmsCode=function(mobile,code,callback){
    smsVerifyCodeModel.findOne({mobile:mobile,smsCode:code, verified: false},function(err,instace){
        if(err)
        {
            return callback("查询出错: "+ err);
        }
        if (!instace)
        {
            return callback("验证码错误");
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
exports.getUserapplySchool=function(userid,callback){
    usermodel.findById(new mongodb.ObjectId(userid))
        .select("_id  name mobile applystate applyinfo handelstate " +
            " applyschoolinfo  applycoachinfo carmodel applyclasstypeinfo")
        .exec(function(err,data){
            if(err){
                return callback("查询用户出错");
            }
            if (!data){
                return callback("没有查询到用户的相关信息");
            }
            if(data.applystate==typeEmun.ApplyState.NotApply){
                return callback("该用户没有提交报名申请");
            }

            var userinfo={
                userid:data._id,
                name: data.name,
                mobile:data.mobile,
                applytime:(data.applyinfo.applytime).toFormat("YYYY-MM-DD"),
                endtime:(data.applyinfo.applytime).addMonths(1).toFormat("YYYY-MM-DD"),
                applyschoolinfo:data.applyschoolinfo,
                applycoachinfo:data.applycoachinfo,
                carmodel:data.carmodel,
                applyclasstypeinfo:data.applyclasstypeinfo,
                alreadaduit:0
            }
            if(data.applystate==typeEmun.ApplyState.Applyed||data.is_confirmbyscan){
                userinfo.alreadaduit=1
            }
            return callback(null,userinfo);
        })
}

 exports.doapplyinfoAudit=function(auditinfo,callback){
    var failcount=0;
    cache.get("doapplyinfoAudit"+auditinfo.userid,function(err,data){
        if (err){
            return callback("系统内部错误");
        }
        if(data){
            failcount=data;

        }
        if(failcount>5){
            return callback("审核锁定，请二十分钟后再试");
        }
    usermodel.findById(new mongodb.ObjectId(auditinfo.userid))
        .exec(function(err,data){
            if (data.applystate!=typeEmun.ApplyState.Applying||data.is_confirmbyscan==true){
                return callback ("该用户无法确认报名");
            }
            if (!data){
                return callback ("无法查找到此用户")
            }
            schoolModel.findOne({"_id":auditinfo.schoolid})
                .exec(function(err,schooldata){
                    if(err){
                        return callback("驾校确认失败");
                    }
                    if (!schooldata){
                        ++failcount;
                        cache.set("doapplyinfoAudit"+auditinfo.userid,failcount,60*20,function(err,data){});
                        return callback("确认码错误");
                    }
                    var index=-1;
                    index= schooldata.confirmmobilelist.indexOf(auditinfo.mobile);
                    if(index==-1){
                        ++failcount;
                        cache.set("doapplyinfoAudit"+auditinfo.userid,failcount,60*20,function(err,data){});
                        return callback("手机号不无法进行验证");
                    }
                    checkSmsCode(auditinfo.mobile,auditinfo.confirmnum,function(err){
                        if(err){
                            ++failcount;
                            cache.set("doapplyinfoAudit"+auditinfo.userid,failcount,60*20,function(err){});
                            return callback(err);
                        }
                    data.applystate=typeEmun.ApplyState.Applyed;
                    data.is_confirmbyscan=true;
                    data.applyinfo.handelstate=typeEmun.ApplyHandelState.Handeled;
                    data.applyinfo.handeltime=new Date();
                    data.applyinfo.handelmessage=schooldata.name+"扫描验证";
                    data.subject.subjectid=1;
                    data.subject.name="科目一";
                        data.paytype=1;
                        data.paytypestatus=20;
                    data.save(function(err,data){
                        if(err){
                            return callback("驾校确认失败");
                        }
                        var  userinfo={
    referrerfcode:data.referrerfcode,
    userid:data._id,
    usertype:1,
    invitationcode:data.invitationcode,
    "applyclasstype":data.applyclasstype
}
                        moneyCalculation.applySuccess(userinfo,function(err,data){});
                        pushstudent.pushApplySuccess(data._id,function(){});
                        return callback(null,err);
                    })
                    })
                })
        })
    })
}

var getuserinfo=function(userid,usertype,callback){
    if(usertype==typeEmun.UserType.User){
        usermodel.findById(new mongodb.ObjectId(userid))
            .select("_id  name mobile")
            .exec(function(err,data){
                if(err||!data){
                    return callback("没有查找到用户");
                }
                return callback(null,data);
            })
    }else{
        coachmodel.findById(new mongodb.ObjectId(userid))
            .select("_id  name mobile")
            .exec(function(err,data){
                if(err||!data){
                    return callback("没有查找到用户");
                }
                return callback(null,data);
            })
    }
}
exports.getUserProductOrder=function(orderid,callback){
    mallOrderModel.findById(new mongodb.ObjectId(orderid))
        .populate("productid"," productname  productprice  merchantid")
        .exec(function(err,data){
            if(err||!data){
                return callback("没有找到相关");
            }
            if (data.orderstate!=typeEmun.MallOrderState.applying||data.is_confirmbyscan){
                return callback("订单已完成");
            };
            getuserinfo(data.userid,data.usertype,function(err,userdata){
                if(err){
                    return callback(err);
                }
                if(data.productid.merchantid){
                    merChantModel.findById(new mongodb.ObjectId(data.productid.merchantid),function(err,merchantdata){
                        if (err||!merchantdata){
                            return callback("没有查询到商家");
                        };
                        var orderinfo={
                            orderid:data._id,
                            orerdertime:(data.createtime).toFormat("YYYY-MM-DD"),
                            endtime:(data.createtime).addMonths(1).toFormat("YYYY-MM-DD"),
                            productid:data.productid._id,
                            productname: data.productid.productname,
                            productprice: data.productid.productprice,
                            userid:userdata._id,
                            username:userdata.name,
                            usermobile:userdata.mobile,
                            merchantid:merchantdata._id,
                            merchantname:merchantdata.name,
                            merchantmobile:merchantdata.mobile,
                            merchantaddress:merchantdata.address,
                            alreadaduit:0
                        };
                        if(data.orderstate!=typeEmun.MallOrderState.applying||data.is_confirmbyscan){
                            orderinfo.alreadaduit=1;
                        };
                        return callback(null,orderinfo);
                    })
                }else{
                return callback("没有查询到商家");}

            })

        })
}
exports.doOrderScanAudit=function(auditinfo,callback){
   var  failcount=0;

    cache.get("doOrderScanAudit"+auditinfo.orderid,function(err,data){
        if (err){
            return callback("系统内部错误");
        }
        if(data){
            failcount=data;

        }
        if(failcount>5){
            return callback("审核锁定，请二十分钟后再试");
        }
    mallOrderModel.findById(new mongodb.ObjectId(auditinfo.orderid))
        .populate("productid"," is_scanconsumption  merchantid")
        .exec(function(err,data) {
            if (err || !data) {
                return callback("没有找到相关");
            }
            if (data.orderstate!=typeEmun.MallOrderState.applying||data.is_confirmbyscan){
                return callback("订单已完成");
            }
            merChantModel.findOne({"_id":auditinfo.merchantid},
                function(err,merchantdata){
                if (err||!merchantdata){
                    return callback("没有查询到商家");
                }
                    var index=-1;
                    index= merchantdata.confirmmobilelist.indexOf(auditinfo.mobile);
                    if(index==-1){
                        ++failcount;
                        cache.set("doOrderScanAudit"+auditinfo.orderid,failcount,60*20,function(err,data){});
                        return callback("手机号不无法进行验证");
                    }
                    checkSmsCode(auditinfo.mobile,auditinfo.confirmnum,function(err){
                        if(err){
                            ++failcount;
                            cache.set("doOrderScanAudit"+auditinfo.orderid,failcount,60*20,function(err){});
                            return callback(err);
                        }
                    data.finishtime=new Date();
                    data.orderstate=typeEmun.MallOrderState.finished;
                    data.is_confirmbyscan=true;
                    data.save(function(err,data){
                        if(err){
                            return callback("验证失败");
                        }
                        return callback(null,"sucess");
                    })});
                });
        })});
}
//发送商家 验证码
exports.sendMerchantcode=function(sendinfo,callback) {
    merChantModel.findById(new mongodb.ObjectId(sendinfo.merchantid),function(err,merchantdata){
        if(err||!merchantdata){
            return callback("查询商家出错");
        }
        var index=-1;
        index= merchantdata.confirmmobilelist.indexOf(sendinfo.mobile);
        if(index==-1){
            return callback("手机号无法进行验证");
        }
        userserver.getCodebyMolile(sendinfo.mobile,function(err,data){
            if(err){
                return  callback(err);
            }
            return callback(null,"success");
        })

    })
}

exports.sendSchoolcode=function(sendinfo,callback) {
    schoolModel.findById(new mongodb.ObjectId(sendinfo.schoolid),function(err,schooldata){
        if(err||!schooldata){
            return callback("查询驾校出错");
        }
        var index=-1;
        index= schooldata.confirmmobilelist.indexOf(sendinfo.mobile);
        if(index==-1){
            return callback("手机号无法进行验证");
        }
        userserver.getCodebyMolile(sendinfo.mobile,function(err,data){
            if(err){
                return  callback(err);
            }
            return callback(null,"success");
        })

    })
}


// 获取订单信息
exports.getProductOrderinfo=function(orderid,callback){
    mallOrderModel.findById(new mongodb.ObjectId(orderid))
        .populate("productid"," productname  productprice  merchantid")
        .exec(function(err,data){
            if(err||!data){
                return callback("没有找到相关订单");
            }
                if(data.productid.merchantid){
                    merChantModel.findById(new mongodb.ObjectId(data.productid.merchantid),function(err,merchantdata){
                        if (err||!merchantdata){
                            return callback("没有查询到商家");
                        };
                        var orderinfo={
                            orderid:data._id,
                            orderscanaduiturl:data.orderscanaduiturl,
                            orerdertime:(data.createtime).toFormat("YYYY-MM-DD"),
                            enddate:(data.createtime).addMonths(1).toFormat("YYYY-MM-DD"),
                            productid:data.productid._id,
                            productname: data.productid.productname,
                            productprice: data.productid.productprice,
                            merchantid:merchantdata._id,
                            merchantname:merchantdata.name,
                            merchantmobile:merchantdata.mobile,
                            merchantaddress:merchantdata.address,
                            distinct:0
                        };
                        return callback(null,orderinfo);
                    })
                }else{
                    return callback("没有查询到商家");}



        })
}