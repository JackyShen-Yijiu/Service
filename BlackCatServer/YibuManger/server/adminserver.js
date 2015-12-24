
/**
 * Created by v-yaf_000 on 2015/12/14.
 */
var mongodb = require('../../models/mongodb.js');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var schoolModel=mongodb.DriveSchoolModel;
var schooldaysunmmary=mongodb.SchoolDaySummaryModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
var  coachmodel=mongodb.CoachModel;
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
    getCoachcount:function(searchinfo,callback){
        coachmodel.count(searchinfo,function(err,count){
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
            logoimg:{},
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
        };
        schoolinfo.loc={type:"Point",coordinates:[schoolinfo.longitude,schoolinfo.latitude]};
        schoolinfo.logoimg.originalpic=req.body.logoimg;
        //schoolinfo.licensetype=schoolinfo.licensetype?schoolinfo.licensetype.split("||"):undefined;
        //schoolinfo.cartype=schoolinfo.cartype?schoolinfo.cartype.split("||"):undefined;
        //.schoolalbum=schoolinfo.schoolalbum?schoolinfo.schoolalbum.split("||"):undefined;

        //schoolinfo.responsiblelist=schoolinfo.responsiblelist?schoolinfo.responsiblelist.split("||"):undefined;
        if(schoolinfo.responsiblelist&&schoolinfo.responsiblelist.length>0){
            schoolinfo.responsible=schoolinfo.responsiblelist[0];
        }

        return schoolinfo;
},
    getfiledinfo:function(req){
        filedinfo={
            fieldname:req.body.fieldname,
            logoimg:req.body.logoimg,
            province:req.body.province,
            city:req.body.city,
            county:req.body.county,
            address:req.body.address,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            is_validation:req.body.is_validation,
            responsible:req.body.responsible,
            phone:req.body.phone,
            fieldlevel:req.body.fieldlevel,
            pictures:req.body.pictures,
            fielddesc:req.body.fielddesc,
            driveschool:req.body.schoolid,
            fielddesc:req.body.fielddesc,
    }
        filedinfo.loc={type:"Point",coordinates:[filedinfo.longitude,filedinfo.latitude]};
        return filedinfo;
    },
}

