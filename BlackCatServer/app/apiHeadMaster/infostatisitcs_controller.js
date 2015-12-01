/**
 * Created by li on 2015/11/28.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var headMasterOperation=require("../../Server/headmaster_operation_server");
// 信息统计
/*
  获取更多统计数据
 */
exports.getMoreData=function(req,res){
    var  userid=req.query.userid;
    var  searchtype=req.query.searchtype;
    if (userid===undefined|| searchtype===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
}

// 统计主页数据
exports.getMainPageData=function(req,res){
    var  queryinfo={
        userid:req.query.userid,
        searchtype:req.query.searchtype,
        schoolid:req.query.schoolid
    }
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
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

//统计详情数据 详情统计数据
exports.getMoreData=function(req,res){
    var  queryinfo={
        userid:req.query.userid,
        searchtype:req.query.searchtype,
        schoolid:req.query.schoolid
    }
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
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
