/**
 * Created by metis on 2015-08-31.
 */

var express   = require('express');
var appsystemController=require('../app/apiv1/appsystem_controller');
var userController=require('../app/apiv1/user_controller');
var driveSchoolController=require('../app/apiv1/school_controller');
var testController=require('../app/apiv1/testfile_controller');
var courseController=require("../app/apiv1/course_controller");
var ensureAuthorizedController=require('../app/apiv1/authenticate_controller');
var v1 = express.Router();

//================================================ v1 api=================
//测试接口
v1.get('/test',appsystemController.TestAPI);
//获取二维码
v1.get('/create_qrcode',appsystemController.createQrcode);
// app版本信息
v1.get('/appversion/:type', appsystemController.appVersion);

//获取科目
v1.get('/info/subject', appsystemController.GetSubject);
// 获取车型
v1.get('/info/carmodel', appsystemController.GetCarModel);
// 获取系统教练的工作时间
v1.get('/info/worktimes', appsystemController.GetWorkTimes);
// 获取图片上传token
v1.get('/info/qiniuuptoken', appsystemController.GetqiniuupToken);
// 获取科目一或科目四训考试题
v1.get("/info/examquestion",appsystemController.getExamQuestion);
// 获取头条信息
v1.get("/info/headlinenews",appsystemController.getHeadLineNews);
// 用户反馈
v1.post("/userfeedback",appsystemController.postUserFeedBack);
// 获取科目二和科目三的训练内容
v1.get("/trainingcontent",appsystemController.getTrainingContent);
//  获取课件信息
v1.get("/getcourseware",appsystemController.getCourseWare);
// 查看商品列表
v1.get("/getmailproduct",appsystemController.getMallProductList);
// 查看商品详情（同时进行商品浏览次数 +1）
v1.get("/getproductdetail",appsystemController.getProductDetail);
//  保存咨询信息
v1.post("/saveuserconsult",appsystemController.postUserConsult);
// 获取地址信息
//v1.get("/location",appsystemController.getLocation);

//======================================基础数据======================================

//=====================================Y码相关=======================================
  // 获取我的金币
