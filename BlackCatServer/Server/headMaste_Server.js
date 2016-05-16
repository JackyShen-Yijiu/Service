/**
 * Created by li on 2015/11/27.
 */
var mongodb = require('../models/mongodb.js');
var jwt = require('jsonwebtoken');
var headMasterModle=mongodb.HeadMasterModel;
var driveSchoolModel=mongodb.DriveSchoolModel;
var industryNewsModel=mongodb.IndustryNewsModel;
var schoolBulletin=mongodb.SchoolBulletin;
var regisermobIm=require('../Common/mobIm');
var cache=require('../Common/cache');
var secretParam= require('./jwt-secret').secretParam;
var appTypeEmun=require("../custommodel/emunapptype");


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
                            usersetting:newinstace.usersetting,
                            driveschool:{
                                schoolid:driveschooldata._id,
                                name:driveschooldata.name
                            }
                        };
                        //cache.set(token,returnmodel,function(err,data){
                        //    console.log(data);
                        //});
                        regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                            return callback(null,returnmodel);
                            //headMasterModle.update({"_id":new mongodb.ObjectId(newinstace._id)},
                            //    { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                        })

                    })

                //if (newinstace.is_registermobim===undefined||newinstace.is_registermobim==0){
                //    regisermobIm.addsuer(newinstace._id,newinstace.password,function(err,data){
                //        headMasterModle.update({"_id":new mongodb.ObjectId(newinstace._id)},
                //            { $set: { is_registermobim:1 }},{safe: false},function(err,doc){});
                //    })
                //}



            });
        }
        else{
            return callback("密码错误");
        }
    })


}
exports.personalSetting=function(settinginfo,callback){
    headMasterModle.findById(new mongodb.ObjectId(settinginfo.userid),function(err,data){
        if (err){
            return  callback("查找用户出错："+err);
        }
        if(!data){
            return callback("没有查询到相关用户信息");
        }
        data.usersetting.applyreminder=settinginfo.applyreminder;
        data.usersetting.newmessagereminder=settinginfo.newmessagereminder;
        data.usersetting.complaintreminder=settinginfo.complaintreminder;
        data.save(function(err){
            if (err){
                return callback("保存设置失败："+err);
            }
            return callback(null,"success");
        })

    })
}

//发布公告
exports.publishBulletin=function(bulletioninfo,callback){
    if(bulletioninfo.bulletobject!=appTypeEmun.UserType.Coach &&
        bulletioninfo.bulletobject!=appTypeEmun.UserType.User){
        return callback("发布对象错误");
    }
    var bulletion=new  schoolBulletin();
    bulletion.headmaster=new mongodb.ObjectId(bulletioninfo.userid);
    bulletion.driveschool=new mongodb.ObjectId(bulletioninfo.schoolid);
    bulletion.content=bulletioninfo.content;
    bulletion.bulletobject=bulletioninfo.bulletobject;
    bulletion.title=bulletioninfo.title;
    bulletion.save(function(err,data){
        if(err){
            return callback("发布消息出错："+err);
        }
        return callback(null,"发布成功");
    })
}

// 查询发布的公告
exports.getSchoolBulletin=function(searchinfo,callback){
    if(searchinfo.seqindex==0){
        searchinfo.seqindex=Number.MAX_VALUE;
    };
    //console.log(searchinfo);
    schoolBulletin.find({"seqindex":{$lt:searchinfo.seqindex},
    //"headmaster":new mongodb.ObjectId(searchinfo.userid),
    "driveschool":new mongodb.ObjectId(searchinfo.shcoolid)
    })
        .populate("headmaster","name")
        .sort({seqindex:-1})
        .limit(searchinfo.count)
        .exec(function(err,data){
           // console.log(data);
            if(err){
                return  callback("查询公告出错："+err);
            }
            process.nextTick(function(){
                var bulletionlist=[];
                data.forEach(function(r,indx){
                    var bulletin={
                        bulletinid:r._id,
                        content: r.content,
                        createtime: r.createtime,
                        bulletobject: r.bulletobject,

                        title: r.title||"",
                        seqindex: r.seqindex
                    }
                    if( r.headmaster){
                        bulletin.name= r.headmaster.name
                    }else{
                        bulletin.name="";
                    }
                    bulletionlist.push(bulletin);
                })
                return callback(null,bulletionlist);
            })
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
                        createtime: r.createtime,
                        newstype: r.newstype?r.newstype:0,
                        seqindex: r.seqindex
                    }
                    newslist.push(news);
                })
                return callback(null,newslist);
            })
        })
}

exports.getBulletinCount=function(queryinfo,callback){
    schoolBulletin.count({driveschool:queryinfo.schoolid,seqindex:{"$gt":queryinfo.seqindex}},
        function(err,systemmessagecount) {
            if (err) {
                return callback("查询公告消息数量出错：" + err);
            }

            return callback(null,systemmessagecount);
        })
}


