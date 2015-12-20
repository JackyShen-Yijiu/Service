var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var    customUserinfo = require('../../custommodel/userinfomodel.js').userInfo;
var userserver=require('../../Server/user_server');


var mobileVerify = /^1\d{10}$/;
exports.verificationSmscode=function(req,res){
    var mobile = req.query.mobile;
    var code = req.query.code;
    if (mobile === undefined||code===undefined) {
        return res.json(
            new BaseReturnInfo(0,"手机号错误",""));
    }
    var number = mobileVerify.exec(mobile);
    if (number != mobile) {
        return res.status(400).json(
            new BaseReturnInfo(0,"手机号错误","")
        );
    }

    userserver.verificationSmscode(mobile,code,function(err){
        if(err){
            return  res.json(
                new BaseReturnInfo(0,err,""));
        }
        else
        {
            return  res.json(
                new BaseReturnInfo(1,"","send success"));
        }
    });
}
// ???????????
exports.fetchCode=function(req,res){
    var mobile = req.params.mobile;

    if (mobile === undefined) {
        //req.log.warn({err: 'no mobile in query string'});
        return res.json(
            new BaseReturnInfo(0,"手机号错误",""));
    }
    var number = mobileVerify.exec(mobile);
    if (number != mobile) {
        //req.log.warn({err: 'invalid mobile number'});
        return res.status(400).json(
            new BaseReturnInfo(0,"手机号错误","")
        );
    }
    //  console.log("fetchCode mobile:"+mobile)
    userserver.getCodebyMolile(mobile,function(err){
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

// 验证用户是否存在
exports.verifyUserExists=function(req,res){
    var usertype=req.query.usertype;
    var mobile=req.query.mobile;
    if (usertype===undefined||mobile === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",""));
    }
    userserver.verifyUserExists(usertype,mobile,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,0));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
exports.UserLogin=function(req,res){
    //console.log(req.body);
    var usertype=req.body.usertype;
    var userinfo=new customUserinfo();
    userinfo.mobile=req.body.mobile;
    userinfo.password=req.body.password;
    if (usertype===undefined||userinfo.mobile === undefined||
        userinfo.password === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",""));
    }
    userserver.userlogin(usertype,userinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
};
//  用户购买商品
exports.userBuyProduct=function(req,res){
    var  postinfo={
        usertype:req.body.usertype,
        userid:req.body.userid,
        productid:req.body.productid,
        name:req.body.name,
        mobile:req.body.mobile,
        address:req.body.address,
    }
    if (postinfo.usertype === undefined
        ||postinfo.userid === undefined
        ||postinfo.productid === undefined ) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(postinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.userBuyProduct(postinfo,function(err,data,extrainfo){
        if(err){
            return res.json(new  BaseReturnInfo(0,err,{}));
        }
        else{
            return res.json(new BaseReturnInfo(1,"",data,extrainfo));
        }
    })

}
// 获取我的订单历史
exports.getMyorderList=function(req,res){
    var searchinfo={
        userid:req.query.userid,
        index:req.query.index?req.query.index:1,
        count:req.query.count?req.query.count:10
    }
    if (searchinfo.userid===undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    }
    if(searchinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.getMyorderList(searchinfo,function(err,data){
        if(err){
            return res.json(new  BaseReturnInfo(0,err,{}));
        }
        else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    })

}
// 用户注册
exports.postSignUp=function(req,res){
   // console.log(req.body);
    var usertype=req.body.usertype;
    var userinfo=new customUserinfo();
    userinfo.mobile=req.body.mobile;
    userinfo.smscode=req.body.smscode;
    userinfo.password=req.body.password;
    userinfo.referrerCode=req.body.referrerCode;

   // console.log('moblie:'+userinfo.mobile);
    if (usertype===undefined||userinfo.mobile === undefined||
        userinfo.smscode === undefined||userinfo.password === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    }

    userserver.userSignup(usertype,userinfo,function(err,data){
       // console.log('kaishizhce');
        if(err){
            //console.log('error');
            return res.json(new  BaseReturnInfo(0,err,{}));
        }
        else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });



};

//附近的教练
exports.getNearbyCoach=function(req,res){
    //console.log(req);
    var latitude = parseFloat(req.query.latitude);
    var longitude = parseFloat(req.query.longitude);
    var radius = req.query.radius ? parseInt(req.query.radius) : 1000;
    userserver.getNearCoach(latitude,longitude,radius,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,[]));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
};
// 获取驾校下面的教练
exports.getSchoolCoach=function(req,res){
    var  coachinfo={
        schoolid:req.params.schoolid,
        index:req.params.index,
        name:req.query.name
    }
    //sconsole.log(coachinfo);
    if (coachinfo.schoolid===undefined||coachinfo.index === undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",""));
    };
    userserver.getSchoolCoach(coachinfo,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,[]));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
}

exports.postApplyExamination=function(req,res){
    var userid =req.userId;
    userserver.applyExamintion(userid,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
}

//  教练查看学生详情页
exports.getStudentInfo=function(req,res){
    var userid=req.query.userid;
    if(userid===undefined){
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    }
    userserver.getStudentInfo(userid,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,{}));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });

}
// 获取教练的学生列表
exports.getStudentList=function(req,res){
    var  coachinfo={
        coachid:req.query.coachid,
        index:req.query.index?req.query.index:1
    }
    if(coachinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    userserver.getCoachStudentList(coachinfo,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,[]));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
}
// 获取教练所选班型信息
exports.getCoachClassType=function(req,res){
    var userid=req.userId;
    userserver.getCoachClassInfo(userid,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,[]));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });

}
exports.postCoachSetClass=function(req,res){
    var classinfo={
        coachid:req.body.coachid,
        classtypelist:req.body.classtypelist
    }
    //console.log(req.body)
    if (classinfo.coachid === undefined
        ||classinfo.classtypelist === undefined ) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(classinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.setCoachClassInfo(classinfo,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });

}
// 获取我的报名结果
 exports.getapplyschoolinfo=function(req,res){
     var userid =req.query.userid;
     if(userid===undefined){
         return res.json(
             new BaseReturnInfo(0,"参数不完整",""));
     }
     if(userid!=req.userId){
         return res.json(
             new BaseReturnInfo(0,"无法确认请求用户",""));
     };
     userserver.getapplyschoolinfo(userid,function(err,data){
         if(err){
             return res.json(new BaseReturnInfo(0,err,{}));
         }
         return res.json(new BaseReturnInfo(1,"",data));
     });
 }


