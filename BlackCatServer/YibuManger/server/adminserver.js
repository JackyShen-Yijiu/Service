
/**
 * Created by v-yaf_000 on 2015/12/14.
 */
var mongodb = require('../../models/mongodb.js');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var schoolModel=mongodb.DriveSchoolModel;
var schooldaysunmmary=mongodb.SchoolDaySummaryModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
var cache=require("../../Common/cache");
require('date-utils');
exports.getStatitic=function(req,res){

}

var defaultFun={
    getSchoolcount:function( schoolname,callback){
        schoolModel.count({"name":new RegExp(schoolname)},function(err,count){
            if(err){
                return callback(err);
            }
            return callback(null,count);
        })
    },
    getSchoolSummaryinfo:function(shcoolid,summarylist){
        var summarydata={
            applyingstudentcount:0,
            reservationcoursecount:0,
            complaintcount:0
        };
        for(i=0;i<summarylist.length;i++){
            if (summarylist[i].driveschool==shcoolid){
                summarydata.applyingstudentcount=summarylist[i].applyingstudentcount;
                summarydata.reservationcoursecount=summarylist[i].reservationcoursecount;
                summarydata.complaintcount=summarylist[i].complaintcount;
                break;
            }
        }
        return  summarydata;
    },
    getschoolinfo:function(req){
        var schoolinfo={
            name:req.body.name,
            "logoimg.originalpic":req.body.logimg,
            province:req.body.province,
            city:req.body.city,
            county:req.body.county,
            address:req.body.address,
            responsiblelist:req.body.responsiblelist,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            website:req.body.website,
            email:req.body.email,
            businesslicensenumber:req.body.businesslicensenumber,
            organizationcode:req.body.organizationcode,
            registertime:req.body.registertime,
            schoollevel:req.body.schoollevel,
            is_validation:req.body.is_validation,
            privilegelevel:req.body.privilegelevel,
            studentcount:req.body.studentcount,
            passingrate:req.body.passingrate,
            examhallcount:req.body.examhallcount,
            coachcount:req.body.coachcount,
            carcount:req.body.carcount,
            licensetype:req.body.licensetype,
            cartype:req.body.cartype,
            vipserver:req.body.vipserver,
            valueaddedservice:req.body.valueaddedservice,
            superiorservice:req.body.superiorservice,
            shuttleroute:req.body.shuttleroute,
            introduction:req.body.introduction,
            schoolalbum:req.body.schoolalbum,
            workbegintime:req.body.workbegintime,
            workendtime:req.body.workendtime,
            phonelist:req.body.phonelist
        }
        schoolinfo.loc={type:"Point",coordinates:[schoolinfo.longitude,schoolinfo.latitude]};
        schoolinfo.phonelist=schoolinfo.phonelist.split("||");
        schoolinfo.licensetype=schoolinfo.licensetype.split("||");
        schoolinfo.cartype=schoolinfo.cartype.split("||");
        schoolinfo.schoolalbum=schoolinfo.schoolalbum.split("||");
        schoolinfo.responsiblelist=schoolinfo.responsiblelist.split("||");
        if(schoolinfo.responsiblelist&&schoolinfo.responsiblelist.length>0){
            schoolinfo.responsible=schoolinfo.responsiblelist[0];
        }
        return schoolinfo;
},
    getfiledinfo:function(req){
        filedinfo={
            fieldname:req.body.fieldname,
            logoimg:req.body.logimg,
            province:req.body.province,
            city:req.body.city,
            county:req.body.county,
            address:req.body.address,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            is_validation:req.body.is_validation,
            phone:req.body.phone,
            fieldlevel:req.body.fieldlevel,
            pictures:req.body.pictures,
            driveschool:req.body.schoolid
    }
        filedinfo.loc={type:"Point",coordinates:[filedinfo.longitude,filedinfo.latitude]};
        schoolinfo.pictures=filedinfo.pictures.split("||");

        return filedinfo;
    },
}

