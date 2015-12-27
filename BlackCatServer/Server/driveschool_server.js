/**
 * Created by v-lyf on 2015/9/1.
 */

var mongodb = require('../models/mongodb.js');
var resbaseschoolinfomode=require("../custommodel/returndriveschoolinfo").resBaseSchoolInfo;
var schoolModel=mongodb.DriveSchoolModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
var classtypeModel=mongodb.ClassTypeModel;
var cache=require('../Common/cache');
var geolib = require('geolib');
var _ = require("underscore");
var async = require('async');

exports.searchDriverSchool=function(searchinfo,callback){

    var searchcondition= {};
    if (searchinfo.cityname!=""){
        searchcondition.city=new RegExp(searchinfo.cityname);
    }else{
        searchcondition.loc={$nearSphere:{$geometry:{type:'Point',
            coordinates:[searchinfo.longitude, searchinfo.latitude]}, $maxDistance: 100000}}
    }
    if (searchinfo.schoolname!=""){
        searchcondition.name=new RegExp(searchinfo.schoolname);
    }
    if (searchinfo.licensetype!=""&&parseInt(searchinfo.licensetype)!=0){
        searchcondition.licensetype={"$in":[searchinfo.licensetype]}
    }
    var ordercondition={};
    // 0 默认 1距离 2 评分  3 价格
    if(searchinfo.ordertype==2){
        ordercondition.schoollevel=-1;
    }else if (searchinfo.ordertype==2){
        ordercondition.minprice=1;
    }
    //console.log(searchcondition);
    //console.log(ordercondition);
    //console.log(searchinfo);
    schoolModel.find(searchcondition)
        .select("")
        .sort(ordercondition)
        .skip((searchinfo.index-1)*10)
        .limit(searchinfo.count)
        .exec(function(err,driveschool){
            if (err ) {
                console.log(err);
                callback("查找驾校出错："+err);
            } else {
                process.nextTick(function(){
                    driveschoollist=[];
                    driveschool.forEach(function(r, idx){
                        var oneschool= {
                            distance : geolib.getDistance(
                                {latitude: searchinfo.latitude, longitude: searchinfo.longitude},
                                {latitude: r.latitude, longitude: r.longitude},
                                10),
                            id: r._id,
                            schoolid: r._id,
                            name:r.name,
                            logoimg:r.logoimg,
                            latitude: r.latitude,
                            longitude: r.longitude,
                            address: r.address,
                            maxprice: r.maxprice,
                            minprice: r.minprice,
                            schoollevel: r.schoollevel,
                            coachcount: r.coachcount? r.coachcount:0,
                            commentcount: r.commentcount? r.commentcount:0,
                            passingrate: r.passingrate
                        }
                        driveschoollist.push(oneschool);
                        //  r.restaurantId = r._id;
                        // delete(r._id);
                    });
                     if (searchinfo.ordertype==0)
                     {
                         driveschoollist=  _.sortBy(driveschoollist,"distance")
                     }
                    callback(null,driveschoollist);
                });
            }
        })
}
exports.getNearDriverSchool=function(latitude, longitude, radius ,callback){
    schoolModel.getNearDriverSchool(latitude, longitude, radius ,function(err ,driveschool){
        if (err ) {
            console.log(err);
            callback("查找驾校出错："+err);

        } else {
            process.nextTick(function(){
                driveschoollist=[];
            driveschool.forEach(function(r, idx){
                var oneschool= {
                    distance : geolib.getDistance(
                    {latitude: latitude, longitude: longitude},
                    {latitude: r.latitude, longitude: r.longitude},
                    10),
                    id: r._id,
                    schoolid: r._id,
                    name:r.name,
                    logoimg:r.logoimg,
                    latitude: r.latitude,
                    longitude: r.longitude,
                    address: r.address,
                    maxprice: r.maxprice,
                    minprice: r.minprice,
                    passingrate: r.passingrate
                   }
                driveschoollist.push(oneschool);
              //  r.restaurantId = r._id;
               // delete(r._id);
            });
           callback(null,driveschoollist);
            });
        }

    })

};
exports.getSchoolByName=function(schoolname,callback){
    schoolModel.find({"name":new RegExp(schoolname)})
        .limit(10)
        .exec(function (err,driveschool){
            if (err){
                return  callback("查询驾校出错："+err);
            }
            process.nextTick(function(){
                driveschoollist=[];
                driveschool.forEach(function(r, idx){
                    var oneschool= {
                        id: r._id,
                        schoolid: r._id,
                        name:r.name,
                        logoimg:r.logoimg,
                        latitude: r.latitude,
                        longitude: r.longitude,
                        address: r.address,
                        maxprice: r.maxprice,
                        minprice: r.minprice,
                        passingrate: r.passingrate
                    }
                    driveschoollist.push(oneschool);
                });
                callback(null,driveschoollist);
            });
        })
}
exports.getNeartrainingfield=function(latitude, longitude, radius ,callback){
    trainingfiledModel.getNearTrainingField(latitude, longitude, radius ,function(err ,trainingfield){
        if (err || !trainingfield || trainingfield.length == 0) {
            console.log(err);
            callback("查询训练场出错");

        } else {
            trainingfield.forEach(function(r, idx){
                r.distance = geolib.getDistance(
                    {latitude: latitude, longitude: longitude},
                    {latitude: r.latitude, longitude: r.longitude},
                    10
                );
                //  r.restaurantId = r._id;
                // delete(r._id);
            });
            callback(null,trainingfield);
        }

    })

};

