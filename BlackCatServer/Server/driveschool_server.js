/**
 * Created by v-lyf on 2015/9/1.
 */

var mongodb = require('../models/mongodb.js');
var resbaseschoolinfomode=require("../custommodel/returndriveschoolinfo").resBaseSchoolInfo;
var schoolModel=mongodb.DriveSchoolModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
var classtypeModel=mongodb.ClassTypeModel;
var geolib = require('geolib');

exports.getNearDriverSchool=function(latitude, longitude, radius ,callback){
    schoolModel.getNearDriverSchool(latitude, longitude, radius ,function(err ,driveschool){
        if (err || !driveschool || driveschool.length == 0) {
            console.log(err);
            callback("get driveschool failed");

        } else {
            process.nextTick(function(){
                driveschoollist=[];
            driveschool.forEach(function(r, idx){
                var oneschool= {
                    distance : geolib.getDistance(
                    {latitude: latitude, longitude: longitude},
                    {latitude: r.latitude, longitude: r.longitude},
                    10),
                    schoolid: r._id,
                    name:r.name,
                    logoimg:r.logoimg,
                    latitude: r.latitude,
                    longitude: r.longitude,
                    address: r.address,
                    passingrate: r.passingrate
                   }
                driveschoollist.push(oneschool)
              //  r.restaurantId = r._id;
               // delete(r._id);
            });
           callback(null,driveschoollist);
            });
        }

    })

};
exports.getNeartrainingfield=function(latitude, longitude, radius ,callback){
    trainingfiledModel.getNearTrainingField(latitude, longitude, radius ,function(err ,trainingfield){
        if (err || !trainingfield || trainingfield.length == 0) {
            console.log(err);
            callback("get trainingfield failed");

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
//根据驾校id 获取驾校课程类型
exports.getClassTypeBySchoolId=function(schoolid,callback){
    classtypeModel.find({"schoolid":new mongodb.ObjectId(schoolid),"is_using":true},function(err,data){
        if(err||!data){
            return callback("查询出错："+err);
        }else{
            process.nextTick(function() {
                classlist=[];
                data.forEach(function(r){
                    var oneclass={
                        calssid: r._id,
                        schoolid: r.schoolid,
                        classname: r.classname,
                        begindate: r.begindate,
                        enddate: r.enddate,
                        is_vip: r.is_vip,
                        classdesc: r.classdesc,
                        price: r.price,
                        carmodel: r.carmodel
                    }
                    classlist.push(oneclass)
                })
                return callback(null, classlist);
            });
        }
    });
};
// 获取驾校详情
exports.getSchoolInfoserver=function(schoolid,callback){
    schoolModel.findById(new mongodb.ObjectId(schoolid),function(err,schooldata){
       if(err||!schooldata){
           return callback("查询驾校详情出错："+err);
       }
        var data =new  resbaseschoolinfomode(schooldata);
        return callback(null,data);
    });
};
