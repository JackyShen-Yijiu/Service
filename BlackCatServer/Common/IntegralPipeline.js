/**
 * Created by li on 2015/11/6.
 */

// 积分计算管理
var async = require('async');
var mongodb = require('../models/mongodb.js');
var userModel=mongodb.UserModel;
var coachModel=mongodb.CoachModel;
var userfcode=mongodb.UserFcode;
var  systemIncome=mongodb.SystemIncome;
var  incomeDetails=mongodb.IncomeDetails;
var integralListModel=mongodb.IntegralListModel;
var appTypeEmun=require("../custommodel/emunapptype");
var commonData=require("../Config/commondata").integralrule;
var pushstudent=require("./PushStudentMessage");
var pushcoach=require("./PushCoachMessage");

// 发放积分
payuserIntegral=function(payinfo,callback){
  var integralinfo=new integralListModel;
    integralinfo.userid=payinfo.userid;
    integralinfo.usertype=payinfo.usertype;
    integralinfo.amount=payinfo.amount;
    integralinfo.type=payinfo.type;
    integralinfo.createtime=new Date();
    integralinfo.save(function(err,data){
        if(payinfo.usertype==appTypeEmun.UserType.User){
            userModel.update({"_id":new mongodb.ObjectId(payinfo.userid)},{$inc: { wallet: payinfo.amount }},function(err,data){
                pushstudent.pushWalletUpdate(payinfo.userid,function(err,data){})
              callback(null,"suncess");

            })

        }else if(payinfo.usertype==appTypeEmun.UserType.Coach){
            coachModel.update({"_id":new mongodb.ObjectId(payinfo.userid)},{$inc: { wallet: payinfo.amount }},function(err,data){
                pushcoach.pushWalletUpdate(payinfo.userid,function(err,data){})
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
           // console.log(fatheruser)

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
                           // console.log(data);
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
                            if (data.referrerCode&&ata.referrerCode.length>0&&faterdata) {// 找到邀请人
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
                                            cb();
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
                                            cb();
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
                          //  console.log(data);
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
                                        cb();
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
                                        cb();
                                    })
                            })

                        }
                    })
                }
                else {

                    console.log("没有查找到教练可以发放积分")
                    setTimeout(cb, 1000*10);

                };
            }

            ], function (err, result) {
               if (err){
                   console.log("发放积分出错："+err);
               }
                //console.log(result);
                setTimeout(cb, 1000*10);
            });

        },
        // 报名信息发放

        function(err) {
            console.log('1.1 err: ', err);
        }
    );

    //报名 信息发放
    async.forever(
        function(cb){
            //console.log("dsfsdfds");
            async.waterfall([
                //查找可以发放的用户
                function(cb){
                    // 查找没有发放，同时修改状态1  发放中
                    systemIncome.findOneAndUpdate({"rewardstate":0
                            ,"settingrewardtime":{$lt:new Date()}
                        },
                        {"rewardstate":1},function(err,data){
                            cb(err,data);
                        })
                },
                function(systemincomedata,cb){
                    if (systemincomedata){
                        //如果不是受邀用户
                        if(!systemincomedata.is_referrer){
                            systemIncome.update({"_id":systemincomedata._id},{$set:{rewardstate:2,actualrewardtime:new Date()}},
                                function(err,data){
                                    cb(err,data);
                                })
                        }else{   // 是受邀用户
                            userfcode.findOne({"userid":systemincomedata.userid},function(err,userfcodedata){
                                if(err){
                                    cb(err);
                                }
                                if(!userfcodedata){
                                    cb("没有找到订单：的F吗"+systemincomedata.userid);
                                }
                                var incomedetailsidlist=[];
                                // 保存报名人的发放金额
                                var  selfincomedetails=new incomeDetails();
                                selfincomedetails.userid=userfcodedata.userid;
                                selfincomedetails.usertype=userfcodedata.usertype;
                                selfincomedetails.income=systemincomedata.useractualincome;
                                selfincomedetails.createtime=new Date();
                                selfincomedetails.type=1;  //收入
                                selfincomedetails.save(function(err,data){
                                    userfcode.update({"userid":userfcodedata.userid},
                                        {$inc: { money: systemincomedata.useractualincome }},function(err,data){}
                                    )
                                    incomedetailsidlist.push(data._id);
                                });
                                // // 发放邀请人的
                                rewardfcodelist=userfcodedata.fatherFcodelist;
                                var rewardcount=rewardfcodelist.length;
                                var rewardmoneytotal=systemincomedata.rewardmoney;
                                var actrewardmoneytotal=0;
                                var isfirst=0;
                                var iswhilst=true;
                                if(rewardcount>0&&rewardmoneytotal>1)
                                {
                                    iswhilst=true;
                                }
                                else {
                                    iswhilst=false;
                                }
                                async.whilst(
                                    function() { return iswhilst },
                                    function(cb) {
                                        rewardcount--;
                                        var fcode=rewardfcodelist[rewardcount];
                                        userfcode.findOne({"fcode":fcode},function(err,tempfcodedata){
                                            if(err||!tempfcodedata){
                                                if(rewardcount>0&&rewardmoney>1)
                                                {
                                                    iswhilst=true;
                                                }
                                                else {
                                                    iswhilst=false;
                                                }
                                                cb();
                                            };
                                            var rewardmoney=Math.floor(rewardmoneytotal*0.5);
                                            if(tempfcodedata.codetype==1&&rewardfcodelist.length==1){
                                                rewardmoney=rewardmoneytotal;
                                            }
                                            rewardmoneytotal=rewardmoneytotal-rewardmoney;
                                            actrewardmoneytotal=actrewardmoneytotal+rewardmoney;
                                            var  rewardincomedetails=new incomeDetails();
                                            rewardincomedetails.userid=tempfcodedata.userid;
                                            rewardincomedetails.usertype=tempfcodedata.usertype;
                                            rewardincomedetails.income=rewardmoney;
                                            rewardincomedetails.type=(isfirst==0)?2:3;  //收入 1 报名奖励  2 邀请奖励  3 下线分红
                                            rewardincomedetails.save(function(err,data){
                                                userfcode.update({"userid":tempfcodedata.userid},
                                                    {$inc: { money: rewardmoney }},function(err,data){}
                                                );
                                                incomedetailsidlist.push(data._id);
                                                if(rewardcount>0&&rewardmoneytotal>1)
                                                {
                                                    iswhilst=true;
                                                }
                                                else {
                                                    iswhilst=false;
                                                }
                                                cb();
                                            });
                                        })

                                    },
                                    function(err) {
                                        var  rewardsurplus=systemincomedata.rewardmoney-actrewardmoneytotal;
                                        console.log(systemincomedata.rewardmoney);
                                        systemIncome.update({"_id":systemincomedata._id},{$set:{rewardstate:2,actualrewardtime:new Date(),
                                                "rewardsurplus":rewardsurplus,"rewardlist":incomedetailsidlist}},
                                            function(err,data){
                                                cb(err,data);
                                            })
                                        console.log('循环发放金钱 ', err);
                                    }
                                );

                            })
                        }

                    }else
                    {
                        console.log(new Date());
                        console.log("没有查到报名 发放的用户");
                        setTimeout(cb, 1000*10);
                    }
                }
            ], function (err, result){
                if (err){
                    console.log("发放报名金额出错"+err);
                }
                setTimeout(cb, 1000*10);
            });

        },
        function(err) {
            console.log('1.1 报名金钱发放err: ', err);
        });

}catch(err){
    console.log("计算金钱错误：");
    console.log(err);
}