// 获取驾校下面的练车场 给教练用
exports.getSchoolTrainingField=function(schoolid,callback){
    trainingfiledModel.find({"driveschool":new mongodb.ObjectId(schoolid)},function(err,data){
        if(err||!data){
            return callback("查询出错："+err);
        }
        process.nextTick(function(){
            var list=[];
            data.forEach(function(r,index){
                var listone={
                    id: r._id,
                    name: r.fieldname,
                    //latitude: r.latitude,
                    //longitude: r.longitude,
                   // address: r.address
                }
                list.push(listone);
            })

            return callback(null,list);
        })
    })
}
//根据驾校id 获取驾校课程类型
exports.getClassTypeBySchoolId=function(schoolid,callback){
    classtypeModel.find({"schoolid":new mongodb.ObjectId(schoolid),"is_using":true})
        .populate("schoolid"," name  latitude longitude address")
        .populate("vipserverlist"," name  color id")
    .exec(function(err,data){
        if(err||!data){
            return callback("查询出错："+err);
        }else{
            process.nextTick(function() {
                classlist=[];
                data.forEach(function(r){
                    var oneclass={
                        calssid: r._id,
                        schoolinfo: {
                            schoolid: r.schoolid._id,
                            name: r.schoolid.name,
                            latitude: r.schoolid.latitude,
                            longitude: r.schoolid.longitude,
                            address: r.schoolid.address,
                        },
                        classname: r.classname,
                        begindate: r.begindate,
                        enddate: r.enddate,
                        is_vip: r.is_vip,
                        classdesc: r.classdesc,
                        price: r.price,
                        carmodel: r.carmodel,
                        cartype:r.cartype,
                        classdesc:r.classdesc,
                        vipserverlist:r.vipserverlist,
                        classchedule: r.classchedule,
                        applycount: r.applycount,

                    }
                    classlist.push(oneclass)
                })
                return callback(null, classlist);
            });
        }
    });
};
// 获取驾校详情
exports.getSchoolInfoserver=function(schoolid,userid,callback){
    async.waterfall([
        function(cb){
            if(!userid){
                cb(null,0);
            }else {
                cache.get("FavoritSchool"+userid,function(err,data){
                    if(data){
                        var idx = data.indexOf(schoolid);
                        if (idx != -1) {
                            cb(err,1);
                        }
                        cb(err,0);
                    }
                    cb(err,0);
                })
            }
        },
        function(favoritSchool,cb){
            schoolModel.findById(new mongodb.ObjectId(schoolid),function(err,schooldata){
                if(err||!schooldata){
                    return callback("查询驾校详情出错："+err);
                }
                var data =new  resbaseschoolinfomode(schooldata);
                data.is_favoritschool=favoritSchool;
                return cb(null,data);
            });
        }
    ], function (err, result) {
        return callback(err,result);
    });

};
