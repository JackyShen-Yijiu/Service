var express = require('express');
var router = express.Router();
var mongodb = require('../../models/mongodb.js');
//管理员对象
var AdminUser = mongodb.AdminUser;
//管理员用户组对象
var AdminGroup = mongodb.AdminGroup;
//server
var adminserver=require("../server/adminserver");
var basedatafun=require("../server/basedatafun");
//数据校验
var validator = require('validator');
var cache=require("../../Common/cache");
var _ = require("underscore");
//站点配置
var settings = require("../models/config/settings");
//数据库操作对象
var DbOpt = require("../models/Dbopt");
var adminFunc = require("../models/adminFunc");
var PW = require('png-word');
var RW = require('../util/randomWord');
var rw = RW('abcdefghijklmnopqrstuvwxyz1234567890');
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var appsystemController=require('../../app/apiv1/appsystem_controller');

var options = require('../util/config.js').options;
var moment = require('moment');
var randomstring = require("randomstring");
var store = require('../util/store.js');
require('date-utils');
var pngword = new PW(PW.GRAY);

/* GET home page. */

var  returnAdminRouter=function(io) {
    router.get('/', function (req, res, next) {
        res.render('manger/adminLogin', {title:settings.SITETITLE});
    });

    //管理员登录验证码
    router.get('/vnum',function(req, res){
        var word = rw.random(4);
        req.session.vnum = word;
        console.log(word);
        pngword.createReadStream(word).pipe(res);
    });
    // 管理元登錄
    router.post("/doLogin",function(req,res){

        var userName = req.body.userName;
        var password = req.body.password;
        var vnum = req.body.vnum;
        console.log(req.body);
        var newPsd = DbOpt.encrypt(password,settings.encrypt_key);

        //if(vnum != req.session.vnum){
        //    res.end('验证码有误！');
        //}else
        {
            if(validator.isUserName(userName) && validator.isPsd(password))
            {

                AdminUser.findOne({'userName':userName,'password':newPsd
                     })
                   // .populate('group').
                    .exec(function(err,user){
                    if(err){
                        res.json(err);
                    }
                    if(user) {
                        req.session.adminPower = user.group.power;
                        req.session.adminlogined = true;
                        req.session.adminUserInfo = user;
//                    存入操作日志
//                        var loginLog = new SystemOptionLog();
//                        loginLog.type = 'login';
//                        loginLog.logs = user.userName + ' 登录，IP:' + adminFunc.getClienIp(req);
//                        loginLog.save(function (err) {
//                            if (err) {
//                                res.end(err);
//                            }
//                        });
                        if( req.session.adminUserInfo.usertype&& req.session.adminUserInfo.usertype==1) {
                            basedatafun.getschoolinfo(user.schoolid,function(err,data){
                                req.session.schooldata=data;
                                res.json(new BaseReturnInfo(1, "", "success"));
                            });
                        }
                        else {
                            res.json(new BaseReturnInfo(1, "", "success"));
                        }
                    }else
                    {
                        console.log("登录失败");

                        res.json(new  BaseReturnInfo(0,"用户名或密码错误",""));
                    }
                });

            }else{
                res.end(settings.system_illegal_param)
            }
        }
    });
    router.get('/logout', function(req, res, next) {
        req.session.adminlogined = false;
        req.session.adminPower = '';
        req.session.adminUserInfo = '';
        req.session.schooldata="";
        res.redirect("/");
    });

    // 主页信息
    router.get('/manage/main', function(req, res, next) {
        if( req.session.adminUserInfo.usertype&& req.session.adminUserInfo.usertype==1) {

            //req.session.schoolid=req.session.adminUserInfo.schoolid;
            //res.render('school/schoolmain', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/schoolmain"));
            res.redirect("schoolmain");
        }
        else{
            req.session.schooldata="";
            res.render('manger/index', adminFunc.setPageInfo(req, res, "/admin/manage/main"));
        }
    });
    router.get('/manage/schoollsit', function(req, res, next) {
        res.render('manger/schooollist2',adminFunc.setPageInfo(req,res,"/admin/manage/schoollsit"));
    });
    router.get('/manage/editschool', function(req, res, next) {
        res.render('manger/editSchool', {layout:"public/adminTemple"});
    });
    //  ==========================活动管理========================================
    router.get('/manage/activtylist', function(req, res, next) {
        res.render('manger/Activtylist' , adminFunc.setPageInfo(req,res,"/admin/manage/activtylist"));
    });
    //app首页活动页
    router.get("/manage/editActivty",function(req, res, next) {
        res.render('manger/editActivty', adminFunc.setPageInfo(req,res,"/admin/manage/editActivty"));
    });
    //========================================== 驾校信息主页====================================
    router.get('/manage/schoolmain', function(req, res, next) {
        req.session.schoolid=req.query.schoolid;
        if( req.session.adminUserInfo.usertype&& req.session.adminUserInfo.usertype==1) {
            req.session.schoolid=req.session.adminUserInfo.schoolid;
        };
        adminserver.getmainPagedata(req.session.schoolid,function(err,data){
            //console.log(data);
            req.session.schooldata=data.schooldata;
            res.render('school/schoolmain', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/schoolmain",data));
        })

    });
    router.get("/manage/trainingfieldlist" ,function(req, res, next) {
        res.render('school/trainingField', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/trainingfieldlist"));
    });
    router.get("/manage/edittrainingfield" ,function(req, res, next) {
        res.render('school/editTrainingField', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/trainingfieldlist"));
    });
    // 获取教练列表
    router.get("/manage/coachlist" ,function(req, res, next) {
        res.render('school/coachlist', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/coachlist"));
    });
    // 获取预约教练列表
    router.get("/manage/reserveCoach" ,function(req, res, next) {
        res.render('school/reserveCoach', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/reserveCoach"));
    });
    //编辑教练详情
    router.get("/manage/editcoachinfo" ,function(req, res, next) {
        var schoolid=req.session.schoolid;
        if(req.session.schoolid===undefined){
            return   res.render(error);
        }
        console.log(schoolid);
        basedatafun.getSchooltrainingfiled(schoolid,req.session.schooldata,function(err,data){
            filedlist=  _.map(data,function(item,i) {
                var info = {
                    id: item._id,
                    name: item.fieldname
                };
                return info;
            });
            console.log(filedlist);
            res.render('school/editCoach', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/editcoachinfo",filedlist));
        });

    });
    // 学员列表
    router.get("/manage/studentlist" ,function(req, res, next) {
        res.render('school/studentlist', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/studentlist"));
    });
    //编辑学员信息
    router.get("/manage/editstudentinfo" ,function(req, res, next) {
        var schoolid=req.session.schoolid;
        if(req.session.schoolid===undefined){
            return   res.render(error);
        }
        basedatafun.getschoolclasstype(schoolid,function(err,data){
            filedlist=  _.map(data,function(item,i) {
                var info = {
                    id: item._id,
                    name: item.classname
                };
                return info;
            });
            res.render('school/editStudent', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/editstudentinfo",filedlist));
        });

    });
    // app 设置
    router.get("/manage/appsetting" ,function(req, res, next) {
        res.render('school/appsetting',adminFunc.setSchoolPageInfo(req,res,"/admin/manage/appsetting"));
    });
    //获取班型列表
    router.get("/manage/classtypelist" ,function(req, res, next) {
        res.render('school/classtypelist', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/classtypelist"));
    });
    // 获取订单列表
    router.get("/manage/orderlist" ,function(req, res, next) {
        res.render('school/orderlist', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/orderlist"));
    });
    // 教练课程安排
    router.get("/manage/coachcourse" ,function(req, res, next) {
        res.render('school/coachcourse', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/coachcourse"));
    });
    // 订单详情
    router.get("/manage/orderdetial" ,function(req, res, next) {
        res.render('school/reservationdetial', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/orderdetial"));
    });
    //编辑班型信息
    router.get("/manage/editclasstype" ,function(req, res, next) {
        basedatafun.getvipserver(function(err,data){
            filedlist=  _.map(data,function(item,i) {
                var info = {
                    id: item._id,
                    name: item.name
                };
                return info;
            });

            res.render('school/editClassType', adminFunc.setSchoolPageInfo(req,res,"/admin/manage/editclasstype",filedlist));
        });

    });
//======================================================================================================================
    //获取Y码列表
    router.get("/manage/Ycodelist" ,function(req, res, next) {
        res.render('Ycode/Ycodelist', adminFunc.setPageInfo(req,res,"/admin/manage/Ycodelist"));
    });
    //报名记录
    router.get("/manage/recordlist" ,function(req, res, next) {
        res.render('apply-record/recordlist', adminFunc.setPageInfo(req,res,"/admin/manage/recordlist"));
    });
    //教练审核记录
    router.get("/manage/coachCheckList" ,function(req, res, next) {
        res.render('apply-record/coachCheckList', adminFunc.setPageInfo(req,res,"/admin/manage/coachCheckList"));
    });

    //商家管理
    router.get("/manage/businessList" ,function(req, res, next) {
        res.render('business/businessList', adminFunc.setPageInfo(req,res,"/admin/manage/businessList"));
    });
    //商品管理
    router.get("/manage/productslist" ,function(req, res, next) {
        res.render('business/mallproductlist', adminFunc.setPageInfo(req,res,"/admin/manage/productslist"));
    });
    //router.get("/manage/editBusiness" ,function(req, res, next) {
    //    res.render('business/editBusiness', adminFunc.setPageInfo(req,res,"/admin/manage/editBusiness"));
    //});

    //行业信息
    router.get("/manage/industrynewsList" ,function(req, res, next) {
        res.render('industryNews/industrynewsList', adminFunc.setPageInfo(req,res,"/admin/manage/industrynewsList"));
    });
    //获取咨询内容
    router.get("/manage/editIndustrynews" ,function(req, res, next) {
        res.render('industryNews/editIndustrynews', adminFunc.setPageInfo(req,res,"/admin/manage/editIndustrynews"));
    });
    router.get("/news" ,function(req, res, next) {
        var newsid=req.query.newsid;
        adminserver.getindustrynewsByid2(newsid,function(data){
            data.data.createtime2= (new Date(data.data.createtime)).toFormat("YYYY-MM-DD");
            console.log(data.data.createtime2);
            res.render('industryNews/Industrynews',data);
        })

    });
    // 用户管理
    router.get("/manage/adminusermanger" ,function(req, res, next) {
        basedatafun.getAllSchoolList(function(err,data){
            res.render('usermanger/userlist', adminFunc.setPageInfo(req,res,"/admin/manage/adminusermanger",data));
        })

    });

    //==================================================================================================================

    router.get("/manage/getstatic",function(req,res){
        res.json("test");
    });

    // 系统
    // 获取图片上传token
    router.get('/manage/qiniuuptoken', appsystemController.GetqiniuupToken2);
    router.get('/manage/carmodel', appsystemController.GetCarModel);
    // 获取申请报名人员信息
    router.get('/manage/getapplyschoolinfo',adminserver.getApplySchoolinfo);

    ///  驾校信息 处理
    router.get("/manage/getschoollist",adminserver.getSchoolist);
    router.post("/manage/saveschool",adminserver.saveSchoolInfo);
    router.post("/manage/updateschool",adminserver.updateSchoolInfo);
    router.get("/manage/getschoolbyid",adminserver.getSchoolInfoById);
    //  教练信息
    router.get("/manage/getCoachlist",adminserver.getCoachlist);
    router.post("/manage/savecoachinfo",adminserver.saveCoachInfo);
    router.get("/manage/getcoachbyid",adminserver.getcoachbyid);
    // 学员信息
    router.get("/manage/getstudentlist",adminserver.getstudentlist);
    router.get("/manage/getstudentbyid",adminserver.getstudentbyid);
    router.post("/manage/savestudentinfo",adminserver.saveStudentInfo);
    // 训练场信息处理
    router.get("/manage/gettrainingfieldlist",adminserver.getTrainingFieldList);
    router.get("/manage/gettrainingfieldbyid",adminserver.getTrainingFieldbyId);
    router.post("/manage/savetrainingfield",adminserver.saveTrainingField);
    router.post("/manage/updatetrainingfield",adminserver.updateTrainingField);
    //班型操作
    router.get("/manage/getclasstypelist",adminserver.classtypelist);
    router.get("/manage/getclasstypebyid",adminserver.getclasstypebyid);
    router.post("/manage/saveclasstype",adminserver.saveClassType);
    //订单管理
    router.get("/manage/getorderlist",adminserver.getorderlist);
    // 学员预约
    router.get("/manage/getUsefulCoachList",adminserver.getUsefulCoachList);
    // 获取教练课程安排
    router.get("/manage/getcoursebycoach",adminserver.getcoursebycoach);
    // 提交预约数据
    router.post("/manage/postReservation",adminserver.postReservation);
    // 学员审核成功
    router.post("/manage/auditstudentapplyinfo",adminserver.auditstudentapplyinfo);

    //=================================================================================================================

    // 活动管理
    router.get("/manage/getactivtylist",adminserver.getactivtylist);
    //保存活动信息
    router.post("/manage/updateactivty",adminserver.updateactivty);
    router.get("/manage/getactivitybyid",adminserver.getactivitybyid);
    //行业信息
    router.get("/manage/getindustrynewsList",adminserver.getindustrynewsList);
    router.get("/manage/getindustrynewsByid",adminserver.getindustrynewsByid);
    router.post("/manage/updateindustrynews",adminserver.updateindustrynews);
    // 商家管理
    router.get("/manage/getbusinesslist",adminserver.getbusinesslist);
    router.post("/manage/updatebusiness",adminserver.updatebusiness);
    router.get("/manage/getproductlist",adminserver.getproductlist);

    // 用户管理
    router.get("/manage/getadminuserlist",adminserver.getadminuserlist);

    router.get('/qiniu', function(req, res, next) {
        var params = req.query;
        var action = params['action'];
        if (action == 'config') {
            res.send(options.ueditorConfig);
        } else if (action == 'listimage' || action == 'listfile') {
            var start = parseInt(params['start'] || 0);
            var size = parseInt(params['size'] || 10);

            var storeParams = {
                prefix: action == 'listimage' ? 'image/' : 'file/',
                start: start,
                limit: size
            }

            store.listQiniu(storeParams, function(err, ret) {
                res.send(ret);
               // return next();
            })

        } else {
            res.send();
        }

       // return next();
    });

    router.post('/qiniu', function(req, res, next) {
        var params = req.query;

        var action = params['action'];
        console.log(action);
        var key = '/' + moment().format('YYYYMMDD') + '/' + (+new Date()) + randomstring.generate(6);
        switch (action) {
            case 'uploadvideo':
                key = 'video' + key;
                break;
            case 'uploadfile':
                key = 'file' + key;
                break;
            default:
                key = 'image' + key;
                break;
        }
        if (action == 'uploadimage' || action == 'uploadvideo' || action == 'uploadfile') {


            var file = req.files['upfile'];

            if (!file) {
                res.send();
              //  return next();
            }

            if (action == 'uploadfile') {
                key += '/' + file.name;
            }

            var storeParams = {
                key: key,
                filePath: file.path,
                fileName: file.name
            }

            store.fileToQiniu(storeParams, function(err, ret) {
                res.send(ret);
               // return next();
            })
        } else if (action == 'uploadscrawl') {
            var data = req.params['upfile'];
            if (!data) {
                res.send();
               // return next();
            }

            var storeParams = {
                key: key,
                data: new Buffer(data, 'base64')
            }

            store.dataToQiniu(storeParams, function(err, ret) {
                res.send(ret);
               // return next();
            })
        }
    });

return router;
}
module.exports = returnAdminRouter;