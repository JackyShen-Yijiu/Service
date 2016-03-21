/**
 * Created by v-yaf_000 on 2015/12/14.
 */
var DbOpt = require("../models/Dbopt");
var settings = require("../models/config/settings");
var mongodb = require('../../models/mongodb.js');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var commondata = require('../../Config/commondata.js');
var appTypeEmun = require("../../custommodel/emunapptype");
var appWorkTimes = commondata.worktimes;
var basedatafun = require("./basedatafun");
var schoolModel = mongodb.DriveSchoolModel;
var activtyModel = mongodb.ActivityModel;
var industryNewsModel = mongodb.IndustryNewsModel;
var merchantmodel = mongodb.MerChantModel;
var mallProductsmodel = mongodb.MallProdcutsModel;
var schooldaysunmmary = mongodb.SchoolDaySummaryModel;
var trainingfiledModel = mongodb.TrainingFieldModel;
var coachmodel = mongodb.CoachModel;
var usermodel = mongodb.UserModel;
var classtypemodel = mongodb.ClassTypeModel;
var headMastermodel = mongodb.HeadMasterModel;
var userfeedback = mongodb.FeedBackModel;
//var usermodel=mongodb.UserModel;
var reservationmodel = mongodb.ReservationModel;
var headMasterOperation = require("../../Server/headmaster_operation_server");
var userCenterServer = require("../../Server/headMaste_Server");
var userserver = require("../../Server/user_server");
var courseserver = require("../../Server/course_server");
var cache = require("../../Common/cache");
var AdminUser = require("../../models/AdminUser");
require('date-utils');
var _ = require("underscore");
var eventproxy = require('eventproxy');
var crypto = require('crypto');
var fs = require('fs');
var xlsx = require('node-xlsx');
var busRouteModel = mongodb.SchoolBusRouteModel;
exports.getStatitic = function (req, res) {

}

