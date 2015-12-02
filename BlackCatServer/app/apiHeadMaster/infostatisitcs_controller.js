/**
 * Created by li on 2015/11/28.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var headMasterOperation=require("../../Server/headmaster_operation_server");


// 获取主页数据
exports.getMainPageData=function(req,res){
    var  queryinfo={
        userid:req.query.userid,
        searchtype:req.query.searchtype,
        schoolid:req.query.schoolid
    }
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"参数错误",""));
    }
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    headMasterOperation.getMainPageData(queryinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}

//获取详情页数据，更多数据
exports.getMoreData=function(req,res){
    var  queryinfo={
        userid:req.query.userid,
        searchtype:req.query.searchtype,
        schoolid:req.query.schoolid
    }
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"参数错误",""));
    }
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    headMasterOperation.getMoreStatisitcsdata(queryinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
