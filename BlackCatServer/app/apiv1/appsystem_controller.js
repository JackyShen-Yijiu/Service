/**
 * Created by metis on 2015-08-31.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var mongodb = require('../../models/mongodb.js');
var commondataServer=require('../../Config/commondata');
var qiniu=require("../../Common/qiniuUnit");
var  Apperversion= mongodb.AppVersionModel;
var sysstemserver=require('../../Server/systemdata_server');
var qr=require("qr-image");
/**
 * 测试api 调用方法
 **/
exports.TestAPI = function (req, res) {

    return  res.json(
        new BaseReturnInfo(1,"","hello, BlackCat v1d"))

};
exports.createQrcode =function(req,res){
    var text = req.query.text;
    var sizedata=Number(req.query.size?req.query.size:10);
    try {
        var img = qr.image(text,{size :sizedata});
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, {'Content-Type': 'text/html'});
        res.end('NOT Found');
    }
}
/*
 获取app的版本信息
 */

exports.appVersion=function(req,res){
    var apptype=req.params.type;
    if (apptype>4||apptype<1||apptype === undefined)
    {
        return res.status(500).send(new BaseReturnInfo(0,"请求参数错误",""));
    }
   /*  var appverison =new Apperversion();
     appverison.name="andorid 用户端";
     appverison.apptype=1;
     appverison.versionCode='v1.0';
     appverison.updateMessage="更新信息";
     appverison.downloadUrl="www.baidu.com";
     appverison.updateTime=Date().toLocaleString();

     appverison.save(function(err, data) {
     if (err) {
     console.log("save appverison err"+err);
     }
     else
     {
     console.log("save appverison  sucess");
     }
     });*/
    Apperversion.getVersionInfo(apptype, function(err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err,[] ));
        }
        //console.log(data);
        return res.json(
            new BaseReturnInfo(1,"",data)
        );
    })
};

//获取科目
exports.GetSubject=function(req,res){
    var subject=commondataServer.subject;
    var subject=[{
        subjectid:1,
        name:'科目一'

    },
        {
            subjectid:2,
            name:'科目二'

        },
        {
            subjectid:3,
            name:'科目三'

        }
        ,
        {
            subjectid:4,
            name:'科目四'

        }];
    return res.json( new BaseReturnInfo(1,'',subject));
}
exports.GetCarModel=function(req,res){
    var carmodels=commondataServer.carmodels;
    return res.json(new BaseReturnInfo(1,'',carmodels));
}

