var express = require('express');
var router = express.Router();
//管理员对象
var AdminUser = require("../models/AdminUser");
//管理员用户组对象
var AdminGroup = require("../models/AdminGroup");
//server
var adminserver=require("../server/adminserver");
//数据校验
var validator = require('validator');

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

                AdminUser.findOne({'userName':userName//,'password':newPsd
                     }).populate('group').exec(function(err,user){
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
                        res.json(new  BaseReturnInfo(1,"","success"));
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

    router.get('/manage/schoollsit', function(req, res, next) {
        res.render('manger/schooollist2',adminFunc.setPageInfo(req,res,"/admin/manage/schoollsit"));
});
    router.get('/manage/editschool', function(req, res, next) {
        res.render('manger/editSchool', {layout:"public/adminTemple"});
    });

    router.get("/manage/getstatic",function(req,res){
        res.json("test");
    });

    // 系统
    // 获取图片上传token
    router.get('/manage/qiniuuptoken', appsystemController.GetqiniuupToken2);
    router.get('/manage/carmodel', appsystemController.GetCarModel);
    ///  驾校信息 处理

    router.get("/manage/getschoollist",adminserver.getSchoolist);
    router.post("/manage/saveschool",adminserver.saveSchoolInfo);
    router.post("/manage/updateschool",adminserver.updateSchoolInfo);
    router.get("/manage/getschoolbyid",adminserver.getSchoolInfoById);
    // 训练场信息处理
    router.get("/manage/gettrainingfieldlist",adminserver.getTrainingFieldList);
    router.get("/manage/gettrainingfieldbyid",adminserver.getTrainingFieldbyId);
    router.post("/manage/savetrainingfield",adminserver.saveTrainingField);
    router.post("/manage/updatetrainingfield",adminserver.updateTrainingField);
    //班型操作
    router.post("/manage/saveclasstype",adminserver.saveClassType);

return router;
}
module.exports = returnAdminRouter;