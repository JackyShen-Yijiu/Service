/**
 * Created by v-yaf_000 on 2015/12/25.
 */

var mongodb = require('../../models/mongodb.js');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var commondata = require('../../Config/commondata.js');
var schoolModel=mongodb.DriveSchoolModel;
var schooldaysunmmary=mongodb.SchoolDaySummaryModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
var classtype=mongodb.ClassTypeModel;
var vipserver=mongodb.VipServerModel;
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
    adddefaulttrainingfiled:function(schooldata,callback){
        var tempdata=new trainingfiledModel();
        tempdata.fieldname=schooldata+"本部练车场";
        tempdata.is_validation=true;
        tempdata.fieldlevel=schooldata.schoollevel;
        tempdata.latitude=schooldata.latitude;
        tempdata.longitude=schooldata.longitude;
        tempdata.province=schooldata.province;
        tempdata.city=schooldata.city;
        tempdata.county=schooldata.county;
        tempdata.address=schooldata.address;
        tempdata.responsible=schooldata.responsible;
        tempdata.phone=schooldata.phone;
        tempdata.driveschool=schooldata._id;
        tempdata.save(function(err,data){
            trainingfiledModel.find({"driveschool":new mongodb.ObjectId(schooldata._id)},function(err,fileddata){
                cache.set("schooltrainingfield"+schooldata._id,fileddata,function(err){});
                return callback(null,fileddata)
            });
            return callback(err,data);
        });
    },
    reftrainingfiled:function(schoolid,callback){
        trainingfiledModel.find({"driveschool":new mongodb.ObjectId(schoolid)},function(err,fileddata){
            cache.set("schooltrainingfield"+schoolid,fileddata,60*5,function(err){});
        })
    },
    gettrainingfiledbyid:function(trainingfiledid,callback){
        cache.get("gettrainingfiledbyid"+trainingfiledid,function(err,data){
            //console.log(data);
            if(!data){
                trainingfiledModel.findById(new mongodb.ObjectId(trainingfiledid),function(err,fileddata){
                    cache.set("gettrainingfiledbyid" +trainingfiledid, fileddata, 60 * 5, function (err) {});
                    return callback(null, fileddata);

                })
            }
            else{
                return callback(null,data);
            }
        })
    },
    getSchooltrainingfiled:function(schoolid,schooldata,callback){
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
    },
    getclasstypebyid:function(classtypeid,callback){
        cache.get("getclasstypebyid"+classtypeid,function(err,data){
            //console.log(data);
            if(!data){
                //console.log(data);
                classtype.findById(new mongodb.ObjectId(classtypeid),function(err,classdata){
                    cache.set("getschoolclasstype" + classtypeid, classdata, 60 * 5, function (err) {});
                    return callback(null, classdata);

                })
            }
            else{
                return callback(null,data);
            }
        })
    },
    getschoolclasstype:function(schoolid,callback){
        cache.get("getschoolclasstype"+schoolid,function(err,data){
            //console.log(data);
            if(!data||data.length==0){
                //console.log(data);
                classtype.find({"schoolid":new mongodb.ObjectId(schoolid)},function(err,classdata){
                    cache.set("getschoolclasstype" + schoolid, classdata, 60 * 5, function (err) {});
                    return callback(null, classdata);

                })
            }
            else{
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
    },
    getvipserver:function(callback){
        cache.get("getvipserverlist",function(err,data){
            if(!data){
                vipserver.find(function(err,fileddata){
                    cache.set("getvipserverlist",fileddata,5*60,function(err){});
                    return callback(null,fileddata);
                })
            }
            if(data){
                return callback(null,data);
            }
        })
    }

}

module.exports = basedataFunc;