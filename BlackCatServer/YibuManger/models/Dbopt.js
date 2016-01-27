/**
 * Created by v-yaf_000 on 2015/12/12.
 */

var crypto=require("crypto");
var mongoose = require('mongoose');
var settings = require("../../Config/DbConfig");
var db = //mongoose.connect('mongodb://localhost/doracms');
    mongoose.connect(settings.db.uri);


var DbOpt = {
        encrypt : function(data,key){ // 密码加密
            var cipher = crypto.createCipher("bf",key);
            var newPsd = "";
            newPsd += cipher.update(data,"utf8","hex");
            newPsd += cipher.final("hex");
            return newPsd;
        },
        decrypt : function(data,key){ //密码解密
            var decipher = crypto.createDecipher("bf",key);
            var oldPsd = "";
            oldPsd += decipher.update(data,"hex","utf8");
            oldPsd += decipher.final("utf8");
            return oldPsd;
        }
}
//console.log(DbOpt.encrypt("123456","yibuxueche")); dd6264ae7c976899

module.exports = DbOpt;
;