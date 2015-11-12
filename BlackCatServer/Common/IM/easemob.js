/**
 * Created by v-lyf on 2015/9/14.
 */
var https = require('https');
var request = require("request");
var Buffer = require('buffer');
var iMconfig=require("../../Config/sysconfig").imConfig;
var token = '';
var tokencreatetimestamp ;
var token_expires=5*24*60*60*100;
var client_id =iMconfig.client_id;
var client_secret = iMconfig.client_secret;

//通用http请求函数
var http_request = function (data, path, method, callback) {
    data = data || {};
    method = method || 'GET';

    var postData = JSON.stringify(data);
    var options = {
        host: 'a1.easemob.com',
        path: '/'+iMconfig.org_name+'/'+iMconfig.app_name + path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    var req = https.request(options, function (res) {
        var chunks = [];
        var size = 0;
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            chunks.push(chunk);
            size += chunk.length;
        });
        res.on('end', function () {
            var data = JSON.parse(Buffer.concat(chunks, size).toString());
            if (callback)
            //console.log(res);
                callback(res.statusCode,data);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
};

//获取token
var get_token = function (callback) {
    var data = {grant_type: 'client_credentials', client_id: client_id, client_secret: client_secret};
    http_request(data, '/token', 'POST', function (code,data) {
        token = data.access_token;
        tokencreatetimestamp=(new Date()).getTime();
        //console.log(data);
        console.log("重新获取 token "+token);
        if (callback)
            callback();
    });
};

//模块初始化调用
//get_token();


//注册IM用户[单个]
exports.user_create = function (username, password, callback) {
    var data = {username: username, password: password};
    nowtimespan=(new Date()).getTime();
    if (token==''||(nowtimespan-tokencreatetimestamp)>token_expires){
        get_token(function(){
            http_request(data, '/user', 'POST', function (code,data) {
                if (callback) {
                   // console.log(data)
                    return  callback(code,data);
                }
            })
        })}
        else
        {
            http_request(data, '/users', 'POST', function (code,data) {
                if (callback) {
                    //console.log(data)
                    return   callback(code,data);
                }
            })
        }


};

// 修改密码
exports.upatepassword = function (username, password, callback) {
    var data = { newpassword: password};
    nowtimespan=(new Date()).getTime();
    if (token==''||(nowtimespan-tokencreatetimestamp)>token_expires){
        get_token(function(){
            http_request(data, '/users/'+username+'/password', 'PUT', function (code,data) {
                if (callback) {

                      callback(code,data);
                }
            })
        })}
    else
    {
        http_request(data, '/users/'+username+'/password', 'PUT', function (code,data) {
            if (callback) {
                //console.log(data)
                   callback(code,data);
            }
        })
    }


};
