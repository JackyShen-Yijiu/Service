/**
 * Created by v-lyf on 2015/9/2.
 */

var jwt = require('jsonwebtoken');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var secretParam= require('../../Server/jwt-secret').secretParam;
// 验证用户请求

exports.ensureAuthorized = function(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader
        verifyToken(bearerHeader, function(ret, decode){
            if(ret){
                if(decode.userId === undefined){

                    return res.status(401).json(new BaseReturnInfo(0,"No user id was found In authenticated",""));
                }
                req.userId = decode.userId;
                next();
            }else{

                return res.status(401).json(new BaseReturnInfo(0,"Not authenticated",""));
            }
        });
    } else {
        return res.status(401).json(new BaseReturnInfo(0,"Not authenticated",""));
    }
}

var verifyToken = function(token, callback) {
    jwt.verify(token, secretParam.secret, undefined, function(err, decoded) {
        if (err) {
            if(callback != undefined){
                callback(false);
            }
        }else{
            if(callback != undefined){
                callback(true, decoded);
            }
        }
    });
}