v1.get("/userinfo/getmymoney",ensureAuthorizedController.ensureAuthorized,userController.getmymoney);
//======================================用户信息======================================
//  用户报名验证 v1.1 版
v1.post("/userinfo/enrollverificationv2",ensureAuthorizedController.ensureAuthorized,userController.postenrollverificationv2);
// 用户购买商品
v1.post("/userinfo/buyproduct",ensureAuthorizedController.ensureAuthorized,userController.userBuyProduct);
// 用户获取我购买的商品列表
v1.get("/userinfo/getmyorderlist",ensureAuthorizedController.ensureAuthorized,userController.getMyorderList);
// 获取验证码
v1.get('/code/:mobile', userController.fetchCode);
// 验证用户是否存在
v1.get("/userinfo/userexists",userController.verifyUserExists);
// 检验验证码 (用户登后修改验证码使用)
v1.get('/Verificationsmscode', userController.verificationSmscode);
//用户注册
v1.post('/userinfo/signup', userController.postSignUp);
//用户登录
v1.post('/userinfo/userlogin', userController.UserLogin);
// 用户报名
v1.post('/userinfo/userapplyschool',ensureAuthorizedController.ensureAuthorized,userController.postapplySchool);
// 用户报名验证（对于已经报名的用户）
v1.post("/userinfo/enrollverification",ensureAuthorizedController.ensureAuthorized,userController.postenrollverification);
// 获取我的报名状态
v1.get('/userinfo/getmyapplystate',ensureAuthorizedController.ensureAuthorized,userController.getMyApplyState);
// 用户更新信息
v1.post('/userinfo/updateuserinfo',ensureAuthorizedController.ensureAuthorized,userController.updateUserInfo);
v1.post('/userinfo/updatecoachinfo',ensureAuthorizedController.ensureAuthorized,userController.updateCoachInfo);
// 教练设置工作时间
v1.post("/userinfo/coachsetworktime",ensureAuthorizedController.ensureAuthorized,userController.coachSetWorkTime);
// 学员和教练同步个人设置
v1.post("/userinfo/personalsetting",ensureAuthorizedController.ensureAuthorized,userController.postPersonalSetting);
//教练申请验证
v1.post("/userinfo/applyverification",ensureAuthorizedController.ensureAuthorized,userController.coachApplyVerification);
//根据用户或者教练的id获取基本信息
v1.get('/userinfo/getuserinfo/:type/userid/:userid',userController.getUserinfo);
//  教练的登录后获取自己的详情(返回信息和登录信息一样)
v1.get('/userinfo/getcoachinfo',ensureAuthorizedController.ensureAuthorized,userController.getCoachinfo);
// 修改密码
v1.post("/userinfo/updatepwd",userController.updatePassword);
//修改手机号
v1.post("/userinfo/updatemobile",ensureAuthorizedController.ensureAuthorized,userController.updateMobile);
// 获取我的教练，教练端个人中 （我所有预约过教练）
v1.get("/userinfo/getmycoachlist",ensureAuthorizedController.ensureAuthorized,courseController.getMyCoachList);
// 获取我的钱包
v1.get("/userinfo/getmywallet",ensureAuthorizedController.ensureAuthorized,userController.getMyWallet);
//-----------------------------喜欢的教练操作----------------------------------------
// 喜欢的教练
v1.get("/userinfo/favoritecoach",ensureAuthorizedController.ensureAuthorized,userController.getMyFavoritCoach);
// 添加喜歡的教練
v1.put('/userinfo/favoritecoach/:id', ensureAuthorizedController.ensureAuthorized,userController.putFavorCoach);
// 删除我喜欢的教练
v1.delete('/userinfo/favoritecoach/:id',ensureAuthorizedController.ensureAuthorized, userController.delFavorrCoach);
//--------------------------------喜欢的驾校操作-------------------------------------------
// 获取我喜欢的驾校
v1.get("/userinfo/favoriteschool",ensureAuthorizedController.ensureAuthorized,userController.getMyFavoritSchool);
// 添加我喜欢的驾校
v1.put('/userinfo/favoriteschool/:id', ensureAuthorizedController.ensureAuthorized,userController.putFavorSchool);
// 删除我喜欢的驾校
v1.delete('/userinfo/favoriteschool/:id',ensureAuthorizedController.ensureAuthorized, userController.delFavorrSchool);


//获取附近的驾校
v1.get('/driveschool/nearbydriveschool', driveSchoolController.getNearbydriveSchool);
//获取驾校详情
v1.get('/driveschool/getschoolinfo/:schoolid',ensureAuthorizedController.getUseridByReq, driveSchoolController.getSchoolInfo);
//获取教学的课程类型
v1.get("/driveschool/schoolclasstype/:schoolid",driveSchoolController.getSchoolClassType);
//获取附近的练车场
v1.get("/trainingfield/nearbytrainingfield",driveSchoolController.getNearbytrainingfield);
// 附近的教练
v1.get("/userinfo/nearbycoach", userController.getNearbyCoach);
// 获取驾校下面的教练
v1.get("/getschoolcoach/:schoolid/:index",userController.getSchoolCoach);
// 获取驾校下面的练车场
v1.get("/getschooltrainingfield",driveSchoolController.getSchoolTrainingField);
//根据名称模糊查询练车场
v1.get("/getschoolbyname",driveSchoolController.getSchoolByName);
// 按 条件查询驾校列表
v1.get("/searchschool",driveSchoolController.searchSchool);
//用户获取开通个城市列表
v1.get("/getopencity",appsystemController.getOpenCitylist);


//==============================预约课程(学生端)=========================================

// 获取的报名结果信息
v1.get("/userinfo/getapplyschoolinfo",ensureAuthorizedController.ensureAuthorized,userController.getapplyschoolinfo);
// 获取我的预约进度
v1.get("/userinfo/getmyprogress",ensureAuthorizedController.ensureAuthorized,userController.getMyProgress);
// 获取我当前可以预约的教练
v1.get("/userinfo/getusefulcoach/index/:index",ensureAuthorizedController.ensureAuthorized,userController.getUsefulCoachList);
// 获取教练课程安排
v1.get("/courseinfo/getcoursebycoach",courseController.GetCourseByCoach);
// 用户预约课程
v1.post("/courseinfo/userreservationcourse",ensureAuthorizedController.ensureAuthorized,courseController.postReservation);
// 获取我的订单 用户
v1.get("/courseinfo/getmyreservation",ensureAuthorizedController.ensureAuthorized,courseController.getuserresveration);
// 根据预约id获取详情
v1.get("/courseinfo/userreservationinfo/:reservationid",ensureAuthorizedController.ensureAuthorized,
    courseController.userGetReservationInfo);
