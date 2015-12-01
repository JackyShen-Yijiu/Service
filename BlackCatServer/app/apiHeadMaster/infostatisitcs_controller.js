/**
 * Created by li on 2015/11/28.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var headMasterOperation=require("../../Server/headmaster_operation_server");
// ��Ϣͳ��
/*
  ��ȡ����ͳ������
 */
exports.getMoreData=function(req,res){
    var  userid=req.query.userid;
    var  searchtype=req.query.searchtype;
    if (userid===undefined|| searchtype===undefined){
        return res.json(new BaseReturnInfo(0,"��ȡ��������",""));
    }
    if(userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"�޷�ȷ�������û�",""));
    };
}

// ͳ����ҳ����
exports.getMainPageData=function(req,res){
    var  queryinfo={
        userid:req.query.userid,
        searchtype:req.query.searchtype,
        schoolid:req.query.schoolid
    }
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"��ȡ��������",""));
    }
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"�޷�ȷ�������û�",""));
    };
    headMasterOperation.getMainPageData(queryinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}

//ͳ���������� ����ͳ������
exports.getMoreData=function(req,res){
    var  queryinfo={
        userid:req.query.userid,
        searchtype:req.query.searchtype,
        schoolid:req.query.schoolid
    }
    if (queryinfo.searchtype===undefined|| queryinfo.userid===undefined
        ||queryinfo.schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"��ȡ��������",""));
    }
    if(queryinfo.userid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"�޷�ȷ�������û�",""));
    };
    headMasterOperation.getMoreStatisitcsdata(queryinfo,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
}
