/**
 * Created by li on 2015/11/28.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var headMasterOperation=require("../../Server/headmaster_operation_server");


// 获取主页数据
exports.getMainPageData=function(req,res) {
    var queryinfo = {
        userid: req.query.userid,
        searchtype: req.query.searchtype,
        schoolid: req.query.schoolid
    }
    if (queryinfo.searchtype === undefined || queryinfo.userid === undefined
        || queryinfo.schoolid === undefined) {
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    if (queryinfo.userid != req.userId) {
        return res.json(
            new BaseReturnInfo(0, "无法确认请求用户", ""));
    };
    headMasterOperation.getMainPageData(queryinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
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

/*获取投诉详情*/
exports.getComplaintDetails=function(req,res) {
    queryinfo = {
        userid: req.query.userid,
        schoolid: req.query.schoolid,
        index:req.query.index? req.query.index :1,
        count:req.query.count? req.query.count :10
    };
    //console.log(queryinfo);
    if ( queryinfo.userid === undefined || queryinfo.schoolid === undefined) {
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    if (queryinfo.userid != req.userId) {
        return res.json(
            new BaseReturnInfo(0, "无法确认请求用户", ""));
    };
    headMasterOperation.getComplaintDetailsv2(queryinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })

}

/*校长处理投诉*/
exports.handleComplaint=function(req,res){
    handleinfo={
        userid:req.body.userid,
        reservationid:req.body.reservationid,
        complainthandlemessage:req.body.complainthandlemessage
    }
    if (handleinfo.userid === undefined|| handleinfo.reservationid === undefined
      //  ||handleinfo.complainthandlemessage === undefined
    ) {
        return res.json(
            new BaseReturnInfo(0,"参数错误",{}));
    }
    if(handleinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    headMasterOperation.handleComplaintv2(handleinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, ""));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })

};

// 获取评论详情
exports.getCommentDetail=function(req,res){
    queryinfo = {
        userid: req.query.userid,
        schoolid: req.query.schoolid,
        searchtype:req.query.searchtype,
        commentlevel:req.query.commentlevel?req.query.commentlevel:3,
        index:req.query.index? req.query.index :1,
        count:req.query.count? req.query.count :10
    };
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"参数错误",""));
    }
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    headMasterOperation.getCommentDetails(queryinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })
}

//获取教练授课详情
exports.getCoachCourseDetails=function(req,res){
    queryinfo = {
        userid: req.query.userid,
        schoolid: req.query.schoolid,
        searchtype:req.query.searchtype,
        index:req.query.index? req.query.index :1,
        count:req.query.count? req.query.count :10
    };
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"参数错误",""));
    }
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };
    headMasterOperation.getCoachCourseDetails(queryinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, {}));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    })
}

