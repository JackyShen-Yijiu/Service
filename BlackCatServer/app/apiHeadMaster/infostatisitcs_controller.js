/**
 * Created by li on 2015/11/28.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var headMasterOperation=require("../../Server/headMaste_Server");
// ��Ϣͳ��
/*
  ��ȡ����ͳ������
 */
exports.getMoreData=function(req,res){
    var  userid=req.query.userid;
    var  searchtype=req.query.searchtype;
    if (searchtype===undefined|| searchtype===undefined){
        return res.json(new BaseReturnInfo(0,"��ȡ��������",""));
    }
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"�޷�ȷ�������û�",""));
    };


}
