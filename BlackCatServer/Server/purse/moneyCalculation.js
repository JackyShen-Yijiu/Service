/**
 * Created by v-yaf_000 on 2015/12/26.
 */
var mongodb = require('../../models/mongodb.js');
var Hashids = require("../../Common/hashids");
var userfcode=mongodb.UserFcode;
var classtype=mongodb.ClassTypeModel;
var  systemIncome=mongodb.SystemIncome;
 var Coupon=mongodb.Coupon;
var hashids = new Hashids("yibukejihoutai",3,"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
require('date-utils');
//  查找邀请人
var defaultfun={
    searchreferrerFCode:function(referrerFCode,callback){
        if(referrerFCode===undefined||referrerFCode==""){
            return callback("没有邀请码");
        }
        userfcode.findOne({"fcode":referrerFCode},function(err,data){
            if(err){
                return callback("查询邀请码Y码出错："+err);
            }
            if(!data){
                return callback("没有查到数据");
            }
            return callback(null,data);
        })
    },
    createfcode:function(displyid,type){
        var id = hashids.encode(parseInt(displyid));
        //console.log("YA"+id);
        return type==1? ("YA"+id):("YB"+id);
    },
    saveincome:function(userinfo,fcodeinfo,is_reffercode,callback){
        systemIncome.findOne({"userid":userinfo.userid},function(err,systemincomedata){
            if(err){
                return callback("查询收益出错");
            }
            if(systemincomedata){
                return callback("用户收益已存在");
            }else{
                classtype.findById(new mongodb.ObjectId(userinfo.applyclasstype),function(err,classtypedata){
                    if(err||!classtypedata){
                        return callback("查找班型出错");
                    }
                   var tempincome=new systemIncome();
                    tempincome.userid=userinfo.userid;
                    tempincome.is_referrer=is_reffercode;
                    tempincome.applyclasstype=classtypedata._id;
                    tempincome.classprice=classtypedata.price;
                    tempincome.dealprice=classtypedata.onsaleprice;
                    tempincome.totalrevenue=classtypedata.onsaleprice-classtypedata.originalprice;
                    tempincome.systemretains=classtypedata.systemretains;
                    tempincome.userdeserveincome=classtypedata.feedbackuser;
                    tempincome.useractualincome=0;
                    tempincome.rewardmoney=is_reffercode?classtypedata.rewardmoney:0;
                    tempincome.systemsurplus=tempincome.totalrevenue-tempincome.useractualincome-tempincome.systemretains-
                        tempincome.rewardmoney;
                    tempincome.rewardsurplus=0;   // 奖励剩余
                    tempincome.settingrewardtime=(new Date()).addDays(8);
                    tempincome.rewardstate=0;
                    tempincome.save(function(err,data){
                        if(err){
                            return callback("保存报名信息出错"+err);
                        }
                        //生成优惠券
                       var tempcoupon=new Coupon();
                        tempcoupon.userid=userinfo.userid;
                        tempcoupon.couponcomefrom=1;
                        tempcoupon.sysincomeid=data._id;
                        tempcoupon.state=0;
                        tempcoupon.is_forcash=is_reffercode;
                        tempcoupon.remark="";
                        tempcoupon.save(function(err,data){
                            return callback(null,"suncess")
                        });
                    });
                })
            }
        })
    }
}

// 用户报名成功生成自己的F码

exports.applySuccess=function(userinfo,callback){
    // 查找邀请人
    defaultfun.searchreferrerFCode(userinfo.referrerfcode,function(err,referrdata){
        var is_havereferr=false;
        var referrlist=[];
        if(referrdata){
            is_havereferr=true;
            referrlist=referrdata.fatherFcodelist?referrdata.fatherFcodelist:[];
            if (referrlist.indexOf(referrdata.fcode)<=-1){
            referrlist.push(referrdata.fcode);}
        }
        userfcode.findOne({"userid":userinfo.userid},function(err,userdata){
            if(err){
                return callback("查询Y码出错："+err);
            }
            var fcode=defaultfun.createfcode(userinfo.invitationcode,2);
            if(userdata){
                //已存在Y吗
                userfcode.update({"userid":userinfo.userid},{$set:{ fatherFcodelist:referrlist}},function(err,data){
                    defaultfun.saveincome(userinfo,userdata,is_havereferr,function(err,data){
                        return callback(err,data);
                    });
                })
            }else{
                //保存Y码
                var tempuser=userfcode({
                    userid:userinfo.userid,
                    usertype:userinfo.usertype,
                    fcode:fcode,
                    referrerfcode:userinfo.referrerfcode,
                    codetype:2,
                    fatherFcodelist:referrlist
                });
                tempuser.save(function(err,data){
                    if(err){
                        callback("保存Y码出错");
                    }
                    defaultfun.saveincome(userinfo,data,is_havereferr,function(err,data){
                        return callback(err,data);
                    })
                })
            }
        })
    })

}

//var  userinfo={
//    referrerfcode:"",
//    userid:"56332bc4608d71017df2ab23",
//    usertype:1,
//    invitationcode:"1001",
//    "applyclasstype":"562dd2508b8ef3d046b67ccd"
//}

//var  userinfo={
//    referrerfcode:"FBRL77",
//    userid:"562cb02e93d4ca260b40e544",
//    usertype:1,
//    invitationcode:"1019",
//    "applyclasstype":"562dd2508b8ef3d046b67ccd"
//}
//
//applySuccess(userinfo,function(err,data){
//    console.log(err);
//    console.log(data);
//})