var defaultFun = {
    getModelCount: function (obj, searchinfo, callback) {
        obj.count(searchinfo, function (err, count) {
            if (err) {
                return callback(err);
            }
            return callback(null, count);
        })
    },
    getSchoolcount: function (schoolname, callback) {
        schoolModel.count({"name": new RegExp(schoolname)}, function (err, count) {
            if (err) {
                return callback(err);
            }
            return callback(null, count);
        })
    },
    getCoachcount: function (searchinfo, callback) {
        coachmodel.count(searchinfo, function (err, count) {
            if (err) {
                return callback(err);
            }
            return callback(null, count);
        })
    },
    getSchoolSummaryinfo: function (shcoolid, summarylist) {
        var summarydata = {
            applyingstudentcount: 0,
            reservationcoursecount: 0,
            complaintcount: 0
        };
        for (i = 0; i < summarylist.length; i++) {
            if (summarylist[i].driveschool == shcoolid) {
                summarydata.applyingstudentcount = summarylist[i].applyingstudentcount;
                summarydata.reservationcoursecount = summarylist[i].reservationcoursecount;
                summarydata.complaintcount = summarylist[i].complaintcount;
                break;
            }
        }
        return summarydata;
    },
    getschoolinfo: function (req) {
        var schoolinfo = {
            name: req.body.name,
            logoimg: {},
            province: req.body.province,
            city: req.body.city,
            county: req.body.county,
            address: req.body.address,
            responsiblelist: req.body.responsiblelist,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            website: req.body.website ? req.body.website : "",
            email: req.body.email ? req.body.email : "",
            businesslicensenumber: req.body.businesslicensenumber ? req.body.businesslicensenumber : "",
            organizationcode: req.body.organizationcode ? req.body.organizationcode : "",
            registertime: req.body.registertime,
            schoollevel: req.body.schoollevel,
            is_validation: req.body.is_validation,
            privilegelevel: req.body.privilegelevel,
            studentcount: req.body.studentcount,
            passingrate: req.body.passingrate ? req.body.passingrate : 90,
            examhallcount: req.body.examhallcount,
            coachcount: req.body.coachcount,
            carcount: req.body.carcount,
            licensetype: req.body.licensetype,
            cartype: req.body.cartype,
            vipserver: req.body.vipserver,
            valueaddedservice: req.body.valueaddedservice,
            superiorservice: req.body.superiorservice,
            shuttleroute: req.body.shuttleroute,
            introduction: req.body.introduction,
            schoolalbum: req.body.schoolalbum,
            workbegintime: req.body.workbegintime,
            workendtime: req.body.workendtime,
            phonelist: req.body.phonelist,
            phone: req.body.phone ? req.body.phone : "",
            shortname: req.body.shortname ? req.body.shortname : "",
            examurl: req.body.examurl ? req.body.examurl : "",
            querycoursehoururl: req.body.shortname ? req.body.querycoursehoururl : "",
            examroomname: req.body.examroomname ? req.body.examroomname : "",
            pictures_path: req.body.pictures_path
        };
        schoolinfo.loc = {type: "Point", coordinates: [schoolinfo.longitude, schoolinfo.latitude]};
        schoolinfo.logoimg.originalpic = req.body.logoimg;
        schoolinfo.worktime = schoolinfo.workbegintime + ":00--" + schoolinfo.workendtime + ":00";
        //schoolinfo.licensetype=schoolinfo.licensetype?schoolinfo.licensetype.split("||"):undefined;
        //schoolinfo.cartype=schoolinfo.cartype?schoolinfo.cartype.split("||"):undefined;
        //.schoolalbum=schoolinfo.schoolalbum?schoolinfo.schoolalbum.split("||"):undefined;

        //schoolinfo.responsiblelist=schoolinfo.responsiblelist?schoolinfo.responsiblelist.split("||"):undefined;
        if (schoolinfo.responsiblelist && schoolinfo.responsiblelist.length > 0) {
            schoolinfo.responsible = schoolinfo.responsiblelist[0];
        }

        return schoolinfo;
    },
    getfiledinfo: function (req) {
        filedinfo = {
            fieldname: req.body.fieldname,
            logoimg: req.body.logoimg,
            province: req.body.province,
            city: req.body.city,
            county: req.body.county,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            is_validation: req.body.is_validation,
            responsible: req.body.responsible,
            phone: req.body.phone,
            fieldlevel: req.body.fieldlevel,
            pictures: req.body.pictures,
            fielddesc: req.body.fielddesc,
            driveschool: req.body.schoolid,
            pictures: req.body.pictures,

        }
        filedinfo.loc = {type: "Point", coordinates: [filedinfo.longitude, filedinfo.latitude]};
        return filedinfo;
    },
    getStudentinfo: function (req, callback) {
        studentinfo = {
            name: req.body.name,
            headportrait: req.body.headportrait,
            gender: req.body.gender ? req.body.gender : "",
            signature: req.body.signature ? req.body.signature : "",
            mobile: req.body.mobile,
            address: req.body.address ? req.body.address : "",
            idcardnumber: req.body.idcardnumber ? req.body.idcardnumber : "",
            applyclasstype: req.body.applyclasstype,
            carmodel: req.body.carmodel,
            subject: req.body.subject,
            applyschool: req.session.schooldata._id,
            subjecttwo: req.body.subjecttwo,
            subjectthree: req.body.subjectthree,
            applyschoolinfo: {},
            applyclasstypeinfo: {},
        }
        studentinfo.carmodel = basedatafun.getcarmodel(studentinfo.carmodel.modelsid);
        studentinfo.subject = basedatafun.getsubject(studentinfo.subject.subjectid);
        studentinfo.applyschoolinfo.id = req.session.schooldata._id;
        studentinfo.applyschoolinfo.name = req.session.schooldata.name;
        if (studentinfo.applyclasstype != undefined && studentinfo.applyclasstype.length > 0) {
            basedatafun.getclasstypebyid(studentinfo.applyclasstype, function (err, data) {
                if (data) {
                    studentinfo.applyclasstypeinfo.id = data._id;
                    studentinfo.applyclasstypeinfo.name = data.classname;
                    studentinfo.applyclasstypeinfo.price = data.price;

                }
                return callback(studentinfo);
            })
        } else {
            return callback(studentinfo);
        }
    },
    getCoachinfo: function (req, callback) {
        coachinfo = {
            trainfieldlinfo: {},
            name: req.body.name,
            mobile: req.body.mobile,
            headportrait: {},
            address: req.body.address,
            introduction: req.body.introduction ? req.body.introduction : "",
            subject: req.body.subject,
            is_lock: false,
            validationstate: req.body.validationstate,
            driveschool: req.body.driveschool,
            Seniority: req.body.Seniority ? req.body.Seniority : 1,
            passrate: req.body.passrate ? req.body.passrate : 99,
            studentcount: req.body.studentcount,
            workweek: req.body.workweek,
            begintimeint: req.body.begintimeint,
            endtimeint: req.body.endtimeint,
            coursestudentcount: req.body.coursestudentcount ? req.body.coursestudentcount : 1,
            idcardnumber: req.body.idcardnumber ? req.body.idcardnumber : "",
            drivinglicensenumber: req.body.drivinglicensenumber ? req.body.drivinglicensenumber : "",
            coachnumber: req.body.coachnumber ? req.body.coachnumber : "",
            starlevel: parseInt(req.body.starlevel) ? parseInt(req.body.starlevel) : 2,
            platenumber: req.body.platenumber ? req.body.platenumber : "",
            is_shuttle: true,
            shuttlemsg: req.body.shuttlemsg ? req.body.shuttlemsg : "",
            serverclasslist: req.body.serverclasslist ? req.body.serverclasslist : [],
            trainfield: req.body.trainfield,
            carmodel: req.body.carmodel,
            driveschoolinfo: {}
        };

        coachinfo.driveschoolinfo.id = req.session.schooldata._id;
        coachinfo.driveschoolinfo.name = req.session.schooldata.name;
        coachinfo.headportrait.originalpic = req.body.logoimg;
        coachinfo.subject = _.map(coachinfo.subject, function (item, i) {
            return basedatafun.getsubject(item);
        });
        coachinfo.carmodel = basedatafun.getcarmodel(coachinfo.carmodel);
        coachinfo.is_validation = coachinfo.validationstate == 3 ? true : false;
        var weekdesc = "";
        if (coachinfo.workweek.length == 7) {
            weekdesc = "全周";
        }
        else {
            for (i = 0; i < coachinfo.workweek.length; i++) {
                if (appTypeEmun.weeks[coachinfo.workweek[i] - 1] != undefined) {
                    weekdesc = weekdesc + appTypeEmun.weeks[coachinfo.workweek[i] - 1];
                }
            }
        }
        weekdesc = weekdesc + " " + coachinfo.begintimeint + ":00--" + coachinfo.endtimeint + ":00";

        coachinfo.worktimespace = {};
        coachinfo.worktimedesc = weekdesc;
        coachinfo.worktimespace.begintimeint = parseInt(coachinfo.begintimeint);
        coachinfo.worktimespace.endtimeint = parseInt(coachinfo.endtimeint);
        var worktimes = [];
        for (var i = parseInt(coachinfo.begintimeint); i <= parseInt(coachinfo.endtimeint); i++) {
            appWorkTimes.forEach(function (r, index) {
                if (r.begintime == i.toString() + ":00:00") {
                    worktimes.push(appWorkTimes[index]);
                }
            })
        }
        coachinfo.worktime = worktimes;
        coachinfo.latitude = req.session.schooldata.latitude;
        coachinfo.longitude = req.session.schooldata.longitude;
        coachinfo.loc = req.session.schooldata.loc;
        coachinfo.province = req.session.schooldata.province;
        coachinfo.city = req.session.schooldata.city;
        if (coachinfo.trainfield != undefined && coachinfo.trainfield.length > 0) {
            basedatafun.gettrainingfiledbyid(coachinfo.trainfield, function (err, data) {
                console.log(data);
                if (data) {
                    coachinfo.trainfieldlinfo.name = data.fieldname;
                    coachinfo.trainfieldlinfo.id = data._id;
                }
                return callback(coachinfo);
            })
        } else {
            return callback(coachinfo);
        }

    },
    getActivity: function (req) {
        activtyinfo = {
            name: req.body.name ? req.body.name : "",
            titleimg: req.body.titleimg ? req.body.titleimg : "",
            contenturl: req.body.contenturl ? req.body.contenturl : "",
            begindate: req.body.begindate ? req.body.begindate : new Date(),
            enddate: req.body.enddate ? req.body.enddate : new Date(),
            province: req.body.province ? req.body.province : "",
            city: req.body.province ? req.body.city : "",
            county: req.body.province ? req.body.county : "",
            address: req.body.address ? req.body.address : "",
        }
        return activtyinfo;
    },
    getClasstype: function (req) {
        classtype = {
            schoolid: req.body.schoolid,
            classname: req.body.classname ? req.body.classname : "",  // 班级名称
            begindate: req.body.begindate ? req.body.begindate : new Date(), // 班级开始时间
            enddate: req.body.enddate ? req.body.enddate : new Date(),  // 班级结束时间
            is_using: req.body.is_using ? req.body.is_using : false,  // 该课程是否正在使用
            is_vip: false,  // 该课程是否是VIP课程
            //carmodel:{modelsid:Number,name:String,code:String},  // 该 班级所有车型（驾照类型）（手动自动）
            cartype: req.body.cartype ? req.body.cartype : "", //车品牌  富康、奔驰等
            classdesc: req.body.classdesc ? req.body.classdesc : "",  // 课程描述
            vipserverlist: req.body.vipserverlist ? req.body.vipserverlist : [], // 该课程提供的vip 服务列表{接送、包过，1对1}
            price: req.body.price ? req.body.price : "", // 价格
            onsaleprice: req.body.onsaleprice ? req.body.onsaleprice : 0, // 优化价格,
            originalprice: req.body.originalprice ? req.body.originalprice : 0, // 原价
            systemretains: req.body.systemretains ? req.body.systemretains : 0,// 系统预留
            feedbackuser: req.body.feedbackuser ? req.body.feedbackuser : 0,// 返给用户
            rewardmoney: req.body.rewardmoney ? req.body.rewardmoney : 0,// 系统奖励
            classchedule: req.body.classchedule ? req.body.classchedule : "", // 授课日程   周日/平日/
        }
        classtype.carmodel = basedatafun.getcarmodel(req.body.carmodel ? req.body.carmodel : 0);
        classtype.is_vip = classtype.vipserverlist.length > 0 ? true : false;
        //console.log(classtype);
        return classtype;
    },
    getCarRouteInfo: function (req) {
        classtype = {
            schoolid: req.body.schoolid,
            routecontent: req.body.routecontent ? req.body.routecontent : "",//内容
            routename: req.body.routename ? req.body.routename : "",//名称
            begintime: req.body.begintime,//发车时间
            endtime: req.body.endtime,//结束时间
            stationinfo:req.body.stationinfo?req.body.stationinfo:[],
        };
        return classtype;
    }
}

