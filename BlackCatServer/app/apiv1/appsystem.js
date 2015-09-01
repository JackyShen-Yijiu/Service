/**
 * Created by metis on 2015-08-31.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var mongodb = require('../../models/mongodb.js');
var commondataServer=require('../../Config/commondata')
var  Apperversion= mongodb.AppVersionModel;
/**
 * 测试api 调用方法
 **/
exports.TestAPI = function (req, res) {
    return  res.json(
        new BaseReturnInfo(1,"","hello, BlackCate"))

};
/*
 获取app的版本信息
 */

exports.appVersion=function(req,res){
    var apptype=req.params.type;
    if (apptype>4||apptype<1||apptype === undefined)
    {
        return res.status(500).send(new BaseReturnInfo(0,"请求参数错误",""));
    }
    /* var appverison =new Apperversion();
     appverison.name="andorid yonghukehuand";
     appverison.apptype=1;
     appverison.versionCode='v1.0';
     appverison.updateMessage="更新信息";
     appverison.downloadUrl="www.baidu.com";
     appverison.updateTime=Date.now();

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
            return res.status(500).send(new BaseReturnInfo(0, "Internal Server Error", err));
        }
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
