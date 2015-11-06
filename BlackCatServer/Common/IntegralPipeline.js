/**
 * Created by li on 2015/11/6.
 */

// 积分计算管理
var async = require('async');
var mongodb = require('../models/mongodb.js');
var userModel=mongodb.UserModel;
var coachModel=mongodb.CoachModel;
var integralListModel=mongodb.IntegralListModel;
var appTypeEmun=require("../custommodel/emunapptype");
var commonData=require("../Config/Commondata").integralrule;

// 发放积分
payuserIntegral=function(payinfo,callback){
  var integralinfo=new integralListModel;
    integralinfo.userid=payinfo.userid;
    integralinfo.usertype=payinfo.usertype;
    integralinfo.amount=payinfo.amount;
    integralinfo.type=payinfo.type;
    integralinfo.save(function(err,data){
        if(payinfo.usertype==appTypeEmun.UserType.User){
            userModel.update({"_id":new mongodb.ObjectId(payinfo.userid)},{$inc: { wallet: payinfo.amount }},function(err,data){
              callback(null,"suncess");
            })

        }else if(payinfo.usertype==appTypeEmun.UserType.Coach){
            coachModel.update({"_id":new mongodb.ObjectId(payinfo.userid)},{$inc: { wallet: payinfo.amount }},function(err,data){
                callback(null,"suncess");
            })
        }
    })
}

// 循环父级积分
Calculationfather=function(fathlist,intotal,scale,callback){
    var count1 = fathlist.length;
    async.whilst(
        function() { return count1 > 0&&intotal>1 },
        function(cb) {
            var tempamount=Math.floor(intotal*scale);
            intotal=intotal-tempamount;
            count1--;
            var payinfo={
                userid:fathlist[count1].userid,
                usertype:fathlist[count1].usertype,
                type:appTypeEmun.IntegralType.friendregister,
                amount:tempamount
            };
            payuserIntegral(payinfo,function(err,redata){

            })
            setTimeout(cb, 200);
        },
        function(err) {
            console.log('Calculationfather err: ', err);
            return callback(err);
        }
    );
}
// 查找邀请人
getfatheruser=function(referrerCode,callback){
    userModel.findOne({invitationcode:referrerCode})
        .select("wallet integralpaylist")
        .exec(function(err,fatheruser){
            console.log(fatheruser)

            if(!fatheruser)
            {
                coachModel.findOne({invitationcode:referrerCode})
                    .select("wallet integralpaylist")
                    .exec(function(err,fathercoach){
                        if(fathercoach){
                            var returndata={
                                _id:fathercoach._id,
                                wallet:fathercoach.wallet,
                                integralpaylist:fathercoach.integralpaylist,
                                usertype:appTypeEmun.UserType.Coach
                            }
                            return callback(null,returndata);
                        }
                        else{
                            return callback(null,null);
                        }
                    })

            }else{
                var returndata={
                    _id:fatheruser._id,
                    wallet:fatheruser.wallet,
                    integralpaylist:fatheruser.integralpaylist,
                    usertype:appTypeEmun.UserType.User
                }
                return callback(null,returndata);
            }
        })
}

