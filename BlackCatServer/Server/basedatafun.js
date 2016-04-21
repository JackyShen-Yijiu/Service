
/**
 * Created by v-yaf_000 on 2016/3/15.
 */
var cache=require('../Common/cache');
var mongodb = require('../models/mongodb.js');
var schoolModel=mongodb.DriveSchoolModel;
var userModel=mongodb.UserModel;
var coachModel=mongodb.CoachModel;
var basedataFunc = {
    getSchoolCoachCount: function(schoolid,callback){
        cache.get("getSchoolCoachCount"+schoolid,function(err,data){
            if(!data){
                coachModel.count({driveschool:new mongodb.ObjectId(schoolid)},function(err,schooldata){
                    cache.set("getSchoolCoachCount"+schoolid,schooldata,60,function(err){});
                    return callback(null,schooldata);
                })
            }
            if(data){
                return callback(null,data);
            }
        })
    },
    getschoolinfo: function(schoolid,callback){
        cache.get("schoolinfo"+schoolid,function(err,data){
            if(!data){
                schoolModel.findById(new mongodb.ObjectId(schoolid),function(err,schooldata){
                    cache.set("schoolinfo"+schoolid,schooldata,function(err){});
                    return callback(null,schooldata);
                })
            }
            if(data){
                return callback(null,data);
            }
        })
    },
    getstudentinfo:function(userid,callback){
        cache.get("getstudentinfo"+userid,function(err,data){
            if(!data){
                userModel.findById(new mongodb.ObjectId(userid),function(err,userdata){
                    cache.set("getstudentinfo"+userid,userdata,60,function(err){});
                    return callback(null,userdata);
                })
            }
            if(data){
                return callback(null,data);
            }
        })
    },
    getcoachinfo:function(userid,callback){
        cache.get("getcoachinfo"+userid,function(err,data){
            if(!data){
                coachModel.findById(new mongodb.ObjectId(userid),function(err,userdata){
                    cache.set("getcoachinfo"+userid,userdata,60,function(err){});
                    return callback(null,userdata);
                })
            }
            if(data){
                return callback(null,data);
            }
        })
    }


}

module.exports = basedataFunc;
