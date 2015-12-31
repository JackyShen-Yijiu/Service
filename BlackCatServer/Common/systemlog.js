/**
 * Created by li on 2015/10/29.
 */

var mongodb = require('../models/mongodb.js');
var logModel=mongodb.SystemLogModel;

exports.writewebsitedowmlog=function(req ,logType){
    var loginfo=new logModel;
    loginfo.apiname=req.url;
    loginfo.ver=req.query._ver;
    loginfo.os=req.query._os;
    loginfo.msid=req.query._mid;
    loginfo.psrc=req.query.psrc;
    loginfo.path=req.path;
    loginfo.ip= getClientIp(req);
    //loginfo.queryparameter=req.query.toString();
    //loginfo.pathparameter=req.params.toString();
    //loginfo.bodyparameter=req.body.toString();
    loginfo.logtype=logType;
    loginfo.save(function(err){
          console.log(err)
    });
}
exports.writeLog=function(req ,errmsg,logType){
    var loginfo=new logModel;
     loginfo.apiname=req.url;
     loginfo.ver=req.query._ver;
    loginfo.os=req.query._os;
    loginfo.msid=req.query._mid;
     loginfo.ip= getClientIp(req);
    //loginfo.queryparameter=req.query.toString();
    //loginfo.pathparameter=req.params.toString();
    //loginfo.bodyparameter=req.body.toString();
    loginfo.errmsg=errmsg;
    loginfo.logtype=logType;
    loginfo.save(function(err){
      //  console.log(err)
    });
}

exports.writeimLog=function(name, code ,errmsg, senddata,logType){
    var loginfo=new logModel;
    loginfo.apiname=name;
    loginfo.queryparameter=senddata;
    loginfo.pathparameter=code;
    //loginfo.bodyparameter=req.body.toString();
    loginfo.errmsg=errmsg;
    loginfo.logtype=logType;
    loginfo.save(function(err){
        //  console.log(err)
    });
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};