//获取我的学车进度
exports.getMyProgress=function(req,res){
var userid =req.query.userid;
if(userid===undefined){
    return res.json(
        new BaseReturnInfo(0,"参数不完整",""));
}
if(userid!=req.userId){
    return res.json(
        new BaseReturnInfo(0,"无法确认请求用户",""));
};
userserver.getMyProgress(userid,function(err,data){
    if(err){
        return res.json(new BaseReturnInfo(0,err,{}));
    }
    return res.json(new BaseReturnInfo(1,"",data));
});
}

// 获取可以预约的教练
exports.getUsefulCoachList=function(req,res){
    var  index=req.params.index?req.params.index:1;
    var  useid=req.userId;
    userserver.getUsefulCoachList(useid,index,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,[]));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
}
// 用户获取我的报名状态
exports.getMyApplyState=function(req,res){
    var userid =req.query.userid;
    if(userid===undefined){
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    }
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.getMyApplyState(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 用户报考验证v2
exports.postenrollverificationv2=function(req,res){
    var applyinfo= {
        name : req.body.name,
        telephone : req.body.telephone,
        code:req.body.code,
        userid:req.body.userid,
        schoolid:req.body.schoolid,
        coachid:req.body.coachid,
        classtypeid:req.body.classtypeid,
        carmodel:req.body.carmodel,
        subjectid:req.body.subjectid
    };
    if (applyinfo.name===undefined||applyinfo.code === undefined||
        applyinfo.telephone === undefined||applyinfo.userid === undefined
        ||applyinfo.schoolid === undefined ||applyinfo.coachid === undefined
        ||applyinfo.carmodel === undefined ||applyinfo.subjectid === undefined
        ||applyinfo.classtypeid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(applyinfo.carmodel.modelsid===undefined){
        applyinfo.carmodel=JSON.parse(applyinfo.carmodel.toString());
    }
    if(applyinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.postenrollverificationv2(applyinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}


// 用户报考验证
exports.postenrollverification=function(req,res){
    var applyinfo= {
        name : req.body.name,
        idcardnumber : req.body.idcardnumber,
        telephone : req.body.telephone,
        address : req.body.address,
        userid:req.body.userid,
        schoolid:req.body.schoolid,
        ticketnumber:req.body.ticketnumber,
        studentid:req.body.studentid
    };
    if (applyinfo.name===undefined||applyinfo.idcardnumber === undefined||
        applyinfo.telephone === undefined||applyinfo.userid === undefined
        ||applyinfo.schoolid === undefined||applyinfo.ticketnumber === undefined || applyinfo.studentid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(applyinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.enrollverification(applyinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
//用户报名
exports.postapplySchool=function(req,res){
    console.log(req.body);
    var applyinfo= {
         name : req.body.name,
     idcardnumber : req.body.idcardnumber,
     telephone : req.body.telephone,
     address : req.body.address,
    userid:req.body.userid,
        schoolid:req.body.schoolid,
        coachid:req.body.coachid,
        classtypeid:req.body.classtypeid,
        userpic:req.body.userpic,
        carmodel:req.body.carmodel,
        applyagain:req.body.applyagain?req.body.applyagain:0
        };
    if (applyinfo.name===undefined||applyinfo.idcardnumber === undefined||
        applyinfo.telephone === undefined||applyinfo.userid === undefined
        ||applyinfo.schoolid === undefined ||applyinfo.coachid === undefined
        ||applyinfo.carmodel === undefined ||applyinfo.classtypeid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(applyinfo.carmodel.modelsid===undefined){
        applyinfo.carmodel=JSON.parse(applyinfo.carmodel.toString());
       // console.log(applyinfo);
    }
    if(applyinfo.userpic!=undefined &&applyinfo.userpic.length>0){
        applyinfo.userpic=JSON.parse(applyinfo.userpic);
        //console.log(updateuserinfo);
    }
    //console.log(" user apply body:"+req.body.carmodel.modelsid);
    //sconsole.log(" applyinfo:"+applyinfo.carmodel.modelsid);
    if(applyinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.applyschoolinfo(applyinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });


};

// 更新用户信息
exports.updateUserInfo=function(req,res){
    console.log(req.body);
   var updateuserinfo ={
       userid: req.body.userid,
       name : req.body.name,
       nickname: req.body.nickname,
       email: req.body.email,
       headportrait: req.body.headportrait,
       address: req.body.address,
       gender:req.body.gender,
       signature:req.body.signature
   }
    //console.log(updateuserinfo);

    if (updateuserinfo.userid===undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",""));
    };
    if(updateuserinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    if(updateuserinfo.headportrait!=undefined &&updateuserinfo.headportrait.length>0){
    updateuserinfo.headportrait=JSON.parse(updateuserinfo.headportrait);
    //console.log(updateuserinfo);
    }
    userserver.updateUserServer(updateuserinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

//教练申请验证
exports.coachApplyVerification=function(req,res){
    //console.log(req.body)
    var applyinfo={
        coachid: req.body.coachid,
        name : req.body.name,  //姓名
        idcardnumber:req.body.idcardnumber,   // 身份证
        drivinglicensenumber:req.body.drivinglicensenumber, // 驾驶证
        coachnumber :req.body.coachnumber,  // 教练证
        driveschoolid:req.body.driveschoolid, //所在驾校
        referrerCode:req.body.referrerCode  //邀请吗可选
    }
    //console.log(applyinfo)
    if (applyinfo.coachid===undefined||applyinfo.name===undefined||applyinfo.idcardnumber===undefined||
        applyinfo.drivinglicensenumber===undefined||applyinfo.coachnumber===undefined||applyinfo.driveschoolid===undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",""));
    };
    if(applyinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.applyVerification(applyinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 教练设置工作时间
exports.coachSetWorkTime=function(req,res){
    var timeinfo={
        coachid: req.body.coachid,
        workweek:req.body.workweek,
        worktimedesc:req.body.worktimedesc,
        begintimeint:req.body.begintimeint,
        endtimeint:req.body.endtimeint,
    };
    if (timeinfo.coachid===undefined|| timeinfo.workweek===undefined||
        timeinfo.begintimeint===undefined||timeinfo.endtimeint===undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完成",""));
    };

    if(timeinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    if(!timeinfo.workweek||timeinfo.workweek.length<=0){
        return res.json(
            new BaseReturnInfo(0,"星期不能为空",""));
    }
    userserver.coachSetWorkTime(timeinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// J教练学员同步个人设置
exports.postPersonalSetting=function(req,res){
    var settinginfo={
        userid:req.body.userid,
        usertype:req.body.usertype,
        reservationreminder:req.body.reservationreminder?req.body.reservationreminder:0,
        newmessagereminder:req.body.newmessagereminder?req.body.newmessagereminder:0,
        classremind:req.body.classremind?req.body.classremind:0
    }
    if (settinginfo.usertype===undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",""));
    };
    if(settinginfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.personalSetting(settinginfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}
//更新教练的基本信息
exports.updateCoachInfo=function(req,res){
    //console.log(req.body);
    var updateuserinfo ={
        coachid: req.body.coachid,
        name : req.body.name,  //姓名
        introduction: req.body.introduction, // 简介
        gender:req.body.Gender, //性别
        //email: req.body.email,  // 邮件
        headportrait:req.body.headportrait,
        address: req.body.address, // 地址
        subject :req.body.subject,   //科目
        driveschoolid:req.body.driveschoolinfo,
        Seniority:req.body.Seniority, //教龄
        passrate:req.body.passrate,  //通过率
        //coursestudentcount:req.body.coursestudentcount, // 可供选择学生数量
        idcardnumber:req.body.idcardnumber,   // 身份证
        drivinglicensenumber:req.body.drivinglicensenumber, // 驾驶证
        coachnumber :req.body.coachnumber,  // 教练证
        //carmodel:req.body.carmodel,      // 车型 c1 c2
        trainfield:req.body.trainfieldlinfo,  // 训练场
        //is_shuttle:req.body.is_shuttle,  // 是否接送
        platenumber:req.body.platenumber, // 车牌号
        //shuttlemsg:req.body.shuttlemsg  // 车送说明
    }
    if (updateuserinfo.coachid===undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",""));
    };
    if(updateuserinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    if(updateuserinfo.driveschoolid!=undefined && updateuserinfo.driveschoolid.id!=undefined){
        updateuserinfo.driveschoolid=updateuserinfo.driveschoolid.id;
        //console.log(updateuserinfo.driveschoolid);
    }
    else{
        updateuserinfo.driveschoolid=undefined;
    }
    if(updateuserinfo.trainfield!=undefined && updateuserinfo.trainfield.id!=undefined){
        updateuserinfo.trainfield=updateuserinfo.trainfield.id;
        console.log(updateuserinfo.trainfield);
    }
    else{
        updateuserinfo.trainfield=undefined;
    }
    userserver.updateCoachServer(updateuserinfo,function(err,data,subject){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        var returninfo=new BaseReturnInfo(1,"",data);
        returninfo.subject=subject;
        //console.log(returninfo);
        return res.json(returninfo);
    });
}
// 教练登录后获取自己的详细信息 (返回数据和教练登录一样)
exports.getCoachinfo=function(req,res){
var userid=req.query.userid;
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",{}));
    };
    userserver.getCoachinfoServer(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })

}
//获取用户信息
exports.getUserinfo=function(req,res){
    var apptype=req.params.type;
    var userid=req.params.userid;
    if (apptype===undefined||userid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",{}));
    };
    userserver.getUserinfoServer(apptype,userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })

}
// 用户修改密码
exports.updatePassword=function(req,res){
  var  pwdinfo={
      password:req.body.password,
      smscode:req.body.smscode,
      mobile:req.body.mobile,
      usertype:req.body.usertype
  }
    if (pwdinfo.mobile===undefined||pwdinfo.password===undefined||pwdinfo.smscode===undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",""));
    }

  userserver.updatePassword(pwdinfo,function(err,data){
      if(err){
          return res.json(new BaseReturnInfo(0,err,""));
      }
      return res.json(new BaseReturnInfo(1,"",data));
  })

}
// 修改用户手机号
exports.updateMobile=function(req,res){
    var  mobileinfo={
        mobile:req.body.mobile,
        smscode:req.body.smscode,
        userid:req.userId,
        usertype:req.body.usertype
    }
    if (mobileinfo.userid===undefined||mobileinfo.mobile===undefined||mobileinfo.smscode===undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",""));
    };
    userserver.updateMobile(mobileinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })

}
// 获取用户喜欢的驾校
exports.getMyFavoritSchool=function(req,res){
    userserver.FavoritSchoolList(req.userId,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
// 添加用户喜欢的驾校
exports.putFavorSchool=function(req,res){
    var userid = req.userId;
    var shoolid = req.params.id;
    userserver.addFavoritSchool(userid,shoolid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(0,"",data));
    });
}

// 删除用户喜欢的驾校
exports.delFavorrSchool=function(req,res){
    var userid = req.userId;
    var shoolid = req.params.id;
    userserver.delFavoritSchool(userid,shoolid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}
//获取用户喜歡的的教练
exports.getMyFavoritCoach=function(req,res){
    userserver.FavoritCoachList(req.userId,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}

//添加用户的喜欢的教练
exports.putFavorCoach=function(req,res){
    var userid = req.userId;
    var coachid = req.params.id;
    userserver.addFavoritCoach(userid,coachid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}
// 删除用户喜欢的教练
exports.delFavorrCoach=function(req,res){
    var userid = req.userId;
    var coachid = req.params.id;
    userserver.delFavoritCoach(userid,coachid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

}

//  获取我的钱包
exports.getMyWallet=function(req,res){
    var  queryinfo={
        seqindex:req.query.seqindex?req.query.seqindex:0,
        count:req.query.count?req.query.count:10,
        userid:req.query.userid,
        usertype:req.query.usertype
    }
    if (queryinfo.userid===undefined||queryinfo.usertype===undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",""));
    };
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",{}));
    };
    userserver.getMyWallet(queryinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}


