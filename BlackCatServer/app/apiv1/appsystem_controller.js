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
    sysstemserver.getMallProduct(function(err ,data){
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

//  获取开通城市列表
exports.getOpenCitylist=function(req,res){
    sysstemserver.getOpenCitylist(function(err ,data){
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
// 保存用户反馈信息
exports.postUserFeedBack=function(req,res){
    var  feedbackinfo={
        userid:req.body.userid,
        appversion:req.body.appversion,
        feedbackmessage:req.body.feedbackmessage,
        mobileversion:req.body.mobileversion,
        network:req.body.network,
        resolution:req.body.network
    }
    //console.log(feedbackinfo);

    sysstemserver.saveFeedback(feedbackinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })

}