// 订单管理
exports.getorderlist = function (req, res) {
    var schoolid = req.query.schoolid;
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var reservationstate = req.query.reservationstate ? req.query.reservationstate : 0;
    var begindate = req.query.begindates;
    var enddate = req.query.enddates;
    var searchtype = req.query.searchtype ? req.query.searchtype : 0;  // 0  全部  1 学员姓名 2 教练姓名 3 手机号 4 用户id 5 教练id
    if (schoolid === undefined || schoolid == "") {
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    var searchinfo = {
        "driveschool": new mongodb.ObjectId(schoolid),
        reservationcreatetime: {
            $gte: new Date(begindate * 1000).clearTime(),
            $lte: (new Date(enddate * 1000)).addDays(1).clearTime()
        }
    };
    // 预约状态
    if (reservationstate > 0) {
        searchinfo.reservationstate = reservationstate;
    }
    ;
    // 预约时间
    reservationmodel.find(searchinfo)
        .select("userid coachid reservationstate reservationcreatetime begintime endtime subject")
        .populate("userid", "_id name mobile")
        .populate("coachid", "_id name mobile")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({reservationcreatetime: -1})
        .exec(function (err, data) {
            defaultFun.getModelCount(reservationmodel, searchinfo, function (err, ordercount) {
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
};

exports.getOrderDetailById = function(req, res) {
    var orderId = req.query.order_id;
    console.log("enter getOrderDetailById" + orderId);
    if (orderId == undefined || orderId == "") {
        return  res.json(new BaseReturnInfo(0, "参数有误", ""));
    }
    reservationmodel.findById(new mongodb.ObjectId(orderId))
        .populate("userid", "_id name mobile")
        .populate("coachid", "_id name mobile")
        .populate("driveschool", "_id name")
        .exec(function(err, orderData) {
        if (err) {
            return res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!orderData) {
            return res.json(new BaseReturnInfo(0, "没有查询到订单详情", ""));
        }

        var orderInfo = {
            id : orderData._id,
            userid : orderData.userid,
            coachid : orderData.coachid,
            driveschool : orderData.driveschool,
            trainfieldlinfo : orderData.trainfieldlinfo,
            trainfieldid : orderData.trainfieldid,
            reservationstate : orderData.reservationstate,
            reservationcreatetimeachid : orderData.reservationcreatetime,
            startclassnum : orderData.startclassnum,
            endclassnum : orderData.endclassnum,
            finishtime : orderData.finishtime,
            classdatetimedescchid : orderData.classdatetimedesc,
            reservationcourse : orderData.reservationcourse,
            is_comment : orderData.is_comment == true ? "是" : "否" ,
            comment : orderData.comment,
            is_coachcomment : orderData.is_coachcomment == true ? "是" : "否",
            coachcomment : orderData.coachcomment,
            is_complaint : orderData.is_complaint == true ? "是" : "否",
            complaint : orderData.complaint,
            is_signin : orderData.is_signin == true ? "是" : "否",
            coacsigintimehid : orderData.sigintime,
            cancelreason : orderData.cancelreason,
            is_shuttle : orderData.is_shuttle == true ? "是" : "否",
            shuttleaddress : orderData.shuttleaddress ? orderData.shuttleaddress : "暂无",
            learningcontent : orderData.learningcontent ? orderData.learningcontent : "暂无",
            courseprocessdesc : orderData.courseprocessdesc,
            subject : orderData.subject
        };
        console.log(orderInfo);
        return res.json(new BaseReturnInfo(1, "", orderInfo));
    });
};

//====================================b班级管理
exports.saveClassType = function (req, res) {
    classinfo = defaultFun.getClasstype(req);
    var classtypeid = req.body.classtypeid;
    if (classtypeid === undefined || classtypeid == "") {
        var classtype = new classtypemodel(classinfo);
        classtype.save(function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存班型：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })


    }
    else {
        var conditions = {_id: classtypeid};
        var update = {$set: classinfo};
        classtypemodel.update(conditions, update, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存班型：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }

}
exports.classtypelist = function (req, res) {
    var schoolid = req.query.schoolid;
    if (schoolid === undefined || schoolid == "") {
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    classtypemodel.find({schoolid: new mongodb.ObjectId(schoolid)})
        //.select("_id phone  driveschool fieldname address responsible")
        .exec(function (err, datalist) {
            process.nextTick(function () {
                var filedlist = [];
                datalist.forEach(function (r, index) {
                    onedata = {
                        classtypeid: r._id,
                        classname: r.classname,
                        begindate: r.begindate,
                        enddate: r.enddate,
                        carmodel: r.carmodel,
                        applycount: r.applycount,
                        price: r.price,
                        classchedule: r.classchedule,
                        onsaleprice: r.onsaleprice
                    }
                    filedlist.push(onedata);
                });
                returninfo = {
                    pageInfo: {
                        totalItems: filedlist.length,
                        currentPage: 1,
                        limit: filedlist.length,
                        //pagecount: Math.floor(filedlist.length/limit )+1
                    },
                    datalist: filedlist
                }
                return res.json(new BaseReturnInfo(1, "", returninfo));
            })

        })

};
exports.getclasstypebyid = function (req, res) {
    var classtypeid = req.query.classtypeid;
    if (classtypeid === undefined || classtypeid == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    classtypemodel.findById(new mongodb.ObjectId(classtypeid), function (err, classdata) {
        if (err) {
            return res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!classdata) {
            return res.json(new BaseReturnInfo(0, "没有查询到教练", ""));
        }
        var classtypeinfo = {
            classtypeid: classdata._id,
            schoolid: classdata.schoolid,
            classname: classdata.classname,  // 班级名称
            begindate: classdata.begindate, // 班级开始时间
            enddate: classdata.enddate,  // 班级结束时间
            is_using: classdata.is_using,  // 该课程是否正在使用
            carmodel: classdata.carmodel.modelsid,  // 该 班级所有车型（驾照类型）（手动自动）
            cartype: classdata.cartype, //车品牌  富康、奔驰等
            classdesc: classdata.classdesc,  // 课程描述
            vipserverlist: classdata.vipserverlist, // 该课程提供的vip 服务列表{接送、包过，1对1}
            price: classdata.price, // 价格
            onsaleprice: classdata.onsaleprice, // 优化价格,
            originalprice: classdata.originalprice, // 原价
            systemretains: classdata.systemretains,// 系统预留
            feedbackuser: classdata.feedbackuser,// 返给用户
            rewardmoney: classdata.rewardmoney,// 系统奖励
            classchedule: classdata.classchedule, // 授课日程   周日/平日/
        };
        return res.json(new BaseReturnInfo(1, "", classtypeinfo));
    })
}
///====================================教练管理
exports.getCoachlist = function (req, res) {
    var schoolid = req.query.schoolid;
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var schoolname = req.query.searchKey ? req.query.searchKey : "";
    var searchinfo = {
        "driveschool": schoolid,
        "name": new RegExp(schoolname)
    }
    coachmodel.find(searchinfo)
        .select("_id name mobile  createtime carmodel trainfieldlinfo validationstate")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            defaultFun.getCoachcount(searchinfo, function (err, coachcount) {
                var coachlist = [];
                data.forEach(function (r, index) {
                    var onedata = {
                        name: r.name,
                        coachid: r._id,
                        mobile: r.mobile,
                        carmodel: r.carmodel,
                        trainfieldlinfo: r.trainfieldlinfo,
                        createtime: r.createtime.toFormat("YYYY-MM-DD HH24:MI:SS"),
                        validationstate: r.validationstate
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
exports.saveCoachInfo = function (req, res) {
    try {
        defaultFun.getCoachinfo(req, function (coachinfo) {
            var coachid = req.body.coachid;
            if (coachid === undefined || coachid == "") {
                defaultFun.getModelCount(coachmodel, {"mobile": coachinfo.mobile}, function (err, count) {
                    if (count > 0) {
                        return res.json(new BaseReturnInfo(0, "用户已存在", ""));
                    }
                    var savecoach = new coachmodel(coachinfo);
                    basedatafun.getUserCount(function (err, countdata) {
                        savecoach.displaycoachid = countdata.value.displayid;
                        savecoach.invitationcode = countdata.value.invitationcode;
                        savecoach.password = "e10adc3949ba59abbe56e057f20f883e";
                        //savecoach.loc.coordinates=[savecoach.longitude,savecoach.latitude];
                        savecoach.save(function (err, data) {
                            if (err) {
                                return res.json(new BaseReturnInfo(0, "保存教练出错：" + err, ""));
                            } else {
                                return res.json(new BaseReturnInfo(1, "", "sucess"));
                            }
                        })
                    })
                })

            }
            else {
                var conditions = {_id: coachid};
                var update = {$set: coachinfo};
                coachmodel.update(conditions, update, function (err, data) {
                    if (err) {
                        return res.json(new BaseReturnInfo(0, "修改教练出错：" + err, ""));
                    } else {
                        return res.json(new BaseReturnInfo(1, "", "sucess"));
                    }
                })
            }
        });
    }
    catch (ex) {
        return res.json(new BaseReturnInfo(0, "保存教练出错：" + ex.message, ""));
    }

};
exports.getcoachbyid = function (req, res) {
    var coachid = req.query.coachid;
    if (coachid === undefined || coachid == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    console.log(coachid);
    coachmodel.findById(new mongodb.ObjectId(coachid), function (err, coachdata) {
        if (err) {
            return res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!coachdata) {
            return res.json(new BaseReturnInfo(0, "没有查询到教练", ""));
        }
        var coachinfo = {
            coachid: coachdata._id,
            name: coachdata.name,
            mobile: coachdata.mobile,
            logoimg: coachdata.headportrait.originalpic,
            address: coachdata.address,
            introduction: coachdata.introduction,
            subject: [],
            validationstate: coachdata.validationstate,
            driveschool: coachdata.driveschool,
            Seniority: coachdata.Seniority,
            passrate: coachdata.passrate,
            studentcount: coachdata.studentcount,
            workweek: coachdata.workweek,
            begintimeint: coachdata.worktimespace.begintimeint,
            endtimeint: coachdata.worktimespace.endtimeint,
            coursestudentcount: coachdata.coursestudentcount,
            idcardnumber: coachdata.idcardnumber,
            drivinglicensenumber: coachdata.drivinglicensenumber,
            coachnumber: coachdata.coachnumber,
            starlevel: coachdata.starlevel,
            platenumber: coachdata.platenumber,
            serverclasslist: req.body.serverclasslist,
            trainfield: coachdata.trainfield,
            carmodel: coachdata.carmodel.modelsid,
        };
        for (i = 0; i < coachdata.subject.length; i++) {
            coachinfo.subject.push(coachdata.subject[i].subjectid);
        }
        return res.json(new BaseReturnInfo(1, "", coachinfo));
    })
};
//=======================================学员管理
exports.getstudentlist = function (req, res) {
    var schoolid = req.query.schoolid;
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var name = req.query.searchKey ? req.query.searchKey : "";
    var searchinfo = {
        "applyschool": schoolid,
        "applystate": 2,
        "name": new RegExp(name)
    }
    usermodel.find(searchinfo)
        .select("_id name mobile  headportrait subject carmodel applycoachinfo applyclasstypeinfo")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            defaultFun.getModelCount(usermodel, searchinfo, function (err, coachcount) {
                //var coachlist=[];
                //data.forEach(function (r, index) {
                //    var onedata = {
                //        name: r.name,
                //        coachid: r._id,
                //        mobile: r.mobile,
                //        carmodel: r.carmodel,
                //        trainfieldlinfo: r.trainfieldlinfo,
                //        createtime: r.createtime.toFormat("YYYY-MM-DD HH24:MI:SS")
                //    }
                //    coachlist.push(onedata);
                //});
                returninfo = {
                    pageInfo: {
                        totalItems: coachcount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(coachcount / limit) + 1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            });
        })
};
exports.getstudentbyid = function (req, res) {
    var studentid = req.query.studentid;
    if (studentid === undefined || studentid == "") {
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    usermodel.findById(new mongodb.ObjectId(studentid), function (err, userdata) {
        if (err) {
            return res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        return res.json(new BaseReturnInfo(1, "", userdata))
    });
};
exports.saveStudentInfo = function (req, res) {
    try {
        defaultFun.getStudentinfo(req, function (studentinfo) {
            var studentid = req.body._id;
            if (studentid === undefined || studentid == "") {
                defaultFun.getModelCount(usermodel, {"mobile": studentinfo.mobile}, function (err, count) {
                    if (count > 0) {
                        return res.json(new BaseReturnInfo(0, "用户已存在", ""));
                    }
                    var savestdent = new usermodel(studentinfo);
                    basedatafun.getUserCount(function (err, countdata) {
                        savestdent.displayuserid = countdata.value.displayid;
                        savestdent.invitationcode = countdata.value.invitationcode;
                        savestdent.password = "e10adc3949ba59abbe56e057f20f883e";
                        savestdent.source = 1;
                        savestdent.applystate = 2;
                        //savecoach.loc.coordinates=[savecoach.longitude,savecoach.latitude];
                        savestdent.save(function (err, data) {
                            if (err) {
                                return res.json(new BaseReturnInfo(0, "保存学员出错：" + err, ""));
                            } else {
                                return res.json(new BaseReturnInfo(1, "", "sucess"));
                            }
                        })
                    })
                })
            }
            else {
                var conditions = {_id: studentid};
                var update = {$set: studentinfo};
                usermodel.update(conditions, update, function (err, data) {
                    if (err) {
                        return res.json(new BaseReturnInfo(0, "修改学员出错：" + err, ""));
                    } else {
                        return res.json(new BaseReturnInfo(1, "", "sucess"));
                    }
                })
            }
        });
    } catch (ex) {
        return res.json(new BaseReturnInfo(0, "保存学员出错：" + ex.message, ""));
    }
};

//=====================================训练场管理
exports.getTrainingFieldList = function (req, res) {
    var schoolid = req.query.schoolid;
    if (schoolid === undefined || schoolid == "") {
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    trainingfiledModel.find({driveschool: new mongodb.ObjectId(schoolid)})
        .select("_id phone  driveschool fieldname address responsible")
        .exec(function (err, datalist) {
            if (datalist.length == 0) {

            }
            process.nextTick(function () {
                var filedlist = [];
                datalist.forEach(function (r, index) {
                    onedata = {
                        trainingfiledid: r._id,
                        schoolid: r.driveschool,
                        fieldname: r.fieldname,
                        address: r.address,
                        responsible: r.responsible,
                        phone: r.phone,
                        pictures: r.pictures
                    }
                    filedlist.push(onedata);
                });
                returninfo = {
                    pageInfo: {
                        totalItems: filedlist.length,
                        currentPage: 1,
                        limit: filedlist.length,
                        //pagecount: Math.floor(filedlist.length/limit )+1
                    },
                    datalist: filedlist
                }
                return res.json(new BaseReturnInfo(1, "", returninfo));
            })

        })

}
exports.saveTrainingField = function (req, res) {
    fieldinfo = defaultFun.getfiledinfo(req);
    var trainfild = trainingfiledModel(fieldinfo);
    trainfild.save(function (err, data) {
        basedatafun.reftrainingfiled(req.session.schoolid, function (err, data) {
        });
        if (err) {
            return res.json(new BaseReturnInfo(0, "保存训练场出错：" + err, ""));
        } else {
            return res.json(new BaseReturnInfo(1, "", "sucess"));
        }
    })
}
exports.getTrainingFieldbyId = function (req, res) {
    var trainingfiledid = req.query.trainingfiledid;
    if (trainingfiledid === undefined || trainingfiledid == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    trainingfiledModel.findById(new mongodb.ObjectId(trainingfiledid), function (err, trainingfileddata) {
        if (err) {
            res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!trainingfileddata) {
            res.json(new BaseReturnInfo(0, "没有查询到练车场", ""));
        }
        var trainingfiledidinfo = {
            trainingfiledid: trainingfileddata._id,
            fieldname: trainingfileddata.fieldname,
            logoimg: trainingfileddata.logoimg,
            province: trainingfileddata.province,
            city: trainingfileddata.city,
            county: trainingfileddata.county,
            address: trainingfileddata.address,
            is_validation: trainingfileddata.is_validation,
            phone: trainingfileddata.phone,
            fieldlevel: trainingfileddata.fieldlevel,
            pictures: trainingfileddata.pictures,
            responsible: trainingfileddata.responsible,
            schoolid: trainingfileddata.driveschool,
            latitude: trainingfileddata.latitude,
            longitude: trainingfileddata.longitude,
            fielddesc: trainingfileddata.fielddesc,
        }
        res.json(new BaseReturnInfo(1, "", trainingfiledidinfo));
    })
}
exports.updateTrainingField = function (req, res) {
    var trainingfiledid = req.body.trainingfiledid;
    if (trainingfiledid === undefined || trainingfiledid == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    filedinfo = defaultFun.getfiledinfo(req);

    var conditions = {_id: trainingfiledid};
    req.body.updateDate = new Date();
    var update = {$set: filedinfo};
    console.log(update);
    trainingfiledModel.update(conditions, update, function (err, data) {
        basedatafun.reftrainingfiled(req.session.schoolid, function (err, data) {
        });
        if (err) {
            return res.json(new BaseReturnInfo(0, "修改训练场出错：" + err, ""));
        } else {
            return res.json(new BaseReturnInfo(1, "", "sucess"));
        }
    })
}

// 班车管理
exports.getCarRouteList = function (req, res) {
    var schoolid = req.query.schoolid;
    if (schoolid === undefined || schoolid == "") {
        return res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    busRouteModel.find({schoolid: new mongodb.ObjectId(schoolid)})
        .select("_id routename  driveschool routecontent begintime endtime")//
        .exec(function (err, datalist) {
            if (datalist.length == 0) {
                console.log("没有数据");
            }
            process.nextTick(function () {
                var basRouteList = [];
                datalist.forEach(function (r, index) {
                    onedata = {
                        id: r._id,
                        schoolid: r.driveschool,
                        routename: r.routename,
                        routecontent: r.routecontent,
                        begintime: r.begintime,
                        endtime: r.endtime
                    };
                    basRouteList.push(onedata);
                });
                returninfo = {
                    pageInfo: {
                        totalItems: basRouteList.length,
                        currentPage: 1,
                        limit: basRouteList.length
                        //pagecount: Math.floor(filedlist.length/limit )+1
                    },
                    datalist: basRouteList
                }
                return res.json(new BaseReturnInfo(1, "", returninfo));
            })

        })

};

exports.getCarRouteById = function (req, res) {
    console.log("getCarRouteById id = " + busRouteId);
    var busRouteId = req.query.car_route_id;
    if (busRouteId === undefined || busRouteId == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    busRouteModel.findById(new mongodb.ObjectId(busRouteId), function (err, busRouteData) {
        if (err) {
            res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!busRouteData) {
            res.json(new BaseReturnInfo(0, "没有查询到练车场", ""));
        }
        var busRouteInfo = {
            bus_route_id: busRouteData._id,
            schoolid: busRouteData.schoolid,
            routename: busRouteData.routename,
            routecontent: busRouteData.routecontent,
            begintime: busRouteData.begintime,
            endtime: busRouteData.endtime,
            stationinfo: busRouteData.stationinfo

        };
        res.json(new BaseReturnInfo(1, "", busRouteInfo));
    })
};

exports.saveCarRoute = function (req, res) {
    carRouteInfo = defaultFun.getCarRouteInfo(req);
    var bus_route_id = req.body.bus_route_id;
    if (bus_route_id === undefined || bus_route_id == "") {

        var carRoute = busRouteModel(carRouteInfo);
        carRoute.save(function (err, data) {
            basedatafun.refbusroute(req.session.schoolid, function (err, data) {
            });
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存班车出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }   else
    {
        var conditions = {_id: bus_route_id};
        var update = {$set: carRouteInfo};
        busRouteModel.update(conditions, update, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改教练出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
};

exports.updateCarRoute = function (req, res) {

}

//  活动管理 ===
exports.getactivitybyid = function (req, res) {
    var activityid = req.query.activityid;
    if (activityid === undefined || activityid == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    activtyModel.findById(new mongodb.ObjectId(activityid), function (err, activityinfo) {
        if (err) {
            res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!activityinfo) {
            res.json(new BaseReturnInfo(0, "没有查询到活动", ""));
        }
        var activity = {
            activityid: activityinfo._id,
            name: activityinfo.name,
            titleimg: activityinfo.titleimg,
            contenturl: activityinfo.contenturl,
            begindate: activityinfo.begindate,
            enddate: activityinfo.enddate,
            province: activityinfo.province,
            city: activityinfo.province,
            county: activityinfo.province,
            address: activityinfo.address,
        }
        res.json(new BaseReturnInfo(1, "", activity));
    })
}
//保存活动信息
exports.updateactivty = function (req, res) {
    activtyfo = defaultFun.getActivity(req);
    var activityid = req.body.activityid;
    if (activityid === undefined || activityid == "") {
        var saveactivity = new activtyModel(activtyfo);
        saveactivity.save(function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存教练出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })


    }
    else {
        var conditions = {_id: activityid};
        var update = {$set: activtyfo};
        activtyModel.update(conditions, update, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改教练出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
}
exports.getactivtylist = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var name = req.query.searchKey ? req.query.searchKey : "";
    activtyModel.find({"name": new RegExp(name)})
        //.select("_id name address  createtime")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            defaultFun.getModelCount(activtyModel, {"name": new RegExp(name)}, function (err, activitycount) {
                activityinfo = _.map(data, function (item, index) {
                    info = {
                        name: item.name,
                        activityid: item._id,
                        contenturl: item.contenturl,
                        begindate: item.begindate,
                        enddate: item.enddate,
                        province: item.province,
                        city: item.city,
                    }
                    return info;
                })
                returninfo = {
                    pageInfo: {
                        totalItems: activitycount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(activitycount / limit) + 1
                    },
                    datalist: activityinfo
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
}
//==============行业信息
exports.getindustrynewsList = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;

    industryNewsModel.find()
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            defaultFun.getModelCount(industryNewsModel, {}, function (err, industryNewscount) {
                industryNewsinfo = _.map(data, function (item, index) {
                    info = {
                        createtime: item.createtime,
                        _id: item._id,
                        title: item.title,
                        description: item.description,
                        contenturl: item.contenturl,
                        newstype: item.newstype,
                        viewcount: item.viewcount,
                        sharecount: item.sharecount,
                    }
                    return info;
                })
                returninfo = {
                    pageInfo: {
                        totalItems: industryNewscount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(industryNewscount / limit) + 1
                    },
                    datalist: industryNewsinfo
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
};
exports.getindustrynewsByid = function (req, res) {
    var newsid = req.query.newsid;
    if (newsid === undefined || newsid == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    ;
    industryNewsModel.findById(new mongodb.ObjectId(newsid), function (err, industryNews) {
        if (err) {
            res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!industryNews) {
            res.json(new BaseReturnInfo(0, "没有查询到信息", ""));
        }
        res.json(new BaseReturnInfo(1, "", industryNews));
    })
};
exports.getindustrynewsByid2 = function (newsid, callback) {

    industryNewsModel.findById(new mongodb.ObjectId(newsid), function (err, industryNews) {
        if (err) {
            callback(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!industryNews) {
            callback(new BaseReturnInfo(0, "没有查询到信息", ""));
        }
        callback(new BaseReturnInfo(1, "", industryNews));
    })
};
exports.updateindustrynews = function (req, res) {
    var _id = req.body._id;
    if (_id === undefined || _id == "") {
        var industryNews = new industryNewsModel(req.body);
        industryNews.createtime = new Date();
        industryNews.save(function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存信息出错：" + err, ""));
            } else {
                industryNewsModel.update({"_id": data._id},
                    {$set: {contenturl: "http://manage.yibuxueche.com/news?newsid=" + data._id}}, function (err, update) {
                    });
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
    else {
        var conditions = {_id: new mongodb.ObjectId(req.body._id)};
        var updateinfo = req.body;
        //updateinfo._id=undefined;
        delete  updateinfo._id;
        var update = {$set: updateinfo};

        industryNewsModel.update(conditions, update, {safe: true, upsert: true}, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
}
//  ===================================商城管理
exports.getbusinesslist = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;

    merchantmodel.find()
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            defaultFun.getModelCount(merchantmodel, {}, function (err, merchantcount) {
                returninfo = {
                    pageInfo: {
                        totalItems: merchantcount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(merchantcount / limit) + 1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
};
exports.updatebusiness = function (req, res) {
    var _id = req.body._id;
    if (_id === undefined || _id == "") {
        var merchant = new merchantmodel(req.body);
        merchant.save(function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
    else {
        var conditions = {_id: new mongodb.ObjectId(req.body._id)};
        var updateinfo = req.body;
        //updateinfo._id=undefined;
        delete  updateinfo._id;
        var update = {$set: updateinfo};

        merchantmodel.update(conditions, update, {safe: true, upsert: true}, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
};
exports.getproductlist = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;

    mallProductsmodel.find()
        .populate("merchantid")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            defaultFun.getModelCount(mallProductsmodel, {}, function (err, merchantcount) {
                returninfo = {
                    pageInfo: {
                        totalItems: merchantcount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(merchantcount / limit) + 1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
};
exports.updateproduct = function (req, res) {
    var _id = req.body._id;
    if (_id === undefined || _id == "") {
        var product = new mallProductsmodel(req.body);
        product.createtime = new Date();
        product.save(function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
    else {
        var conditions = {_id: new mongodb.ObjectId(req.body._id)};
        var updateinfo = req.body;
        delete  updateinfo._id;
        var update = {$set: updateinfo};

        mallProductsmodel.update(conditions, update, {safe: true, upsert: true}, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
}
/// =====================================用户管理
exports.getadminuserlist = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var name = req.query.searchKey ? req.query.searchKey : "";
    var serchcondition = {
        "name": new RegExp(name),
        "$or": [{"userstate": {"$lt": 2}}, {"userstate": {$exists: false}}]
    };
    AdminUser.find(serchcondition)
        .populate('schoolid', "_id name")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({date: -1})
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            }
            defaultFun.getModelCount(AdminUser, serchcondition, function (err, usercount) {
                returninfo = {
                    pageInfo: {
                        totalItems: usercount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(usercount / limit) + 1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
};
exports.updateadminuser = function (req, res) {
    var _id = req.body._id;
    if (_id === undefined || _id == "") {
        var adminuser = new AdminUser(req.body);
        adminuser.password = DbOpt.encrypt(adminuser.password, settings.encrypt_key);
        adminuser.save(function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "保存信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
    else {
        var conditions = {_id: new mongodb.ObjectId(req.body._id)};
        var updateinfo = req.body;
        delete  updateinfo._id;
        var update = {$set: updateinfo};
        AdminUser.update(conditions, update, {safe: true, upsert: true}, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
};
exports.deleteadminuser = function (req, res) {
    try {
        var userid = req.query.userid;
        AdminUser.findById(new mongodb.ObjectId(userid), function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "查询用户出错：" + err, ""));
            }
            if (!data) {
                return res.json(new BaseReturnInfo(0, "没有查询到用户", ""));
            }
            data.userstate = 2;  // 删除
            data.save(function (err, newdata) {
                if (err) {
                    return res.json(new BaseReturnInfo(0, "保存用户出错：" + err, ""));
                }
                else {
                    return res.json(new BaseReturnInfo(1, "", "sucess"));
                }
            })
        })
    }
    catch (ex) {
        return res.json(new BaseReturnInfo(0, "删除信息出错：" + ex.message, ""));
    }
};
//=========================================校长管理
exports.getheadmasterlist = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var name = req.query.searchKey ? req.query.searchKey : "";
    var schoolid = req.query.schoolid ? req.query.schoolid : "";
    var serchcondition = {"name": new RegExp(name)};
    if (schoolid != "") {
        serchcondition.driveschool = new mongodb.ObjectId(schoolid);
    }
    headMastermodel.find(serchcondition)
        .populate('driveschool', "_id name")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({date: -1})
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            }
            defaultFun.getModelCount(headMastermodel, serchcondition, function (err, headmastercount) {
                returninfo = {
                    pageInfo: {
                        totalItems: headmastercount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(headmastercount / limit) + 1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
};
exports.updateheadmaster = function (req, res) {
    var _id = req.body._id;

    if (_id === undefined || _id == "") {
        var mobile = req.body.mobile;
        headMastermodel.count({mobile: mobile}, function (err, data) {
            if (data > 0) {
                return res.json(new BaseReturnInfo(0, "用户已存在", ""));
            }
            var headmaster = new headMastermodel(req.body);
            //headmaster.password=DbOpt.encrypt(adminuser.password,settings.encrypt_key);
            var shasum = crypto.createHash('md5');
            shasum.update(headmaster.password);
            headmaster.password = shasum.digest('hex');
            headmaster.save(function (err, data) {
                if (err) {
                    return res.json(new BaseReturnInfo(0, "保存信息出错：" + err, ""));
                } else {
                    return res.json(new BaseReturnInfo(1, "", "sucess"));
                }
            })
        })
    }
    else {
        var conditions = {_id: new mongodb.ObjectId(req.body._id)};
        var updateinfo = req.body;
        delete  updateinfo._id;
        var update = {$set: updateinfo};
        headMastermodel.update(conditions, update, {safe: true, upsert: true}, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
};
//========================================用户反馈
exports.getuserfeedbacklist = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    //var name=req.query.searchKey?req.query.searchKey:"";
    //var  schoolid=req.query.schoolid?req.query.schoolid:"";
    //var serchcondition= {"name":new RegExp(name)};
    //if (schoolid!=""){
    //    serchcondition.driveschool=new mongodb.ObjectId(schoolid);
    //}
    var serchcondition = {"feedbacktype": 3}
    userfeedback.find(serchcondition)
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            if (err) {
                res.json(new BaseReturnInfo(0, "查询出错" + err, null));
            }
            ;
            var returndata = [];
            data.forEach(function (r, indx) {
                var onedate = JSON.parse(r.usefeedbackmessage);
                onedate.createtime = r.createtime;
                returndata.push(onedate);
            })

            defaultFun.getModelCount(userfeedback, serchcondition, function (err, userfeedbackcount) {
                returninfo = {
                    pageInfo: {
                        totalItems: userfeedbackcount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(userfeedbackcount / limit) + 1
                    },
                    datalist: returndata
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
};
exports.exportsfeedbackexcle = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;

    var serchcondition = {"feedbacktype": 3}
    userfeedback.find(serchcondition)
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            if (err) {
                res.json(new BaseReturnInfo(0, "查询出错" + err, null));
            }
            ;
            var datalist = [];
            var returndata = [
                "姓名", "部门", "手机号", "手机型号", "测试地点", "APP终端", "美观度", "易用性",
                "流畅度", "功能完备度", "时间消耗", "流量消耗", "分享", "分享原因", "问题",
                "问题程度", "建议", "建议程度", "反馈时间"
            ];
            datalist.push(returndata);
            data.forEach(function (r, indx) {
                var feedback = [];
                var onedate = JSON.parse(r.usefeedbackmessage);
                feedback.push(onedate.username);
                feedback.push(onedate.department);
                feedback.push(onedate.mobile);
                feedback.push(onedate.phoneType);
                feedback.push(onedate.testPlace);
                feedback.push(onedate.whoUse);
                feedback.push(onedate.outward + "分");
                feedback.push(onedate.easy + "分");
                feedback.push(onedate.affluent + "分");
                feedback.push(onedate.function + "分");
                feedback.push(onedate.timeUse);
                feedback.push(onedate.flowUse);
                feedback.push(onedate.share);
                feedback.push(onedate.sharereason);
                feedback.push(onedate.problem);
                feedback.push(onedate.problemimportent);
                feedback.push(onedate.suggest);
                feedback.push(onedate.suggestimportent);
                feedback.push(r.createtime.toFormat("YYYY-MM-DD HH24:MI:SS"));
                //onedate.createtime= r.createtime;
                datalist.push(feedback);
            });

            console.log("kaishi");
            var buffer = xlsx.build([{name: "mySheetName", data: datalist}]);
            var filename = (new Date()).getTime() + ".xlsx";
            console.log(filename);
            //fs.writeFileSync('public/userfeedbackfile/'+filename, buffer, 'binary');
            //res.send('userfeedbackfile/'+filename);
            res.writeHead(200, {'Content-Type': 'application/vnd.ms-excel'});
            res.write(buffer);
            res.end();

        });
};
///=====================================驾校管理
exports.getSchoolist = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var schoolname = req.query.searchKey ? req.query.searchKey : "";
    schoolModel.find({"name": new RegExp(schoolname)})
        .select("_id name address  createtime")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({createtime: -1})
        .exec(function (err, data) {
            defaultFun.getSchoolcount(schoolname, function (err, schoolcount) {
                var begintime = (new Date()).clearTime();
                var endtime = (new Date()).addDays(1).clearTime();
                var schoolidlist = [];
                data.forEach(function (r, idnex) {
                    schoolidlist.push(r._id);
                })
                schooldaysunmmary.find({
                    "summarytime": {$gte: begintime, $lte: endtime},
                    "driveschool": {"$in": schoolidlist}
                })
                    .select("_id  driveschool  applyingstudentcount reservationcoursecount complaintcount")
                    .exec(function (err, sunmmarydata) {
                        var schoolinfo = [];
                        data.forEach(function (r, index) {
                            var summarydata = defaultFun.getSchoolSummaryinfo(r._id, sunmmarydata);
                            var onedata = {
                                name: r.name,
                                shcoolid: r._id,
                                address: r.address,
                                createtime: (new Date(r.createtime)).toFormat("YYYY-MM-DD HH24:MI:SS"),
                                applyingstudentcount: summarydata.applyingstudentcount,
                                reservationcoursecount: summarydata.reservationcoursecount,
                                complaintcount: summarydata.complaintcount,
                            }
                            schoolinfo.push(onedata);
                        });
                        returninfo = {
                            pageInfo: {
                                totalItems: schoolcount,
                                currentPage: index,
                                limit: limit,
                                pagecount: Math.floor(schoolcount / limit) + 1
                            },
                            datalist: schoolinfo
                        }
                        res.json(new BaseReturnInfo(1, "", returninfo));
                    })
            })
        });
}

exports.saveSchoolInfo = function (req, res) {
    schoolinfo = defaultFun.getschoolinfo(req);
    console.log(schoolinfo);
    var schoolmodel = new schoolModel(schoolinfo);
    schoolmodel.save(function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, "保存驾校信息出错：" + err, ""));
        } else {
            var temptraining = trainingfiledModel();
            temptraining.fieldname = data.name + "本部练车场";
            temptraining.fieldlevel = data.schoollevel;
            temptraining.is_validation = true;
            temptraining.latitude = data.latitude;
            temptraining.longitude = data.longitude;
            temptraining.loc = data.loc;
            temptraining.province = data.province;
            temptraining.city = data.city;
            temptraining.county = data.county;
            temptraining.address = data.address;
            temptraining.fielddesc = "本部练车场";
            temptraining.driveschool = data._id;
            temptraining.save(function (err, data) {
            });
            return res.json(new BaseReturnInfo(1, "", "sucess"));
        }
    })


}

exports.updateSchoolInfo = function (req, res) {
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
        schoolModel.update(conditions, update, {safe: true}, function (err, data) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "修改驾校信息出错：" + err, ""));
            } else {
                return res.json(new BaseReturnInfo(1, "", "sucess"));
            }
        })
    }
    catch (ex) {
        return res.json(new BaseReturnInfo(0, "修改驾校信息出错：" + ex.message, ""));
    }


}

exports.getSchoolInfoById = function (req, res) {
    var schoolid = req.query.schoolid;
    if (schoolid === undefined || schoolid == "") {
        res.json(new BaseReturnInfo(0, "参数错误", ""));
    }
    schoolModel.findById(new mongodb.ObjectId(schoolid), function (err, schooldata) {
        if (err) {
            res.json(new BaseReturnInfo(0, "查询出错:" + err, ""));
        }
        if (!schooldata) {
            res.json(new BaseReturnInfo(0, "没有查询到驾校", ""));
        }
        var schoolinfo = {
            schoolid: schooldata._id,
            name: schooldata.name,
            logoimg: schooldata.logoimg.originalpic,
            province: schooldata.province,
            city: schooldata.city,
            county: schooldata.county,
            address: schooldata.address,
            responsiblelist: schooldata.responsiblelist,
            latitude: schooldata.latitude,
            longitude: schooldata.longitude,
            website: schooldata.website,
            email: schooldata.email,
            businesslicensenumber: schooldata.businesslicensenumber,
            organizationcode: schooldata.organizationcode,
            registertime: schooldata.registertime,
            schoollevel: schooldata.schoollevel,
            is_validation: schooldata.is_validation ? Number(schooldata.is_validation) : 0,
            privilegelevel: schooldata.privilegelevel,
            studentcount: schooldata.studentcount,
            passingrate: schooldata.passingrate,
            examhallcount: schooldata.examhallcount,
            coachcount: schooldata.coachcount,
            carcount: schooldata.carcount,
            licensetype: schooldata.licensetype,
            cartype: schooldata.cartype,
            vipserver: schooldata.vipserver,
            valueaddedservice: schooldata.valueaddedservice,
            superiorservice: schooldata.superiorservice,
            shuttleroute: schooldata.shuttleroute,
            introduction: schooldata.introduction,
            schoolalbum: schooldata.schoolalbum,
            workbegintime: schooldata.workbegintime,
            workendtime: schooldata.workendtime,
            phonelist: schooldata.phonelist,
            phone: schooldata.phone ? schooldata.phone : "",
            shortname: schooldata.shortname ? schooldata.shortname : "",
            examurl: schooldata.examurl ? schooldata.examurl : "",
            querycoursehoururl: schooldata.querycoursehoururl ? schooldata.querycoursehoururl : "",
            examroomname: schooldata.examroomname ? schooldata.examroomname : "",
            pictures_path: schooldata.pictures_path
        }
        res.json(new BaseReturnInfo(1, "", schoolinfo));
    })
}

exports.getmainPagedata = function (schoolid, callback) {
    var queryinfo = {
        userid: "",
        searchtype: 1,
        schoolid: schoolid,
        seqindex: 0,
        count: 3
    };
    var proxy = new eventproxy();
    proxy.fail(callback);
    proxy.all('mainpagedata', "schooldata", "newsinfo", "coachdata", function (mainpagedata, schooldata, newsinfo, coachdata) {
        var retruninfo = {
            summarydata: mainpagedata,
            schooldata: schooldata,
            newsinfo: newsinfo,
            coachdata: coachdata
        }
        return callback(null, retruninfo);
    });
    // 获取在校学生 科目一*四
    headMasterOperation.getMainPageData(queryinfo, proxy.done('mainpagedata'));
    basedatafun.getschoolinfo(schoolid, proxy.done('schooldata'));
    userCenterServer.getIndustryNews(queryinfo, proxy.done('newsinfo'));
    getSchoolallCoach(schoolid, proxy.done('coachdata'));
}


//查询驾校所有教练
var getSchoolallCoach = function (schoolid, callback) {
    cache.get("schoolcoach" + schoolid, function (err, data) {
        if (err) {
            return callback(err);
        }
        if (data) {
            return callback(null, data);
        } else {
            coachmodel.find({
                "driveschool": new mongodb.ObjectId(schoolid),
                "is_validation": true
            })
                .select("_id name  mobile headportrait  starlevel")
                .sort({"starlevel": -1})
                .exec(function (err, coachdata) {
                    if (err) {
                        return callback(err);
                    }
                    cache.set("schoolcoach" + schoolid, coachdata, 60 * 20, function () {
                    });
                    return callback(null, coachdata);
                })
        }
    })
};
//查询教练的课时学
var getCoachCourseplan = function (schoolid, beginDate, endDate, callback) {
    cache.get('getCoachCourseplan:' + schoolid + beginDate, function (err, data) {
        if (err) {
            return callback(err);
        }
        if (data) {
            return callback(null, data);
        } else {
            reservationmodel.aggregate([{
                    $match: {
                        // "_id":new mongodb.ObjectId("56a3730ad63f293669053c5d"),
                        "driveschool": new mongodb.ObjectId(schoolid),
                        "begintime": {$gte: beginDate, $lt: endDate}
                        , "$and": [{reservationstate: {$ne: appTypeEmun.ReservationState.applycancel}},
                            {reservationstate: {$ne: appTypeEmun.ReservationState.applyrefuse}}]
                    }
                },
                    {
                        "$project": {
                            "coachid": "$coachid",
                            "coursehour": "$coursehour",
                            "begintime2": "$begintime",
                            "day": {"$dayOfMonth": {$add: ['$begintime', 28800000]}}
                        }
                    }
                    , {$group: {_id: {"coachid": "$coachid", "day": "$day"}, coursecount: {$sum: "$coursehour"}}}
                    , {"$sort": {coursecount: -1}}
                ],
                function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    console.log(data);
                    cache.set('getCoachCourseplan:' + schoolid + beginDate, data, 60 * 1, function () {
                    });
                    return callback(null, data);
                }
            )
        }
    });
};
//var begintime=(new Date()).addDays(-1).clearTime();
//var enddate=(new Date()).addDays(7).clearTime();
//var schoolid="562dcc3ccb90f25c3bde40da";
//getCoachCourseDetial(schoolid,begintime,enddate,function(err,data){
//    console.log(err);
//   /// console.log(data);
//}
//
//)
// 驾校获取课程安排
exports.getcoachcourse = function (schoolid, callback) {
    var begintime = (new Date()).clearTime();
    var enddate = (new Date()).addDays(7).clearTime();
    coachmodel.find(searchinfo)
        .select("_id name mobile  createtime carmodel trainfieldlinfo")
}

//获取我可以预约的教练
exports.getUsefulCoachList = function (req, res) {
    var userid = req.query.studentid;
    var index = -1;
    userserver.getUsefulCoachList(userid, index, "", function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        } else {
            return res.json(new BaseReturnInfo(1, "", data));
        }
    });
}
// 获取某一 教练的课程安排
exports.getcoursebycoach = function (req, res) {
    var coachid = req.query.coachid;
    var date = req.query.date;
    if (coachid === undefined || date === undefined) {
        return res.json(new BaseReturnInfo(0, "获取参数错误", ""));
    }
    var now = new Date();
    console.log(date);
    console.log(new Date(date * 1000));
    date = new Date(date * 1000).toFormat("YYYY-MM-DD");
    var coursedate = new Date(date);
    //console.log(date);
    //// 只能获取七天内的课程信息
    if (now.getDaysBetween(coursedate) > 7 || now.getDaysBetween(coursedate) < 0) {
        return res.json(new BaseReturnInfo(0, "无法获取该时间段的课程安排", ""));
    }
    courseserver.GetCoachCourse(coachid, date, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, []));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    });
};
// 用户提交数据
exports.postReservation = function (req, res) {
    var reservationinfo = {
        userid: req.body.userid,
        coachid: req.body.coachid,
        courselist: req.body.courselist,
        is_shuttle: req.body.is_shuttle,
        address: req.body.address,
        begintime: req.body.begintime,
        endtime: req.body.endtime
    };
    if (reservationinfo.userid === undefined
        || reservationinfo.coachid === undefined || reservationinfo.courselist === undefined
        || reservationinfo.begintime === undefined || reservationinfo.endtime === undefined) {
        return res.json(
            new BaseReturnInfo(0, "参数不完整", ""));
    }
    ;
    if (!reservationinfo.courselist || reservationinfo.courselist.length <= 0) {
        return res.json(
            new BaseReturnInfo(0, "课程不能为空", ""));
    }
    courseserver.postReservation(reservationinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, ""));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    });
};
// 取消课程
exports.cancelReservation = function (req, res) {
    var cancelinfo = {
        userid: req.body.userid,
        reservationid: req.body.reservationid,
        cancelreason: "后台取消",
        cancelcontent: "后台取消",
        reservationstate: 8
    };
    if (cancelinfo.userid === undefined
        || cancelinfo.reservationid === undefined) {
        return res.json(
            new BaseReturnInfo(0, "参数不完整", ""));
    }
    ;

    courseserver.userCancelReservation(cancelinfo, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, err, ""));
        }
        return res.json(new BaseReturnInfo(1, "", data));
    });
}
// 提交用户申请信息
exports.auditstudentapplyinfo = function (req, res) {
    var auditinfo = {
        userid: req.body.userid,
        applystate: req.body.applystate + 0,
        handelstate: req.body.handelstate + 0,
        handelmessage: req.body.handelmessage
    };
    if (auditinfo.applystate <= 10) {
        return res.json(new BaseReturnInfo(0, "审核状态出错", ""));
    }
    usermodel.findById(auditinfo.userid, function (err, data) {
        if (err) {
            return res.json(new BaseReturnInfo(0, "查询用户出错：" + err, ""));
        }
        if (!data) {
            return res.json(new BaseReturnInfo(0, "没有查到用户", ""));
        }
        data.applystate = auditinfo.applystate;
        if (data.applystate = 2) {
            data.subject.subjectid = 1;
            data.subject.name = "科目一";
        }
        data.applyinfo.handelstate = auditinfo.handelstate;
        if (data.applyinfo.handelmessage === undefined) {
            data.applyinfo.handelmessage = [auditinfo.handelmessage];
        } else {
            data.applyinfo.handelmessage.push(auditinfo.handelmessage);
        }
        data.save(function (err, newdata) {
            if (err) {
                return res.json(new BaseReturnInfo(0, "处理出错：" + err, ""));
            }
            return res.json(new BaseReturnInfo(1, "", "success"));
        })
    });
}

//==========================================主页信息
exports.getApplySchoolinfo = function (req, res) {
    var index = req.query.index ? req.query.index : 0;
    var limit = req.query.limit ? req.query.limit : 10;
    var name = req.query.searchKey ? req.query.searchKey : "";
    var schoolid = req.query.schoolid ? req.query.schoolid : "";
    var searchinfo = {applystate: 1};
    if (name != "") {
        searchinfo = {"name": new RegExp(name)};
    }
    if (schoolid != "") {
        searchinfo.applyschool = schoolid;
    }
    console.log(searchinfo);
    usermodel.find(searchinfo)
        .select("_id name address mobile carmodel  referrerfcode  applystate applyinfo  applyschoolinfo  " +
        "applycoachinfo applyclasstypeinfo  createtime source paytype paytypestatus")
        .skip((index - 1) * limit)
        .limit(limit)
        .sort({"applyinfo.applytime": -1})
        .exec(function (err, data) {
            defaultFun.getModelCount(usermodel, searchinfo, function (err, usercount) {
                returninfo = {
                    pageInfo: {
                        totalItems: usercount,
                        currentPage: index,
                        limit: limit,
                        pagecount: Math.floor(usercount / limit) + 1
                    },
                    datalist: data
                }
                res.json(new BaseReturnInfo(1, "", returninfo));
            })
        });
}