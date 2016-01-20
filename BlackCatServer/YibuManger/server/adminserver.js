
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
var activtyModel= mongodb.ActivityModel;
var schooldaysunmmary=mongodb.SchoolDaySummaryModel;
var trainingfiledModel=mongodb.TrainingFieldModel;
var  coachmodel=mongodb.CoachModel;
var classtypemodel=mongodb.ClassTypeModel;
var usermodel=mongodb.UserModel;
var reservationmodel=mongodb.ReservationModel;
var cache=require("../../Common/cache");
require('date-utils');
var _ = require("underscore");
exports.getStatitic=function(req,res){

}

 var defaultFun={
     getModelCount:function(obj,searchinfo,callback){
         obj.count(searchinfo,function(err,count){
             if(err){
                 return callback(err);
             }
             return callback(null,count);
         })
     },
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
             Seniority:req.body.Seniority?req.body.Seniority:1,
             passrate:req.body.passrate?req.body.passrate:99,
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
     getActivity:function(req){
         activtyinfo={
             name:req.body.name?req.body.name:"",
             titleimg:req.body.titleimg?req.body.titleimg:"",
             contenturl:req.body.contenturl?req.body.contenturl:"",
             begindate:req.body.begindate?req.body.begindate:new Date(),
             enddate:req.body.enddate?req.body.enddate:new Date(),
             province:req.body.province?req.body.province:"",
             city:req.body.province?req.body.city:"",
             county:req.body.province?req.body.county:"",
             address:req.body.address?req.body.address:"",
         }
         return activtyinfo;
     },
     getClasstype:function(req){
         classtype={
             schoolid:req.body.schoolid,
             classname:req.body.classname?req.body.classname:"",  // 班级名称
             begindate:req.body.begindate?req.body.begindate:new Date(), // 班级开始时间
             enddate:req.body.enddate?req.body.enddate:new Date(),  // 班级结束时间
             is_using:req.body.is_using?req.body.is_using:false,  // 该课程是否正在使用
             is_vip:false,  // 该课程是否是VIP课程
             //carmodel:{modelsid:Number,name:String,code:String},  // 该 班级所有车型（驾照类型）（手动自动）
             cartype:req.body.cartype?req.body.cartype:"", //车品牌  富康、奔驰等
             classdesc:req.body.classdesc?req.body.classdesc:"",  // 课程描述
             vipserverlist:req.body.vipserverlist?req.body.vipserverlist:[], // 该课程提供的vip 服务列表{接送、包过，1对1}
             price:req.body.price?req.body.price:"", // 价格
             onsaleprice:req.body.onsaleprice?req.body.onsaleprice:0, // 优化价格,
             originalprice:req.body.originalprice?req.body.originalprice:0, // 原价
             systemretains:req.body.systemretains?req.body.systemretains:0,// 系统预留
             feedbackuser:req.body.feedbackuser?req.body.feedbackuser:0,// 返给用户
             rewardmoney:req.body.rewardmoney?req.body.rewardmoney:0,// 系统奖励
             classchedule:req.body.classchedule?req.body.classchedule:"", // 授课日程   周日/平日/
         }
         classtype.carmodel=basedatafun.getcarmodel(req.body.carmodel?req.body.carmodel:0);
         classtype.is_vip=classtype.vipserverlist.length>0?true:false;
         //console.log(classtype);
         return classtype;
     }
 }