//====================================b班级管理
exports.saveClassType=function(req,res){

}

//=====================================训练场管理
exports.getTrainingFieldList=function(req,res){
    var shcoolid =req.query.schoolid;
    if (schoolid===undefined||schoolid==""){
      return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    trainingfiledModel.find({driveschool:new mongodb.ObjectId(schoolid)})
        .select("_id phone  driveschool fieldname")
        .exec(function(err,datalist){
            process.nextTick(function(){
               var filedlist=[];
                datalist.forEach(function(r,index){
                    onedata={
                        trainingfiledid: r._id,
                        schoolid: r.driveschool,
                        fieldname: r.fieldname,
                        phone: r.phone
                    }
                    filedlist.push(onedata);
                });
                return res.json(new BaseReturnInfo(1, "",filedlist) );
            })

    })

}
exports.saveTrainingField=function(req,res){
    fieldinfo=defaultFun.getfiledinfo(req);
     var trainfild= trainingfiledModel(fieldinfo);
    trainfild.save(function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0, "保存训练场出错："+err, "") );
        }else{
            return res.json(new BaseReturnInfo(1, "", "sucess") );
        }
    })
}
exports.getTrainingFieldbyId=function(req,res){
    var trainingfiledid=req.query.trainingfiledid;
    if (trainingfiledid===undefined||trainingfiledid==""){
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    };
    trainingfiledModel.findById(new mongodb.ObjectId(trainingfiledid),function(err,trainingfileddata){
        if(err){
            res.json(new BaseReturnInfo(0, "查询出错:"+err, ""));
        }
        if(!schooldata){
            res.json(new BaseReturnInfo(0, "没有查询到驾校", ""));
        }
        var trainingfiledidinfo={
            trainingfiledid: trainingfileddata._id,
            fieldname:trainingfileddata.fieldname,
            logoimg:trainingfileddata.logimg,
            province:trainingfileddata.province,
            city:trainingfileddata.city,
            county:trainingfileddata.county,
            address:trainingfileddata.address,
            is_validation:trainingfileddata.is_validation,
            phone:trainingfileddata.phone,
            fieldlevel:trainingfileddata.fieldlevel,
            pictures:trainingfileddata.pictures,
            schoolid:trainingfileddata.driveschool,
            latitude:trainingfileddata.latitude,
            longitude:req.body.longitude
        }
        res.json(new BaseReturnInfo(1, "", schoolinfo));
    })
}
exports.updateTrainingField=function(req,res){
    var trainingfiledid= req.body.trainingfiledid;
    if (trainingfiledid===undefined||trainingfiledid==""){
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    filedinfo=defaultFun.getfiledinfo(req);

    var conditions = {_id : trainingfiledid};
    req.body.updateDate = new Date();
    var update = {$set : filedinfo};
    trainingfiledModel.update(conditions, update,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0, "修改训练场出错："+err, "") );
        }else{
            return res.json(new BaseReturnInfo(1, "", "sucess") );
        }
    })
}

