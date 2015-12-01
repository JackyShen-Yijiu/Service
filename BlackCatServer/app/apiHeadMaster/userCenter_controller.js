/**
 * Created by li on 2015/11/27.
 */
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var userCenterServer=require("../../Server/headMaste_Server");
var weatherInfo=require("../../Common/getweatherinfo");


exports.headMasterLogin=function(req,res){
    var userinfo={
    mobile:req.body.mobile,
    password:req.body.password
}
    if (userinfo.mobile === undefined|| userinfo.password === undefined) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",{}));
    }
    userCenterServer.headMasterLogin(userinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}
exports.getIndustryNews=function(req,res) {
    var searchinfo = {
        seqindex: req.query.seqindex ? req.query.seqindex : 0,
        count: req.query.count ? req.query.count : 10,
    }
    userCenterServer.getIndustryNews(searchinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })
}

exports.getWeatherinfo=function(req,res){
    var cityname=req.query.cityname;
    if (cityname===undefined){
        return res.json(
            new BaseReturnInfo(0,"参数错误",{}));
    }
    weatherInfo.getWeather(cityname,function(err,data){
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })
}
