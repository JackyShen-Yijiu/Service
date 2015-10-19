/**
 * Created by v-lyf on 2015/9/1.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var testserver=require('../../Server/test_server');


exports.adddriveschool=function(req,res){
    testserver.adddriveschool(function(err,data){
        if(err){
            console.log(err);
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            console.log('suceeses');
            return res.json (new BaseReturnInfo(1,"",data));
        }
    })
};

exports.adddschoolclass=function(req,res){
    testserver.adddschoolclass(function(err,data){
        if(err){
            console.log(err);
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            console.log('suceeses');
            return res.json (new BaseReturnInfo(1,"",data));
        }
    })
};

exports.addaddtrainingfield=function(req,res){
    testserver.addaddtrainingfield(function(err,data){
        if(err){
            console.log(err);
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            console.log('suceeses');
            return res.json (new BaseReturnInfo(1,"",data));
        }
    })
};

exports.initData=function(req,res){
    testserver.inindatabase(function(err,data){
        if(err){
            console.log(err);
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            //console.log('suceeses');
            return res.json (new BaseReturnInfo(1,"",data));
        }
    })
};

//获取token
exports.gettoken=function(req,res){
    testserver.gettok(function(err,data){
        if(err){
            console.log(err);
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            console.log('suceeses');
            return res.json (new BaseReturnInfo(1,"",data));
        }
    })
};

