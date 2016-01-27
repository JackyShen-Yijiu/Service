/**
 * Created by v-yaf_000 on 2016/1/27.
 */
// 缓存数据

var mongodb = require('../models/mongodb.js');
var trainingfiledModel=mongodb.TrainingFieldModel;
var schoolbusroute=mongodb.SchoolBusRouteModel;
var vipserver=mongodb.VipServerModel;
var cache=require("./cache");


var basedataFunc = {
    getSchoolBusRoute:function(schoolid,callback){
        cache.get("schoolbusroute"+schoolid,function(err,data){
            //console.log(data);
            if(!data||data.length==0){
                //console.log(data);
                schoolbusroute.find({"schoolid":new mongodb.ObjectId(schoolid)},function(err,busroute){
                    cache.set("schoolbusroute" + schoolid, busroute, 60 * 5, function (err) {});
                    return callback(null, busroute);
                })
            }
            else{
                return callback(null,data);
            }
        })
    },
    getSchooltrainingfiled:function(schoolid,callback){
        cache.get("schooltrainingfield"+schoolid,function(err,data){
            //console.log(data);
            if(!data||data.length==0){
                //console.log(data);
                trainingfiledModel.find({"driveschool":new mongodb.ObjectId(schoolid)},function(err,fileddata){
                    cache.set("schooltrainingfield" + schoolid, fileddata, 60 * 5, function (err) {});
                    return callback(null, fileddata);
                })
            }
            else{
                return callback(null,data);
            }
        })
    }
}

module.exports = basedataFunc;/**
 * Created by v-yaf_000 on 2016/1/27.
 */
