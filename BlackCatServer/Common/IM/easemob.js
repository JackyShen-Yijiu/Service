/**
 * Created by v-lyf on 2015/9/14.
 */
var https = require('https');

var token = 'YWMthhFERlqcEeW84Hf9K0P7YgAAAVD_MNP-_KakyMTBST0UmOw3yrHZgDiQ1NE';
var client_id = 'YXA6tqifEFqREeWheDcRSMT5qg';
var client_secret = 'YXA6OH-iIkZr8ornGiaGzvqlxH595DI';

//通用http请求函数
var http_request = function (data, path, method, callback) {
    data = data || {};
    method = method || 'GET';

    var postData = JSON.stringify(data);
    var options = {
        host: 'a1.easemob.com',
        path: '/337605876/blackcat' + path,
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
                callback(data);
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
    http_request(data, '/token', 'POST', function (data) {
        token = data.access_token;
        console.log(data);
        if (callback)
            callback();
    });
};

//模块初始化调用
//get_token();

// 调用 获取token
exports.gettoken=function(callback){
    if(callback){
        callback(token);
    }
}
//注册IM用户[单个]
exports.user_create = function (username, password, callback) {
    var data = {username: username, password: password};
    http_request(data, '/user', 'POST', function (data) {
        if (callback)
            callback(data);
    })
};
