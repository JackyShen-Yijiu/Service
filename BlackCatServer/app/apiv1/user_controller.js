var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var    customUserinfo = require('../../custommodel/userinfomodel.js').userInfo;
var userserver=require('../../Server/user_server');


var mobileVerify = /^1\d{10}$/;
// ???????????
exports.fetchCode=function(req,res){
    var mobile = req.params.mobile;

    if (mobile === undefined) {
        //req.log.warn({err: 'no mobile in query string'});
        return; res.status(400).json(
            new BaseReturnInfo(0,"No mobile number",""));
    }
    var number = mobileVerify.exec(mobile);
    if (number != mobile) {
        //req.log.warn({err: 'invalid mobile number'});
        return res.status(400).json(
            new BaseReturnInfo(0,"Bad mobile number","")
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



exports.UserLogin=function(req,res){
    //console.log(req.body);
    var usertype=req.body.usertype;
    var userinfo=new customUserinfo();
    userinfo.mobile=req.body.mobile;
    userinfo.password=req.body.password;
    if (usertype===undefined||userinfo.mobile === undefined||
        userinfo.password === undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",""));
    }
    userserver.userlogin(usertype,userinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
};
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
            new BaseReturnInfo(0,"params is wrong",""));
    }

    userserver.userSignup(usertype,userinfo,function(err,data){
       // console.log('kaishizhce');
        if(err){
            //console.log('error');
            return res.json(new  BaseReturnInfo(0,err,""));
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
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
};
// 获取驾校下面的教练
exports.getSchoolCoach=function(req,res){
    var  coachinfo={
        schoolid:req.params.schoolid,
        index:req.params.index
    }
    //sconsole.log(coachinfo);
    if (coachinfo.schoolid===undefined||coachinfo.index === undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",""));
    };
    userserver.getSchoolCoach(coachinfo,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,""));
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
// 获取教练的学生列表
exports.getStudentList=function(req,res){
    var  coachinfo={
        coachid:req.query.coachid,
        index:req.query.index?req.query.index:1
    }
    if(coachinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.getCoachStudentList(coachinfo,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,""));
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
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });

}
exports.postCoachSetClass=function(req,res){
    var classinfo={
        coachid:req.body.coachid,
        classtypelist:req.body.coachid
    }

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
// 获取可以预约的教练
exports.getUsefulCoachList=function(req,res){
    var  index=req.params.index?req.params.index:1;
    var  useid=req.userId;
    userserver.getUsefulCoachList(useid,index,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
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
            new BaseReturnInfo(0,"params is wrong",""));
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
        carmodel:req.body.carmodel
        };
    if (applyinfo.name===undefined||applyinfo.idcardnumber === undefined||
        applyinfo.telephone === undefined||applyinfo.userid === undefined
        ||applyinfo.schoolid === undefined ||applyinfo.coachid === undefined
        ||applyinfo.carmodel === undefined ||applyinfo.classtypeid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"params is wrong",""));
    };
    if(applyinfo.carmodel.modelsid===undefined){
        applyinfo.carmodel=JSON.parse(applyinfo.carmodel.toString());
       // console.log(applyinfo);
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
    console.log(updateuserinfo);

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
    console.log(updateuserinfo);
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
    var applyinfo={
        coachid: req.body.coachid,
        name : req.body.name,  //姓名
        idcardnumber:req.body.idcardnumber,   // 身份证
        drivinglicensenumber:req.body.drivinglicensenumber, // 驾驶证
        coachnumber :req.body.coachnumber,  // 教练证
        driveschoolid:req.body.driveschoolid, //所在驾校
        referrerCode:req.body.referrerCode  //邀请吗可选
    }
    if (applyinfo.coachid===undefined||applyinfo.name===undefined||applyinfo.idcardnumber===undefined||
        applyinfo.drivinglicensenumber===undefined||applyinfo.coachnumber===undefined||applyinfo.driveschoolid===undefined) {
        return res.json(
            new BaseReturnInfo(0,"params is wrong",""));
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
    }
    if (timeinfo.coachid===undefined|| timeinfo.workweek===undefined|| timeinfo.worktimedesc===undefined||
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
        gender:req.body.gender, //性别
        //email: req.body.email,  // 邮件
        headportrait: req.body.headportrait,
        address: req.body.address, // 地址
        subject :req.body.subject,   //科目
        driveschoolid:req.body.driveschoolid,
        Seniority:req.body.Seniority, //教龄
        passrate:req.body.passrate,  //通过率
        //coursestudentcount:req.body.coursestudentcount, // 可供选择学生数量
        idcardnumber:req.body.idcardnumber,   // 身份证
        drivinglicensenumber:req.body.drivinglicensenumber, // 驾驶证
        coachnumber :req.body.coachnumber,  // 教练证
        //carmodel:req.body.carmodel,      // 车型 c1 c2
        trainfield:req.body.trainfield,  // 训练场
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
    userserver.updateCoachServer(updateuserinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}

//获取用户信息
exports.getUserinfo=function(req,res){
    var apptype=req.params.type;
    var userid=req.params.userid;
    if (apptype===undefined||userid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",""));
    };
    userserver.getUserinfoServer(apptype,userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
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
            return res.json(new BaseReturnInfo(0,err,""));
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
            return res.json(new BaseReturnInfo(0,err,""));
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


