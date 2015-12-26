/**
 * Created by v-yaf_000 on 2015/12/25.
 */

var mongodb = require('../../models/mongodb.js');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var commondata = require('../../Config/commondata.js');
var schoolModel=mongodb.DriveSchoolModel;
var schooldaysunmmary=mongodb.SchoolDaySummaryModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
 var userCountModel=mongodb.UserCountModel;
var cache=require("../../Common/cache");


var basedataFunc = {
    getUserCount:function(callback) {
        userCountModel.getUserCountInfo(function (err, data) {
            //userCountModel.findAndModify({}, [],{$inc:{'displayid':1},$inc:{'invitationcode':1}},
            //  {new: true, upsert: true},function(err,data){
            if (err) {
                return callback(err)
            }
            // console.log("get user count:"+ data);
            //  console.log("get user count:"+ data.value.displayid);
            if (!data) {
                var usercountinfo = new userCountModel();
                usercountinfo.save(function (errsave, savedata) {
                    if (errsave) {
                        return callback(errsave);
                    }
                    return callback(null, savedata);
                });
            }
            else {
                return callback(null, data);
            }
        })
    },
    getSchooltrainingfiled:function(schoolid,callback){
        cache.get("schooltrainingfield"+schoolid,function(err,data){
            if(!data){
                trainingfiledModel.find({"driveschool":new mongodb.ObjectId(schoolid)},function(err,fileddata){
                    cache.set("schooltrainingfield"+schoolid,fileddata,function(err){});
                    return callback(null,fileddata);
                })
            }
            if(data){
                return callback(null,data);
            }
        })
    },
    getsubject:function(subjectid){
        for(i=0;i<commondata.subject.length;i++){
            if(commondata.subject[i].subjectid==subjectid){
                return commondata.subject[i];
                break;
            }
        }
        return undefined;
    },
    getcarmodel:function(subjectid){
        for(i=0;i<commondata.carmodels.length;i++){
            if(parseInt(commondata.carmodels[i].modelsid)==parseInt(subjectid)){
                return commondata.carmodels[i];
                break;
            }
        }
        return undefined;
    }

}

module.exports = basedataFunc;