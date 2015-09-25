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
            return res.status(400).json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(0,"",data));
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

    console.log('moblie:'+userinfo.mobile);
    if (usertype===undefined||userinfo.mobile === undefined||
        userinfo.smscode === undefined||userinfo.password === undefined) {
        return res.json(
            new BaseReturnInfo(0,"params is wrong",""));
    }

    userserver.userSignup(usertype,userinfo,function(err,data){
       // console.log('kaishizhce');
        if(err){
            console.log('error');
            return res.json(new  BaseReturnInfo(0,err,""));
        }
        else{
            return res.json(new BaseReturnInfo(0,"",data));
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

exports.postapplySchool=function(req,res){
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
            new BaseReturnInfo(0,"parms is wrong",""));
    };
    if(applyinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.applyschoolinfo(applyinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(0,"",data));
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
   }
    if (updateuserinfo.userid===undefined) {
        return res.json(
            new BaseReturnInfo(0,"parms is wrong",""));
    };
    if(updateuserinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.updateUserServer(updateuserinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(0,"",data));
    });
}

//更新教练的基本信息
exports.updateCoachInfo=function(req,res){
    //console.log(req.body);
    var updateuserinfo ={
        coachid: req.body.coachid,
        name : req.body.name,
        introduction: req.body.introduction,
        email: req.body.email,
        headportrait: req.body.headportrait,
        address: req.body.address,
        subject :req.body.subject,
        driveschoolid:req.body.driveschoolid,
        Seniority:req.body.Seniority, //教龄
        passrate:req.body.passrate,
        worktime:req.body.worktime,
        coursestudentcount:req.body.coursestudentcount,
        idcardnumber:req.body.idcardnumber,
        drivinglicensenumber:req.body.drivinglicensenumber,
        carmodel:req.body.carmodel,
        trainfield:req.body.trainfield,
        is_shuttle:req.body.is_shuttle
    }
    if (updateuserinfo.coachid===undefined) {
        return res.json(
            new BaseReturnInfo(0,"params is wrong",""));
    };
    if(updateuserinfo.coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    userserver.updateCoachServer(updateuserinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(0,"",data));
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
        return res.json(new BaseReturnInfo(0,"",data));
    })

}


