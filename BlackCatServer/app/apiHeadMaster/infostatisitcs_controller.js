/**
 * Created by li on 2015/11/28.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var headMasterOperation=require("../../Server/headMaste_Server");
// 信息统计
/*
  获取更多统计数据
 */
exports.getMoreData=function(req,res){
    var  userid=req.query.userid;
    var  searchtype=req.query.searchtype;
    if (searchtype===undefined|| searchtype===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",""));
    };


}
