/**
 * Created by v-yaf_000 on 2015/12/26.
 */
var mongodb = require('../../models/mongodb.js');
var Hashids = require("../../Common/hashids");
var userfcode=mongodb.UserFcode;
var classtype=mongodb.ClassTypeModel;
var  systemIncome=mongodb.SystemIncome;
 var Coupon=mongodb.Coupon;
var hashids = new Hashids("yibukejihoutai",5,"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
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
        var id = hashids.encode(displyid);
        return type==1? ("FA"+id):("FB"+id);
    },
    saveincome:function(userinfo,fcodeinfo,is_reffercode,callback){
        systemIncome.findOne({"userid":userinfo.userid},function(err,systemincomedata){
            if(err){
                return callback("查询收益出错");
            }
            if(data){
                return callback("用户收益已存在");
            }else{
                classtype.findById(new mongodb.ObjectId(userinfo.applyclasstype),function(err,classtypedata){
                    if(err||!classtypedata){
                        return callback("查找班型出错");
                    }
                   var tempincome=new systemIncome();
                    tempincome.userid=userinfo.userid;
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
                    tempincome.rewardsurplus=0;
                    tempincome.settingrewardtime=(new Date()).addDays(7);
                    tempincome.rewardstate=0;
                    tempincome.save(function(err,data){
                        if(err){
                            return callback("保存报名信息出错");
                        }
                        //生成优惠券
                       var tempcoupon=new Coupon();
                        tempcoupon.userid=userinfo.userid;
                        tempcoupon.couponcomefrom=1;
                        tempcoupon.sysincomeid=data._id;
                        tempcoupon.state=0
                        tempcoupon.remark="";
                        tempcoupon.save(function(err,data){
                            return(null,"suncess")
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
            var fcode=defaultfun.createfcode(userdata.invitationcode,2);
            if(userdata){
                //已存在Y吗
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

                })
            }
        })
    })

}