// 订单管理
exports.getorderlist=function(req,res){
    var schoolid =req.query.schoolid;
    var index=req.query.index?req.query.index:0;
    var limit=req.query.limit?req.query.limit:10;
    if (schoolid===undefined||schoolid==""){
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    };
    var searchinfo={
        "driveschool":new mongodb.ObjectId(schoolid)
    }
    reservationmodel.find(searchinfo)
        .select("userid coachid reservationstate reservationcreatetime begintime endtime subject")
        .populate("userid","_id name mobile")
        .populate("coachid","_id name mobile")
        .skip((index-1)*limit)
        .limit(limit)
        .sort({reservationcreatetime:-1})
        .exec(function(err,data){
            defaultFun.getModelCount(reservationmodel,searchinfo,function (err, ordercount) {
                returninfo = {
                    pageInfo: {
                        totalItems: ordercount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(ordercount / limit) + 1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        })
}

//====================================b班级管理
exports.saveClassType=function(req,res){
    classinfo=defaultFun.getClasstype(req);
    var classtypeid= req.body.classtypeid;
    if (classtypeid===undefined||classtypeid==""){
        var classtype= new  classtypemodel(classinfo);
        classtype.save(function(err,data){
            if(err){
                return res.json(new BaseReturnInfo(0, "保存班型："+err, "") );
            }else{
                return res.json(new BaseReturnInfo(1, "", "sucess") );
            }
        })


    }
    else {
        var conditions = {_id : classtypeid};
        var update = {$set : classinfo};
        classtypemodel.update(conditions, update,function(err,data){
            if(err){
                return res.json(new BaseReturnInfo(0, "保存班型："+err, "") );
            }else{
                return res.json(new BaseReturnInfo(1, "", "sucess") );
            }
        })
    }

}
exports.classtypelist=function(req,res){
    var schoolid =req.query.schoolid;
    if (schoolid===undefined||schoolid==""){
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    };
    classtypemodel.find({schoolid:new mongodb.ObjectId(schoolid)})
        //.select("_id phone  driveschool fieldname address responsible")
        .exec(function(err,datalist){
            process.nextTick(function(){
                var filedlist=[];
                datalist.forEach(function(r,index){
                    onedata={
                        classtypeid: r._id,
                        classname: r.classname,
                        begindate: r.begindate,
                        enddate:r.enddate,
                        carmodel: r.carmodel,
                        applycount: r.applycount,
                        price: r.price,
                        classchedule: r.classchedule,
                        onsaleprice: r.onsaleprice
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

};
exports.getclasstypebyid=function(req,res){
    var classtypeid=req.query.classtypeid;
    if (classtypeid===undefined||classtypeid==""){
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    };
    classtypemodel.findById(new mongodb.ObjectId(classtypeid),function(err,classdata){
        if(err){
            return  res.json(new BaseReturnInfo(0, "查询出错:"+err, ""));
        }
        if(!classdata){
            return   res.json(new BaseReturnInfo(0, "没有查询到教练", ""));
        }
        var classtypeinfo={
            classtypeid:classdata._id,
            schoolid:classdata.schoolid,
            classname:classdata.classname,  // 班级名称
            begindate:classdata.begindate, // 班级开始时间
            enddate:classdata.enddate,  // 班级结束时间
            is_using:classdata.is_using,  // 该课程是否正在使用
            carmodel:classdata.carmodel.modelsid,  // 该 班级所有车型（驾照类型）（手动自动）
            cartype:classdata.cartype, //车品牌  富康、奔驰等
            classdesc:classdata.classdesc,  // 课程描述
            vipserverlist:classdata.vipserverlist, // 该课程提供的vip 服务列表{接送、包过，1对1}
            price:classdata.price, // 价格
            onsaleprice:classdata.onsaleprice, // 优化价格,
            originalprice:classdata.originalprice, // 原价
            systemretains:classdata.systemretains,// 系统预留
            feedbackuser:classdata.feedbackuser,// 返给用户
            rewardmoney:classdata.rewardmoney,// 系统奖励
            classchedule:classdata.classchedule, // 授课日程   周日/平日/
        };
        return  res.json(new BaseReturnInfo(1, "", classtypeinfo));
    })
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

//  活动管理 ===
exports.getactivitybyid=function(req,res){
    var activityid=req.query.activityid;
    if (activityid===undefined||activityid==""){
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    };
    activtyModel.findById(new mongodb.ObjectId(activityid),function(err,activityinfo) {
        if (err) {
            res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!activityinfo) {
            res.json(new BaseReturnInfo(0, "没有查询到活动", ""));
        }
        var activity={
            activityid:activityinfo._id,
            name:activityinfo.name,
            titleimg:activityinfo.titleimg,
            contenturl:activityinfo.contenturl,
            begindate:activityinfo.begindate,
            enddate:activityinfo.enddate,
            province:activityinfo.province,
            city:activityinfo.province,
            county:activityinfo.province,
            address:activityinfo.address,
        }
        res.json(new BaseReturnInfo(1, "", activity));
    })
}
   //保存活动信息
exports.updateactivty= function(req,res){
    activtyfo=defaultFun.getActivity(req);
    var activityid= req.body.activityid;
    if (activityid===undefined||activityid==""){
        var saveactivity= new  activtyModel(activtyfo);
            saveactivity.save(function(err,data){
                if(err){
                    return res.json(new BaseReturnInfo(0, "保存教练出错："+err, "") );
                }else{
                    return res.json(new BaseReturnInfo(1, "", "sucess") );
                }
            })


    }
    else {
        var conditions = {_id : activityid};
        var update = {$set : activtyfo};
        activtyModel.update(conditions, update,function(err,data){
            if(err){
                return res.json(new BaseReturnInfo(0, "修改教练出错："+err, "") );
            }else{
                return res.json(new BaseReturnInfo(1, "", "sucess") );
            }
        })
    }
}
exports.getactivtylist=function(req,res){
    var index=req.query.index?req.query.index:0;
    var limit=req.query.limit?req.query.limit:10;
    var name=req.query.searchKey?req.query.searchKey:"";
    activtyModel.find({"name":new RegExp(name)})
        //.select("_id name address  createtime")
        .skip((index-1)*limit)
        .limit(limit)
        .sort({createtime:-1})
        .exec(function(err,data) {
            defaultFun.getModelCount(activtyModel,{"name":new RegExp(name)},function (err,activitycount) {
                activityinfo= _.map(data,function(item,index){
                    info={
                        name:item.name,
                        activityid:item._id,
                        contenturl:item.contenturl,
                        begindate:item.begindate,
                        enddate:item.enddate,
                        province:item.province,
                        city:item.city,
                    }
                    return info;
                })
                returninfo = {
                    pageInfo:{
                        totalItems: activitycount,
                        currentPage:index,
                        limit:limit,
                        pagecount: Math.floor(activitycount/limit )+1
                    },
                    datalist: activityinfo
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
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
            var temptraining= trainingfiledModel();
            temptraining.fieldname=data.name+"本部练车场";
            temptraining.fieldlevel=data.schoollevel;
            temptraining.is_validation=true;
            temptraining.latitude=data.latitude;
            temptraining.longitude=data.longitude;
            temptraining.loc=data.loc;
            temptraining.province=data.province;
            temptraining.city=data.city;
            temptraining.county=data.county;
            temptraining.address=data.address;
            temptraining.fielddesc="本部练车场";
            temptraining.driveschool=data._id;
            temptraining.save(function(err,data){});
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

//==========================================主页信息
exports.getApplySchoolinfo=function(req,res){
    var index=req.query.index?req.query.index:0;
    var limit=req.query.limit?req.query.limit:10;
    var name=req.query.searchKey?req.query.searchKey:"";
    var searchinfo={applystate:1};
    if (name!=""){
        searchinfo={"name":new RegExp(name)};
    }
    usermodel.find(searchinfo)
        .select("_id name address mobile carmodel  referrerfcode  applystate applyinfo  applyschoolinfo  " +
            "applycoachinfo applyclasstypeinfo  createtime")
        .skip((index-1)*limit)
        .limit(limit)
        .sort({"applyinfo.applytime":-1})
        .exec(function(err,data) {
            defaultFun.getModelCount(usermodel,searchinfo,function (err, usercount) {
                returninfo = {
                    pageInfo:{
                        totalItems: usercount,
                        currentPage:index,
                        limit:limit,
                        pagecount: Math.floor(usercount/limit )+1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
}