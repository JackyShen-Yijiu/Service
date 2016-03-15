
/**
 * Created by v-yaf_000 on 2016/3/15.
 */
var cache=require('../Common/cache');
var mongodb = require('../models/mongodb.js');
var schoolModel=mongodb.DriveSchoolModel;
var basedataFunc = {

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


}

module.exports = basedataFunc;