try{
    async.forever(
        function(cb) {
            async.waterfall([
                //在用户表中查找要发放积分的用户
                function(cb) {
                    // 用户表里面查找
                    userModel.findOneAndUpdate({integralstate:appTypeEmun.IntegralState.nopay},
                        {integralstate:appTypeEmun.IntegralState.registerpaying})
                        .select("name integralstate integralpaylist wallet referrerCode")
                        .exec(function(err,data){
                            console.log(data);
                            cb(null,data);
                        })
                },
                // 查找用户邀请人员
                function(data, cb) {
                    if (data) {
                        getfatheruser(data.referrerCode, function (err, faterdata) {
                            if (err) {
                                cb(err)
                            }
                            if (faterdata) {// 找到邀请人
                                var amount = commonData.passiveregister;
                                var slfeget = Math.floor(amount * commonData.levelscale);
                                Calculationfather(faterdata.integralpaylist, amount - slfeget, commonData.levelscale, function (err) {
                                    console.log(' 完成循序发积分 ');
                                })
                                var payinfo = {
                                    userid: data._id,
                                    usertype: appTypeEmun.UserType.User,
                                    type:appTypeEmun.IntegralType.register,
                                    amount: slfeget
                                };
                                payuserIntegral(payinfo, function (err, redata) {
                                    var paylist = faterdata.integralpaylist;
                                    var payone = {
                                        id: faterdata.integralpaylist.length + 1,
                                        userid: data._id,
                                        usertype: appTypeEmun.UserType.User
                                    }
                                    paylist.push(payone);
                                    userModel.update({"_id": new mongodb.ObjectId(data._id)},
                                        {
                                            integralstate: appTypeEmun.IntegralState.registerpayed,
                                            integralpaylist: paylist
                                        }, function (err, data) {
                                            console.log(data);
                                        })
                                })
                            }
                            //没有找到邀请人，自己注册
                            else {
                                var payinfo = {
                                    userid: data._id,
                                    usertype: appTypeEmun.UserType.User,
                                    type:appTypeEmun.IntegralType.register,
                                    amount: commonData.selfregister
                                };
                                payuserIntegral(payinfo, function (err, redata) {
                                    var paylist = [];
                                    var payone = {
                                        id: 1,
                                        userid: data._id,
                                        usertype: appTypeEmun.UserType.User
                                    }
                                    paylist.push(payone);
                                    userModel.update({"_id": new mongodb.ObjectId(payinfo.userid)},
                                        {
                                            integralstate: appTypeEmun.IntegralState.registerpayed,
                                            integralpaylist: paylist
                                        }, function (err, data) {
                                            console.log(data);
                                        })
                                })

                            }
                        })
                    }
                    else {

                    console.log("没有查找到用户可以发放积分")
                        setTimeout(cb, 1000);

                };

                },
                // 在教练表中查找需要发送积分的用户
                function(cb){
                    // 教练表里面查找
                    coachModel.findOneAndUpdate({integralstate:appTypeEmun.IntegralState.nopay},
                        {integralstate:appTypeEmun.IntegralState.registerpaying})
                        .select("name integralstate integralpaylist wallet referrerCode")
                        .exec(function(err,data){
                            console.log(data);
                            cb(null,data);
                        })
                },
                // 计算可以发放积分的教练
            function(coachdata,cb){
                if (coachdata) {
                    getfatheruser(coachdata.referrerCode, function (err, faterdata) {
                        if (err) {
                            cb(err)
                        }
                        if (faterdata) {// 找到邀请人
                            var amount = commonData.passiveregister;
                            var slfeget = Math.floor(amount * commonData.levelscale);
                            Calculationfather(faterdata.integralpaylist, amount - slfeget, commonData.levelscale, function (err) {
                                console.log(' 完成循序发积分 ');
                            })
                            var payinfo = {
                                userid: coachdata._id,
                                usertype: appTypeEmun.UserType.Coach,
                                type:appTypeEmun.IntegralType.register,
                                amount: slfeget
                            };
                            payuserIntegral(payinfo, function (err, redata) {
                                var paylist = faterdata.integralpaylist;
                                var payone = {
                                    id: faterdata.integralpaylist.length + 1,
                                    userid: coachdata._id,
                                    usertype: appTypeEmun.UserType.Coach
                                }
                                paylist.push(payone);
                                coachModel.update({"_id": new mongodb.ObjectId(coachdata._id)},
                                    {
                                        integralstate: appTypeEmun.IntegralState.registerpayed,
                                        integralpaylist: paylist
                                    }, function (err, data) {
                                        console.log(data);
                                    })
                            })
                        }
                        //没有找到邀请人，自己注册
                        else {
                            var payinfo = {
                                userid: coachdata._id,
                                usertype: appTypeEmun.UserType.Coach,
                                type:appTypeEmun.IntegralType.register,
                                amount: commonData.selfregister
                            };
                            payuserIntegral(payinfo, function (err, redata) {
                                var paylist = [];
                                var payone = {
                                    id: 1,
                                    userid: coachdata._id,
                                    usertype: appTypeEmun.UserType.User
                                }
                                paylist.push(payone);
                                coachModel.update({"_id": new mongodb.ObjectId(coachdata.userid)},
                                    {
                                        integralstate: appTypeEmun.IntegralState.registerpayed,
                                        integralpaylist: paylist
                                    }, function (err, data) {
                                        console.log(data);
                                    })
                            })

                        }
                    })
                }
                else {

                    console.log("没有查找到教练可以发放积分")
                    setTimeout(cb, 1000);

                };
            }

            ], function (err, result) {
               if (err){
                   console.log("")
               }
            });
            setTimeout(cb, 1000);
        },
        function(err) {
            console.log('1.1 err: ', err);
        }
    );

}catch(err){
    console.log("计算积分错误：");
    console.log(err);
}