//获取课程的详信息
v1.get("/courseinfo/getcourse/:courseid",ensureAuthorizedController.ensureAuthorized,courseController.getCourseDeatil);
//用户取消预约
v1.post("/courseinfo/cancelreservation",ensureAuthorizedController.ensureAuthorized,courseController.userCancelReservation);
// 用户确认学完
v1.post("/courseinfo/finishreservation",ensureAuthorizedController.ensureAuthorized,courseController.userfinishReservation);
//用户投诉
v1.post("/courseinfo/usercomplaint",ensureAuthorizedController.ensureAuthorized,courseController.postUserComplaint);
// 用户评论
v1.post("/courseinfo/usercomment",ensureAuthorizedController.ensureAuthorized,courseController.postUserComment);
//获取教练的或者学生的评论
v1.get("/courseinfo/getusercomment/:type/:userid/:index",courseController.getUserComment);
//获取同时段学员
v1.get("/courseinfo/sametimestudents/reservationid/:reservationid/index/:index",courseController.sameTimeStudents);
// 用户报考
v1.post("/userinfo/applyexamination",ensureAuthorizedController.ensureAuthorized,userController.postApplyExamination);


//获取同时段学员
v1.get("/courseinfo/sametimestudentsv2",courseController.sameTimeStudentsv2);

//=========================================教练端处理预约请求========================================================================================
// 教练获取学员列表个人信息中心
v1.get("/userinfo/coachstudentlist",ensureAuthorizedController.ensureAuthorized,userController.getStudentList);
// 查看学员详情（预约学员详情页）
v1.get("/userinfo/studentinfo",ensureAuthorizedController.ensureAuthorized,userController.getStudentInfo);
// 获取我的选择班级的信息
v1.get("/userinfo/getcoachclasstype",ensureAuthorizedController.ensureAuthorized,userController.getCoachClassType);
// 教练设置班型
v1.post("/userinfo/coachsetclass",ensureAuthorizedController.ensureAuthorized,userController.postCoachSetClass);
// 教练请假接口
v1.post("/courseinfo/putcoachleave",ensureAuthorizedController.ensureAuthorized,courseController.postCoachLeave);
//教练获取预约列表
v1.get("/courseinfo/coachreservationlist",ensureAuthorizedController.ensureAuthorized,courseController.getCoachReservationList);
// 教练获取某一天的预约列表
v1.get("/courseinfo/daysreservationlist",ensureAuthorizedController.ensureAuthorized,courseController.getCoachDaysreservation);
// 教练获取预约详情
v1.get("/courseinfo/reservationinfo/:reservationid",ensureAuthorizedController.ensureAuthorized,courseController.coachGetReservationInfo)
//接受或者拒绝预约
v1.post("/courseinfo/coachhandleinfo",ensureAuthorizedController.ensureAuthorized,courseController.postCoachHandleInfo);
// 教练评价学员学习情况
v1.post("/courseinfo/coachcomment",ensureAuthorizedController.ensureAuthorized,courseController.postCoachComment);
// 教练完成预约
v1.post("/courseinfo/coachfinishreservation",ensureAuthorizedController.ensureAuthorized,courseController.coachfinishReservation);
//教练获取没有处理的预约（在消息模块）
v1.get("/courseinfo/getreservationapply",ensureAuthorizedController.ensureAuthorized,courseController.getreservationapply);

//-------------------------------------------------------------

//---------------------------------ceshishiyong---------------------------------------
v1.get('/addschool', testController.adddriveschool);
v1.get('/addschoolclass', testController.adddschoolclass);
v1.get('/addaddtrainingfield', testController.addaddtrainingfield);
v1.get('/addheadlinenews', testController.addheadlinenews);
v1.get("/initdata",testController.initData);

//------------------------------------------------------------------------------------
module.exports = v1;