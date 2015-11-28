/**
 * Created by li on 2015/11/27.
 */
var mongodb = require('../models/mongodb.js');
var jwt = require('jsonwebtoken');
var headMasterModle=mongodb.HeadMasterModel;
var driveSchoolModel=mongodb.DriveSchoolModel;
var industryNewsModel=mongodb.IndustryNewsModel;
var regisermobIm=require('../Common/mobIm');
var cache=require('../Common/cache');
var secretParam= require('./jwt-secret').secretParam;


exports.headMasterLogin=function(userinfo,callback){
    headMasterModle.findOne({mobile: userinfo.mobile}, function (err, userinstace) {
        if (err)
        {
            return callback ("查找用户出错:"+ err);
        } else if(! userinstace){
            return callback("用户不存在");
        }
        else if (userinstace.is_lock){
            return callback("该用户被锁定");
        }else if(!userinstace.driveschool){
            return callback("该校长暂无绑定驾校");
        }
        if (userinstace.password == userinfo.password){
            cache.del(userinstace.token,function(err,data){
                if(err){
                    return callback ("读取用户错误:"+ err);
                }
            });
            var token = jwt.sign({
                userId: userinstace._id,
                timestamp: new Date(),
                aud: secretParam.audience
            }, secretParam.secret);
            userinstace.token = token;
            userinstace.logintime = Date.now();
            userinstace.save(function (err, newinstace) {
                if (err) {
                    return callback("保存用户信息出错:" + err);
                }
                driveSchoolModel.findById(newinstace.driveschool)
                    .select("_id name")
                    .exec(function (err,driveschooldata){
                        if(err){
                            return callback ("查找驾校出错:"+ err);
                        }
                        if(!driveschooldata){
                            return callback ("没有查到相关驾校");
                        }
                        var returnmodel={
                            userid:newinstace._id,
                            name:newinstace.name,
                            token:newinstace.token,
                            mobile:newinstace.mobile,
                            headportrait:newinstace.headportrait,
                            driveschool:{
                                schoolid:driveschooldata._id,
                                name:driveschooldata.name
                            }
                        };
                        //cache.set(token,returnmodel,function(err,data){
                        //    console.log(data);
                        //});
                        return callback(null,returnmodel);
                    })

                if (newinstace.is_registermobim===undefined||newinstace.is_registermobim==0){
                    regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                        headMasterModle.update({"_id":new mongodb.ObjectId(newinstace._id)},
                            { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                    })
                }



            });
        }
    })


}

// 获取行业资讯
exports.getIndustryNews=function(searchinfo,callback){
    if(searchinfo.seqindex==0){
        searchinfo.seqindex=Number.MAX_VALUE;
    };
    industryNewsModel.find({seqindex:{$lt:searchinfo.seqindex}})
        .sort({seqindex:-1})
        .limit(searchinfo.count)
        .exec(function (err,data){
            if(err){
                return  callback("查询资讯出错："+err);
            }
            process.nextTick(function(){
                var newslist=[];
                data.forEach(function(r,indx){
                    var news={
                        newsid:r._id,
                        title: r.title,
                        logimg: r.logimg,
                        description: r.description,
                        contenturl: r.contenturl,
                        createtime: r.createtime
                    }
                    newslist.push(news);
                })
                return callback(null,newslist);
            })
        })
}