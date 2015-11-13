/**
 * Created by v-lyf on 2015/9/14.
 */

var retry = require('retry');
var baseIM=require("./IM/easemob")
var log=require("./systemlog");




exports.addsuer=function(userid,password,callback){
    var operation = retry.operation({
        retries: 5,
        factor: 3,
        minTimeout: 1 * 1000,
        maxTimeout: 30 * 1000,
        randomize: true,
    });
    operation.attempt(function () {
        //console.log("Connect Times:");
        baseIM.user_create(userid,password,function(code,data){
           // console.log(data);
          //  console.log(code);
            if (operation.retry(code==503)) {
                return;
            }
            if(code==200){
                console.log("用户修改密码成功userid："+userid+"密码："+password);
                console.log(data);
                return callback(null,"success");
            }
           else{
                log.writeimLog("adduser",code,data.error+ ""+ data.error_description ,userid,5);
                return  callback(data.error);
            }
        })
    });


}

exports.userupdatepassword=function(userid,password,callback){
    var operation = retry.operation({
        retries: 5,
        factor: 3,
        minTimeout: 1 * 1000,
        maxTimeout: 30 * 1000,
        randomize: true,
    });
    operation.attempt(function () {
        baseIM.upatepassword(userid,password,function(code,data){
            if (operation.retry(code==503)) {
                return;
            }
            if(code==200){
                console.log("用户修改密码成功userid："+userid+"密码："+password);
                console.log(data);
                return callback(null,"success");
            }
            else{
                log.writeimLog("userupdatepassword",code,data.error+ ""+ data.error_description ,userid,5);
                  return callback(data.error);
            }
        })
    });


}

/*addsuer("1223","12334",function(err,data){
    console.log(err);
    console.log(data);
})*/
