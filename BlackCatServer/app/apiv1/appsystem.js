/**
 * Created by metis on 2015-08-31.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var mongodb = require('../../models/mongodb.js');
var commondataServer=require('../../Config/commondata')
var  Apperversion= mongodb.AppVersionModel;
/**
 * ����api ���÷���
 **/
exports.TestAPI = function (req, res) {
    return  res.json(
        new BaseReturnInfo(1,"","hello, BlackCate"))

};
/*
 ��ȡapp�İ汾��Ϣ
 */

exports.appVersion=function(req,res){
    var apptype=req.params.type;
    if (apptype>4||apptype<1||apptype === undefined)
    {
        return res.status(500).send(new BaseReturnInfo(0,"�����������",""));
    }
    /* var appverison =new Apperversion();
     appverison.name="andorid yonghukehuand";
     appverison.apptype=1;
     appverison.versionCode='v1.0';
     appverison.updateMessage="������Ϣ";
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

//��ȡ��Ŀ
exports.GetSubject=function(req,res){
    var subject=commondataServer.subject;
    return res.json( new BaseReturnInfo(1,'',subject));
}
exports.GetCarModel=function(req,res){
    var carmodels=commondataServer.carmodels;
    return res.json(new BaseReturnInfo(1,'',carmodels));
}