///=====================================驾校管理
exports.getSchoolist=function(req,res){
    var index=req.query.index?req.query.index:0;
    var schoolname=req.query.schoolname?req.query.schoolname:"";
    //
    schoolModel.find({"name":new RegExp(schoolname)})
        .select("_id name address  createtime")
        .skip((index-1)*10)
        .limit(10)
        .sort({createtime:-1})
        .exec(function(err,data) {
            defaultFun.getSchoolcount(schoolname,function (err, schoolcount) {
                var begintime = (new Date()).clearTime();
                var endtime = (new Date()).addDays(1).clearTime();
                var  schoolidlist=[];
                data.forEach(function(r,idnex){
                    schoolidlist.push(r._id);
                })
                schooldaysunmmary.find({
                    "summarytime": {$gte: begintime, $lte: endtime},
                    "driveschool": {"$in": schoolidlist}})
                    .select("_id  driveschool  applyingstudentcount reservationcoursecount complaintcount")
                    .exec(function (err, sunmmarydata) {
                    var schoolinfo=[];
                    data.forEach(function(r,index){
                        var summarydata=defaultFun.getSchoolSummaryinfo(r._id,sunmmarydata);
                        var onedata={
                            name: r.name,
                            shcoolid: r._id,
                            address: r.address,
                            createtime:r.createtime.toFormat("YYYY-MM-DD HH24:MI:SS"),
                            applyingstudentcount:summarydata.applyingstudentcount,
                            reservationcoursecount:summarydata.reservationcoursecount,
                            complaintcount:summarydata.complaintcount,
                        }
                        schoolinfo.push(onedata);
                    });
                    returninfo = {
                        schoolcount: schoolcount,
                        pagecount: Math.floor(schoolcount/10)+1,
                        schoollist: schoolinfo
                    }
                    res.json(new BaseReturnInfo(1, "", returninfo));
                })
            })
        });
}

exports.saveSchoolInfo=function(req,res){
    schoolinfo=defaultFun.getschoolinfo(req);
    var schoolmodel=new schoolModel(schoolinfo);
    schoolmodel.save(function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0, "保存驾校信息出错："+err, "") );
        }else{
            return res.json(new BaseReturnInfo(1, "", "sucess") );
        }
    })


}

exports.updateSchoolInfo=function(req,res){
    var schoolid= req.body.schoolid;
    if (schoolid===undefined||schoolid==""){
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    schoolinfo=defaultFun.getschoolinfo(req);

    var conditions = {_id : schoolid};
    req.body.updateDate = new Date();
    var update = {$set : schoolinfo};
    schoolModel.update(conditions, update,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0, "修改驾校信息出错："+err, "") );
        }else{
            return res.json(new BaseReturnInfo(1, "", "sucess") );
        }
    })


}

exports.getSchoolInfoById=function(req,res){
    var schoolid=req.query.schoolid;
    if (schoolid===undefined||schoolid==""){
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    schoolModel.findById(new mongodb.ObjectId(schoolid),function(err,schooldata){
        if(err){
            res.json(new BaseReturnInfo(0, "查询出错:"+err, ""));
        }
        if(!schooldata){
            res.json(new BaseReturnInfo(0, "没有查询到驾校", ""));
        }
        var schoolinfo={
            schoolid:schooldata._id,
            name:schooldata.name,
            logoimg:schooldata.logoimg.originalpic,
            province:schooldata.province,
            city:schooldata.city,
            county:schooldata.county,
            address:schooldata.address,
            responsiblelist:schooldata.responsiblelist,
            latitude:schooldata.latitude,
            longitude:schooldata.longitude,
            website:schooldata.website,
            email:schooldata.email,
            businesslicensenumber:schooldata.businesslicensenumber,
            organizationcode:schooldatay.organizationcode,
            registertime:schooldata.registertime,
            schoollevel:schooldata.schoollevel,
            is_validation:schooldata.is_validation,
            privilegelevel:schooldata.privilegelevel,
            studentcount:schooldata.studentcount,
            passingrate:schooldata.passingrate,
            examhallcount:schooldata.examhallcount,
            coachcount:schooldata.coachcount,
            carcount:schooldata.carcount,
            licensetype:schooldata.licensetype,
            cartype:schooldatay.cartype,
            vipserver:schooldata.vipserver,
            valueaddedservice:schooldata.valueaddedservice,
            superiorservice:schooldata.superiorservice,
            shuttleroute:schooldata.shuttleroute,
            introduction:schooldatay.introduction,
            schoolalbum:schooldata.schoolalbum,
            workbegintime:schooldata.workbegintime,
            workendtime:schooldata.workendtime,
            phonelist:schooldata.phonelist
        }
        res.json(new BaseReturnInfo(1, "", schoolinfo));
    })
}