/**
 * Created by metis on 2015-08-31.
 */
var smscodemodule=require('../Common/sendsmscode').sendsmscode;
var mongodb = require('../models/mongodb.js');
var geolib = require('geolib');
var smsVerifyCodeModel = mongodb.SmsVerifyCodeModel;
var jwt = require('jsonwebtoken');
var userTypeEmun=require("../custommodel/emunapptype").UserType;
var resbaseuserinfomodel=require("../custommodel/returnuserinfo").resBaseUserInfo;
var resbasecoachinfomode=require("../custommodel/returncoachinfo").resBaseCoachInfo;
var appTypeEmun=require("../custommodel/emunapptype");
var secretParam= require('./jwt-secret').secretParam;
var resendTimeout = 60;
var usermodel=mongodb.UserModel;
var coachmode=mongodb.CoachModel;
var userCountModel=mongodb.UserCountModel;
var schoolModel=mongodb.DriveSchoolModel;
var classtypeModel=mongodb.ClassTypeModel;
var trainfieldModel=mongodb.TrainingFieldModel;

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
                console.log(now-instace.createdTime);
                if ((now-instace.createdTime)<resendTimeout*1000){
                    return callback("Wait a moment to send again");
                }
                else{
                    instace.remove(function(err){
                        if(err){
                            return callback("Error occured while removing: " + err,"");
                        }
                        smscodemodule(mobilenumber,function(err,response){
                           // console.log('���óɹ�');
                            return  sendSmsResponse(err,response,callback);
                        });
                    });
                }

            }
            else{
                // now send
                smscodemodule(mobilenumber, function(error, response){
                 return   sendSmsResponse( error, response,callback);
                });
            }


        }
    );
};
// 用户登录
exports.userlogin= function(usertype,userinfo,callback){
    if (usertype==userTypeEmun.User) {
        usermodel.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
          if (err)
          {
           return callback ("error in find user:"+ err);
          } else
          {
              if(!userinstace){
                  return callback("cannot find user ");
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
                           return callback(null,returnmodel);

                       });
                  }
                  else{
                      return callback("password is wrong");
                  }
                      }

          }
        });
    }else if(usertype==userTypeEmun.Coach)
    {
        coachmode.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
            if (err)
            {
                return callback ("error in find coach user:"+ err);
            } else
            {
                if(!userinstace){
                    return callback("cannot find user ");
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
                            returnmodel.coachid =newinstace._id;
                            return callback(null,returnmodel);

                        });
                    }
                    else{
                        return callback("password is wrong");
                    }
                }

            }
        });
    }else{
        return callback("error in userrole");
    }
};
exports.userSignup=function(usertype,userinfo,callback){
    //console.log("�����֤��");
    checkSmsCode(userinfo.mobile,userinfo.smscode,function(err){
        if(err){
            return  callback(err);

        }
        if (usertype==userTypeEmun.User) {
            usermodel.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
                if (err) {
                    return callback( "find user err:" + err);
                }
                if (userinstace) {
                    return callback( "User already exists");

                } else {
                    var newuser = new usermodel();
                    newuser.mobile = userinfo.mobile;
                    newuser.create = new Date();
                    newuser.referrerCode=userinfo.referrerCode;
                    newuser.password= userinfo.password;
                    newuser.loc.coordinates=[newuser.longitude,newuser.latitude];
                    getUserCount(function(err,usercoutinfo){
                        if (err){
                            return callback( " error in get userid :"+err);
                        }
                        newuser.displayuserid=usercoutinfo.value.displayid;
                        newuser.invitationcode=usercoutinfo.value.invitationcode;
                        newuser.save(function (err, newinstace) {
                            if (err) {
                                return callback("save user error");
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
                            return callback(null,returnmodel);

                        });

                    });

                }
            })
        }else if(usertype==userTypeEmun.Coach){

            coachmode.findOne({mobile: userinfo.mobile}, function (err, coachuserinstace) {
                if (err) {
                    return callback( "find coach user err:" + err);
                }
                if (coachuserinstace) {
                    return callback( "User already exists");

                } else {
                    var newuser = new coachmode();
                    newuser.mobile = userinfo.mobile;
                    newuser.create = new Date();
                    newuser.referrerCode=userinfo.referrerCode;
                    newuser.password= userinfo.password;
                    newuser.loc.coordinates=[newuser.longitude,newuser.latitude];
                    getUserCount(function(err,usercoutinfo){
                        if (err){
                            return callback( " error in get coach userid :"+err);
                        }
                        newuser.displaycoachid=usercoutinfo.value.displayid;
                        newuser.invitationcode=usercoutinfo.value.invitationcode;
                        newuser.save(function (err, newinstace) {
                            if (err) {
                                return callback("save user error"+err);
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
        if (pwdinfo.usertype===undefined){
            pwdinfo.usertype=appTypeEmun.UserType.User;
        }
        if (pwdinfo.usertype==appTypeEmun.UserType.User) {
            usermodel.update({_id: new mongodb.ObjectId(mobileinfo.userid)}, {$set: {mobile: mobileinfo.mobile}}, function (err) {
                if (err) {
                    return callback("更新手机号出错：" + err)
                }
                return callback(null, "success");
            })
        }else if( pwdinfo.usertype==appTypeEmun.UserType.Coach)
        {
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
             return callback("验证码出错：" + err);

         }
         userdata.password=pwdinfo.password;
         userdata.save(function(err,newdata){
             if(err){
                 return  callback("保存用户信息出错："+err);
             }
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
                    return callback("验证码出错：" + err);
                }
                userdata.password=pwdinfo.password;
                userdata.save(function(err,newdata){
                    if(err){
                        return  callback("保存用户信息出错："+err);
                    }
                    return callback(null,"success")
                });
            });
        });
    }
}
// 获取附近的教练
exports.getNearCoach=function(latitude, longitude, radius,callback){
    coachmode.getNearCoach(latitude, longitude, radius ,function(err ,coachlist){
        if (err || !coachlist || coachlist.length == 0) {
            console.log(err);
            callback("get coach list failed"+err);

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
                        longitude: r.longitude

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
    coachmode.find({"driveschool":new mongodb.ObjectId(coachinfo.schoolid)})
        .where("is_lock").equals("false")
        .where("is_validation").equals("true")
        .skip((coachinfo.index-1)*10)
        .limit(10)
        .exec(function(err ,coachlist){
        if (err || !coachlist ) {
            console.log(err);
            callback("get coach list failed"+err);

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
                        longitude: r.longitude

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
            userdata.examquestioninfo.subjecttwo.applystate=appTypeEmun.ExamintionSatte.applying;
            userdata.examquestioninfo.subjecttwo.applydate=new Date();
        }else if(userdata.subject.subjectid==3){

            if (userdata.subjectthree.finishcourse+userdata.subjectthree.reservation<userdata.subjectthree.totalcourse){
                return callback("您的学时不够，无法报考");
            }
            userdata.examquestioninfo.subjectthree.applystate=appTypeEmun.ExamintionSatte.applying;
            userdata.examquestioninfo.subjectthree.applydate=new Date();
        }
        userdata.save(function(err){
            if (err){
                return callback("保存报考信息出错："+err);
            }
            return callback(null,"success");
        })
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
            return callback(null,data);
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
        if(user.subject.subjectid!=2&&userdata.subject.subjectid!=3){
            return  callback("该用户现阶段不能预约课程:"+userdata.subject.name);
        }
        coachmode.find({is_lock:false,is_validation:true,
            driveschool:new mongodb.ObjectId(user.applyschool),
            "carmodel.modelsid":user.carmodel.modelsid,
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
                                longitude: r.longitude

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
                        longitude: r.longitude

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
              classtypeModel.findById(new mongodb.ObjectId(applyinfo.classtypeid),function(err,classtypedata){
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
           /* schoolModel.findById(new mongodb.ObjectId(applyinfo.driveschoolid),function(err,schooldata){
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

            })*/
            coachdata.save(function(err,data){
                if(err)
                {
                    return callback("保存教练信息出错："+err);
                }
                return callback(null,"success");
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
//更新教练信息
exports.updateCoachServer=function(updateinfo,callback){
    coachmode.findById(new mongodb.ObjectId(updateinfo.coachid),function(err,coachdata){
        if (err||!coachdata){
            return  callback("查询教练出错："+err);
        }
        coachdata.name=updateinfo.name ? updateinfo.name:coachdata.name;
        coachdata.Gender=updateinfo.gender ? updateinfo.gender:coachdata.Gender;
        coachdata.introduction=updateinfo.introduction ? updateinfo.introduction:coachdata.introduction;
        coachdata.email=updateinfo.email ? updateinfo.email:coachdata.email;
        coachdata.headportrait=updateinfo.headportrait ? updateinfo.headportrait:coachdata.headportrait;
        coachdata.address=updateinfo.address ? updateinfo.address:coachdata.address;
        coachdata.subject=updateinfo.subject ? updateinfo.subject:coachdata.subject;
        coachdata.Seniority=updateinfo.Seniority ? updateinfo.Seniority:coachdata.Seniority;
        coachdata.passrate=updateinfo.passrate ? updateinfo.passrate:coachdata.passrate;
        coachdata.worktime=updateinfo.worktime ? updateinfo.worktime:coachdata.worktime;
        coachdata.coursestudentcount=updateinfo.coursestudentcount ? updateinfo.coursestudentcount:coachdata.coursestudentcount;
        coachdata.idcardnumber=updateinfo.idcardnumber ? updateinfo.idcardnumber:coachdata.idcardnumber;
        coachdata.drivinglicensenumber=updateinfo.drivinglicensenumber ? updateinfo.drivinglicensenumber:coachdata.drivinglicensenumber;
        coachdata.coachnumber=updateinfo.coachnumber ? updateinfo.coachnumber:coachdata.coachnumber;
        coachdata.carmodel=updateinfo.carmodel ? updateinfo.carmodel:coachdata.carmodel;
        coachdata.platenumber=updateinfo.platenumber ? updateinfo.platenumber:coachdata.platenumber;
        coachdata.shuttlemsg=updateinfo.shuttlemsg ? updateinfo.shuttlemsg:coachdata.shuttlemsg;
        coachdata.is_shuttle=updateinfo.is_shuttle ? (updateinfo.carmodel==0? false:true) :coachdata.carmodel;
        if (updateinfo.driveschoolid){
            schoolModel.findById(new mongodb.ObjectId(updateinfo.driveschoolid),function(err,schooldata){
                if(err||!schooldata){
                    return callback("查询驾校出错："+err);
                }
                coachdata.driveschool=new mongodb.ObjectId(updateinfo.driveschoolid);
                coachdata.driveschoolinfo.id=updateinfo.driveschoolid;
                coachdata.driveschoolinfo.name=schooldata.name;
                coachdata.save(function(err,data){
                    if(err)
                    {
                        return callback("保存教练信息出错："+err);
                    }
                    return callback(null,"success");
                })

            })
        } else if (updateinfo.trainfield){
            trainfieldModel.findById(new mongodb.ObjectId(updateinfo.trainfield),function(err,trainfielddata){
              if(err||!trainfielddata){
                   return callback("查询训练场："+err);
              }
                coachdata.trainfield =new mongodb.ObjectId(updateinfo.trainfield);
                coachdata.trainfieldlinfo.id=updateinfo.trainfield;
                coachdata.trainfieldlinfo.name=trainfielddata.fieldname;
                coachdata.latitude=trainfielddata.latitude;
                coachdata.longitude=trainfielddata.longitude;
                coachdata.loc.coordinates=[trainfielddata.longitude,trainfielddata.latitude];
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
        console.log(instace);
        var  now=new Date();
        /*console.log(now);
        console.log(instace.createdTime);
        console.log(now-instace.createdTime);*/
        if ((now-instace.createdTime)>timeout*1000){
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
// ��ʽ���ֻ���
var mobileObfuscator = function(mobile){
    mobile = mobile.substr(0, 3) + "****" + mobile.substr(7, 4);
    return mobile;
};