//====================================b班级管理
exports.saveClassType=function(req,res){

}
///====================================教练管理
exports.getCoachlist=function(req,res){
    var schoolid =req.query.schoolid;
    var index=req.query.index?req.query.index:0;
    var limit=req.query.limit?req.query.limit:10;
    var schoolname=req.query.searchKey?req.query.searchKey:"";
    var searchinfo={
        "driveschool":schoolid,
        "name":new RegExp(schoolname)
    }
    coachmodel.find(searchinfo)
        .select("_id name mobile  createtime carmodel trainfieldlinfo")
        .skip((index-1)*limit)
        .limit(limit)
        .sort({createtime:-1})
        .exec(function(err,data) {
            defaultFun.getCoachcount(searchinfo,function (err, coachcount) {
                var coachlist=[];
                data.forEach(function (r, index) {
                    var onedata = {
                        name: r.name,
                        coachid: r._id,
                        mobile: r.mobile,
                        carmodel: r.carmodel,
                        trainfieldlinfo: r.trainfieldlinfo,
                        createtime: r.createtime.toFormat("YYYY-MM-DD HH24:MI:SS")
                    }
                    coachlist.push(onedata);
                });
                returninfo = {
                    pageInfo: {
                        totalItems: coachcount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(coachcount / limit) + 1
                    },
                    datalist: coachlist
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            });
        })
};
//保存教练信息
exports.saveCoachInfo=function(req,res){};
//=====================================训练场管理
exports.getTrainingFieldList=function(req,res){
    var schoolid =req.query.schoolid;
    if (schoolid===undefined||schoolid==""){
      return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    trainingfiledModel.find({driveschool:new mongodb.ObjectId(schoolid)})
        .select("_id phone  driveschool fieldname address responsible")
        .exec(function(err,datalist){
            process.nextTick(function(){
               var filedlist=[];
                datalist.forEach(function(r,index){
                    onedata={
                        trainingfiledid: r._id,
                        schoolid: r.driveschool,
                        fieldname: r.fieldname,
                        address:r.address,
                        responsible: r.responsible,
                        phone: r.phone
                    }
                    filedlist.push(onedata);
                });
                returninfo = {
                    pageInfo:{
                        totalItems: filedlist.length,
                        currentPage:1,
                        limit:filedlist.length,
                        //pagecount: Math.floor(filedlist.length/limit )+1
                    },
                    datalist: filedlist
                }
                return res.json(new BaseReturnInfo(1, "",returninfo) );
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
        if(!trainingfileddata){
            res.json(new BaseReturnInfo(0, "没有查询到练车场", ""));
        }
        var trainingfiledidinfo={
            trainingfiledid: trainingfileddata._id,
            fieldname:trainingfileddata.fieldname,
            logoimg:trainingfileddata.logoimg,
            province:trainingfileddata.province,
            city:trainingfileddata.city,
            county:trainingfileddata.county,
            address:trainingfileddata.address,
            is_validation:trainingfileddata.is_validation,
            phone:trainingfileddata.phone,
            fieldlevel:trainingfileddata.fieldlevel,
            pictures:trainingfileddata.pictures,
            responsible:trainingfileddata.responsible,
            schoolid:trainingfileddata.driveschool,
            latitude:trainingfileddata.latitude,
            longitude:trainingfileddata.longitude,
            fielddesc:trainingfileddata.fielddesc,
        }
        res.json(new BaseReturnInfo(1, "", trainingfiledidinfo));
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
    var limit=req.query.limit?req.query.limit:10;
    var schoolname=req.query.searchKey?req.query.searchKey:"";
    schoolModel.find({"name":new RegExp(schoolname)})
        .select("_id name address  createtime")
        .skip((index-1)*limit)
        .limit(limit)
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
                        pageInfo:{
                            totalItems: schoolcount,
                            currentPage:index,
                            limit:limit,
                            pagecount: Math.floor(schoolcount/limit )+1
                        },
                        datalist: schoolinfo
                    }
                    res.json(new BaseReturnInfo(1, "", returninfo));
                })
            })
        });
}

exports.saveSchoolInfo=function(req,res){
    schoolinfo=defaultFun.getschoolinfo(req);
    console.log(schoolinfo);
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
    //console.log(req.body);
    try {
        var schoolid = req.body.schoolid;
        if (schoolid === undefined || schoolid == "") {
            res.json(new BaseReturnInfo(0, "参数错误", ""));
        }
        schoolinfo = defaultFun.getschoolinfo(req);
        console.log(schoolinfo);
        var conditions = {_id: schoolid};
        req.body.updateDate = new Date();
        var update = {$set: schoolinfo};
        schoolModel.update(conditions, update,{safe: true}, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改驾校信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
    catch (ex){
        return res.json(new BaseReturnInfo(0, "修改驾校信息出错：" + ex.message, ""));
    }


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
            organizationcode:schooldata.organizationcode,
            registertime:schooldata.registertime,
            schoollevel:schooldata.schoollevel,
            is_validation:schooldata.is_validation?Number(schooldata.is_validation):0,
            privilegelevel:schooldata.privilegelevel,
            studentcount:schooldata.studentcount,
            passingrate:schooldata.passingrate,
            examhallcount:schooldata.examhallcount,
            coachcount:schooldata.coachcount,
            carcount:schooldata.carcount,
            licensetype:schooldata.licensetype,
            cartype:schooldata.cartype,
            vipserver:schooldata.vipserver,
            valueaddedservice:schooldata.valueaddedservice,
            superiorservice:schooldata.superiorservice,
            shuttleroute:schooldata.shuttleroute,
            introduction:schooldata.introduction,
            schoolalbum:schooldata.schoolalbum,
            workbegintime:schooldata.workbegintime,
            workendtime:schooldata.workendtime,
            phonelist:schooldata.phonelist
        }
        res.json(new BaseReturnInfo(1, "", schoolinfo));
    })
}