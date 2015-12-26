
/**
 * Created by v-yaf_000 on 2015/12/14.
 */
var mongodb = require('../../models/mongodb.js');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var commondata = require('../../Config/commondata.js');
var appTypeEmun=require("../../custommodel/emunapptype");
var appWorkTimes=commondata.worktimes;
var  basedatafun=require("./basedatafun");
var schoolModel=mongodb.DriveSchoolModel;
var schooldaysunmmary=mongodb.SchoolDaySummaryModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
var  coachmodel=mongodb.CoachModel;
var cache=require("../../Common/cache");
require('date-utils');
var _ = require("underscore");
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
     getCoachinfo:function(req){
         coachinfo={
             name:req.body.name,
             mobile:req.body.mobile,
             headportrait:{},
             address:req.body.address,
             introduction:req.body.introduction,
             subject:req.body.subject,
             is_lock:false,
             validationstate:req.body.validationstate,
             driveschool:req.body.driveschool,
             Seniority:req.body.Seniority,
             passrate:req.body.passrate,
             studentcount:req.body.studentcount,
             workweek:req.body.workweek,
             begintimeint:req.body.begintimeint,
             endtimeint:req.body.endtimeint,
             coursestudentcount:req.body.coursestudentcount?req.body.coursestudentcount:1,
             idcardnumber:req.body.idcardnumber,
             drivinglicensenumber:req.body.drivinglicensenumber,
             coachnumber:req.body.coachnumber,
             starlevel:parseInt(req.body.starlevel)?parseInt(req.body.starlevel):2,
             platenumber:req.body.platenumber,
             is_shuttle:true,
             shuttlemsg:req.body.shuttlemsg,
             serverclasslist:req.body.serverclasslist,
             trainfield:req.body.trainfield,
             carmodel:req.body.carmodel
         };

         coachinfo.headportrait.originalpic=req.body.logoimg;
         coachinfo.subject=_.map(coachinfo.subject,function(item,i){
             return  basedatafun.getsubject(item);
         });
         coachinfo.carmodel=basedatafun.getcarmodel(coachinfo.carmodel);
         coachinfo.is_validation=coachinfo.validationstate==3?true:false;
         var weekdesc="";
         if (coachinfo.workweek.length==7){
             weekdesc="全周";
         }
         else{
             for(i=0;i<coachinfo.workweek.length;i++){
                 if(appTypeEmun.weeks[coachinfo.workweek[i]-1]!=undefined){
                     weekdesc=weekdesc+appTypeEmun.weeks[coachinfo.workweek[i]-1];}
             }
         }
         weekdesc =weekdesc +" "+coachinfo.begintimeint+":00--"+coachinfo.endtimeint+":00";

         coachinfo.worktimespace={};
         coachinfo.worktimedesc=weekdesc;
         coachinfo.worktimespace.begintimeint=parseInt(coachinfo.begintimeint);
         coachinfo.worktimespace.endtimeint=parseInt(coachinfo.endtimeint);
             var worktimes=[];
             for(var i=parseInt(coachinfo.begintimeint);i<=parseInt(coachinfo.endtimeint);i++){
                 appWorkTimes.forEach(function(r,index){
                     if(r.begintime== i.toString()+":00:00"){
                         worktimes.push(appWorkTimes[index]);
                     }
                 })
             }
         coachinfo.worktime=worktimes;
         return coachinfo;

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
exports.saveCoachInfo=function(req,res){
    coachinfo=defaultFun.getCoachinfo(req);
    var coachid= req.body.coachid;
    if (coachid===undefined||coachid==""){
        var savecoach= new  coachmodel(coachinfo);
       basedatafun.getUserCount(function(err,countdata){
            savecoach.displaycoachid=countdata.value.displayid;
            savecoach.invitationcode=countdata.value.invitationcode;
            savecoach.loc.coordinates=[savecoach.longitude,savecoach.latitude];
            savecoach.save(function(err,data){
                if(err){
                    return res.json(new BaseReturnInfo(0, "保存教练出错："+err, "") );
                }else{
                    return res.json(new BaseReturnInfo(1, "", "sucess") );
                }
            })
        })

    }
    else {
        var conditions = {_id : coachid};
        var update = {$set : coachinfo};
        coachmodel.update(conditions, update,function(err,data){
            if(err){
                return res.json(new BaseReturnInfo(0, "修改教练出错："+err, "") );
            }else{
                return res.json(new BaseReturnInfo(1, "", "sucess") );
            }
        })
    }
};
exports.getcoachbyid=function(req,res){
    var coachid=req.query.coachid;
    if (coachid===undefined||coachid==""){
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    };
    console.log(coachid);
    coachmodel.findById(new mongodb.ObjectId(coachid),function(err,coachdata){
        if(err){
          return  res.json(new BaseReturnInfo(0, "查询出错:"+err, ""));
        }
        if(!coachdata){
         return   res.json(new BaseReturnInfo(0, "没有查询到教练", ""));
        }
        var coachinfo={
            coachid:coachdata._id,
            name:coachdata.name,
            mobile:coachdata.mobile,
            logoimg:coachdata.headportrait.originalpic,
            address:coachdata.address,
            introduction:coachdata.introduction,
            subject:[],
            validationstate:coachdata.validationstate,
            driveschool:coachdata.driveschool,
            Seniority:coachdata.Seniority,
            passrate:coachdata.passrate,
            studentcount:coachdata.studentcount,
            workweek:coachdata.workweek,
            begintimeint:coachdata.worktimespace.begintimeint,
            endtimeint:coachdata.worktimespace.endtimeint,
            coursestudentcount:coachdata.coursestudentcount,
            idcardnumber:coachdata.idcardnumber,
            drivinglicensenumber:coachdata.drivinglicensenumber,
            coachnumber:coachdata.coachnumber,
            starlevel:coachdata.starlevel,
            platenumber:coachdata.platenumber,
            serverclasslist:req.body.serverclasslist,
            trainfield:coachdata.trainfield,
            carmodel:coachdata.carmodel.modelsid,
        };
        for(i=0;i<coachdata.subject.length;i++){
            coachinfo.subject.push(coachdata.subject[i].subjectid);
        }
      return  res.json(new BaseReturnInfo(1, "", coachinfo));
    })
}

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