exports.GetWorkTimes=function(req,res){
    var worktimes=commondataServer.worktimes;
    return res.json(new BaseReturnInfo(1,'',worktimes));
};
exports.GetqiniuupToken=function(req,res){
    var token =qiniu.getQiniuUpToken();
    return res.json(new BaseReturnInfo(1,'',token));
}
exports.GetqiniuupToken2=function(req,res){
    var token =qiniu.getQiniuUpToken();
    res.json({
        uptoken: token
    })
}
exports.getExamQuestion=function (req,res){
   return res.json(new BaseReturnInfo(1,"",commondataServer.examquestioninfo))
}
//  获取科目一-科目四的课件信息
exports.getCourseWare=function (req,res){
    var  queryinfo={
        subjectid:req.query.subjectid?req.query.subjectid:0,
        seqindex:req.query.seqindex?req.query.seqindex:0,
        count:req.query.seqindex?req.query.count:10,
    }
    sysstemserver.getCourseWare( queryinfo,function(err ,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
// 获取商城列表
exports.getMallProductList=function(req,res){
    var seachinfo={
        index:req.query.index?req.query.index:1,
        count:req.query.count?req.query.count:10,
        producttype:req.query.producttype?req.query.producttype:0,  // 0 实体商品  1 虚拟商品
        cityname:req.query.cityname?req.query.cityname:""
    };
    console.log(seachinfo);
    seachinfo.producttype=Boolean( parseInt(seachinfo.producttype));
    console.log(seachinfo);
    sysstemserver.getMallProduct(seachinfo,function(err ,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
// 获取商品详情
exports.getProductDetail=function(req,res){
   var  productid= req.query.productid;
    if (productid===undefined){
        return   res.json(new BaseReturnInfo(0,"参数错误",{}));
    }
    sysstemserver.getProductDetail(productid,function(err ,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })

}
//  获取活动信息
exports.getActivity=function(req,res){
    var cityname=req.query.cityname;
    return res.json(new BaseReturnInfo(0,"",[]));
    //sysstemserver.getActivity(cityname,function(err ,data){
    //    if(err){
    //        return res.json(new BaseReturnInfo(0,err,[]));
    //    }
    //    return res.json(new BaseReturnInfo(1,"",data));
    //})

}
//  获取开通城市列表
exports.getOpenCitylist=function(req,res){
    // 查询类型0 全部开放城市  1 热门城市
    var searchtype=req.query.searchtype?req.query.searchtype:0;
    sysstemserver.getOpenCitylist(searchtype,function(err ,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })

};
exports.getChildOpenCitylist=function(req,res){
    var cityid=req.query.cityid?req.query.cityid:1;
    sysstemserver.getChildOpenCitylist(cityid,function(err ,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
// 获取该地区的显示方式
exports.getlocationShowType=function(req,res){
    var cityname=req.query.cityname;
    sysstemserver.locationShowType(cityname,function(err ,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}


exports.getTrainingContent=function(req,res){
    //getTrainingContent
}
exports.getTrainingContent=function (req,res){
    return res.json(new BaseReturnInfo(1,"",commondataServer.trainingcontent));
}
// 获取app 头条信息
exports.getHeadLineNews=function (req,res){
    sysstemserver.getHeadLineNews(function(err ,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
exports.getUserConsult=function(req,res){
    var index=req.query.index?req.query.index:1;
    console.log(index);
    sysstemserver.getUserConsult(index,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
// 保存用户咨询信息
exports.postUserConsult=function(req,res){
    var   userinfo={
        name:req.body.name,
        mobile:req.body.mobile,
        licensetype:req.body.licensetype,
        content:req.body.content,
        userid:req.body.userid
    };
    //console.log(userinfo);
    sysstemserver.saveUserConsult(userinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
// 保存用户咨询
exports.postuserconsult=function(req,res){
    consultinfo={
        userid:req.body.userid,
        content:req.body.content
    }
    sysstemserver.postuserconsult(consultinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
// 保存用户反馈信息
exports.postUserFeedBack=function(req,res){
    var  feedbackinfo={
        userid:req.body.userid,
        appversion:req.body.appversion,
        feedbackmessage:req.body.feedbackmessage,
        mobileversion:req.body.mobileversion,
        network:req.body.network,
        resolution:req.body.network,
        feedbacktype:req.body.feedbacktype?req.body.feedbacktype:0,  // 反馈类型  0 平台反馈 1 投诉教练 2  投诉驾校
        name:req.body.name?req.body.name:"" ,
        feedbackusertype:req.body.feedbackusertype?req.body.feedbackusertype:1,  //投诉类型  0 匿名投诉 1 实名投诉
        moblie:req.body.moblie?req.body.moblie:"", // 投诉人手机号
        becomplainedname:req.body.becomplainedname?req.body.becomplainedname:"",  //被投诉姓名
        coachid:req.body.coachid,  //投诉教练的id
        schoolid:req.body.schoolid?req.body.schoolid:"",  // 投诉驾校id
        piclist:req.body.piclist?req.body.piclist:""  // 图片列表
    }
    //console.log(feedbackinfo);

    sysstemserver.saveFeedback(feedbackinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })

};
// 获取用户投诉
exports.getmycomplaintv2=function(req,res){
    var queryinfo= {
        userid:req.query.userid,
    };
    if (queryinfo.userid === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数不完整",[]));
    };
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    sysstemserver.getcomplaintlist(queryinfo,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
exports.getmessagecount=function(req,res){
    var searchinfo={
        coachid:req.query.coachid,
        lastmessage:req.query.lastmessage?req.query.lastmessage:0,
        lastnews:req.query.lastnews?req.query.lastnews:0
    }
    sysstemserver.getmessagecount(searchinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}

// 验证活动优惠卷是否正确
exports.verifyactivitycoupon=function(req,res){
   var  mobile=req.query.mobile;
    var couponcode=req.query.couponcode;
    if (mobile===undefined||couponcode===undefined){
        return   res.json(new BaseReturnInfo(0,"参数错误",{}));
    };
    sysstemserver.getverifyactivitycoupon(mobile,couponcode,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}