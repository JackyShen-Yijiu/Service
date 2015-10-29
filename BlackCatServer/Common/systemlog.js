/**
 * Created by li on 2015/10/29.
 */

var mongodb = require('../models/mongodb.js');
var logModel=mongodb.SystemLogModel;


exports.writeLog=function(req ,errmsg,logType){
    var loginfo=new logModel;
     loginfo.apiname=req.url;
     loginfo.ver=req.query.ver;
    loginfo.os=req.query.os;
    loginfo.msid=req.query.msid;
     loginfo.ip= getClientIp(req);
    //loginfo.queryparameter=req.query.toString();
    //loginfo.pathparameter=req.params.toString();
    //loginfo.bodyparameter=req.body.toString();
    loginfo.errmsg=errmsg;
    loginfo.logtype=logType;
    loginfo.save(function(err){
        console.log(err)
    });
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};