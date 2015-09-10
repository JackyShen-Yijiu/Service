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
// 获取附近的教练
exports.getNearCoach=function(latitude, longitude, radius ,callback){
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
                      return callback("不能找到该申请课程");
                  }
                  // 判断 报的车型与课程里面的课程是否一样
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
        userdata.address= updateinfo.address?rupdateinfo.address:userdata.address;
        userdata.save(function(err,newdata){
            if(err){
                return  callback("保存用户信息出错："+err);
            }
            return callback(null,"success")
        });
    });
}
//更新教练信息
exports.updateCoachServer=function(updateinfo,callback){
    coachmode.findById(new mongodb.ObjectId(updateinfo.coachid),function(err,coachdata){
        if (err||!coachdata){
            return  callback("查询教练出错："+err);
        }
        coachdata.name=updateinfo.name ? updateinfo.name:coachdata.name;
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
        coachdata.carmodel=updateinfo.carmodel ? updateinfo.carmodel:coachdata.carmodel;
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
// ��ʽ���ֻ���
var mobileObfuscator = function(mobile){
    mobile = mobile.substr(0, 3) + "****" + mobile.substr(7, 4);
    return mobile;
};

