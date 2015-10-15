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

// 用户反馈
v1.post("/userfeedback",appsystemController.postUserFeedBack);

//======================================用户信息======================================
// 获取验证码
v1.get('/code/:mobile', userController.fetchCode);
// 检验验证码 (用户登后修改验证码使用)
//v1.post('/Verification/:mobile', userController.fetchCode);
//用户注册
v1.post('/userinfo/signup', userController.postSignUp);
//用户登录
v1.post('/userinfo/userlogin', userController.UserLogin);
// 用户报名
v1.post('/userinfo/userapplyschool',ensureAuthorizedController.ensureAuthorized,userController.postapplySchool);
// 用户更新信息
v1.post('/userinfo/updateuserinfo',ensureAuthorizedController.ensureAuthorized,userController.updateUserInfo);
v1.post('/userinfo/updatecoachinfo',ensureAuthorizedController.ensureAuthorized,userController.updateCoachInfo);
//根据用户或者教练的id获取基本信息
v1.get('/userinfo/getuserinfo/:type/userid/:userid',userController.getUserinfo);
// 修改密码
v1.post("/userinfo/updatepwd",userController.updatePassword);
//修改手机号
v1.post("/userinfo/updatemobile",ensureAuthorizedController.ensureAuthorized,userController.updateMobile);
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
v1.get('/driveschool/getschoolinfo/:schoolid', driveSchoolController.getSchoolInfo);
//获取教学的课程类型
v1.get("/driveschool/schoolclasstype/:schoolid",driveSchoolController.getSchoolClassType);
//获取附近的练车场
v1.get("/trainingfield/nearbytrainingfield",driveSchoolController.getNearbytrainingfield);
// 附近的教练
v1.get("/userinfo/nearbycoach", userController.getNearbyCoach);
// 获取驾校下面的教练
v1.get("/getschoolcoach/:schoolid/:index",userController.getSchoolCoach)


//==============================预约课程(学生端)=========================================
// 获取我当前可以预约的教练
v1.get("/userinfo/getusefulcoach/index/:index",ensureAuthorizedController.ensureAuthorized,userController.getUsefulCoachList);
// 获取教练课程安排
v1.get("/courseinfo/getcoursebycoach",courseController.GetCourseByCoach);
// 用户预约课程
v1.post("/courseinfo/userreservationcourse",ensureAuthorizedController.ensureAuthorized,courseController.postReservation);
// 获取我的订单 用户
v1.get("/courseinfo/getmyreservation",ensureAuthorizedController.ensureAuthorized,courseController.getuserresveration);
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

//=========================================教练端处理预约请求========================================================================================
// 教练获取学员列表个人信息中心
v1.get("/userinfo/coachstudentlist/:coachid/:index",ensureAuthorizedController.ensureAuthorized,userController.getStudentList);
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
//------------------------IM---------------
v1.get('/gettoken', testController.gettoken);
//-------------------------------------------------------------
//---------------------------------ceshishiyong---------------------------------------
v1.get('/addschool', testController.adddriveschool);
v1.get('/addschoolclass', testController.adddschoolclass);
v1.get('/addaddtrainingfield', testController.addaddtrainingfield);
v1.get("/initdata",testController.initData)

//------------------------------------------------------------------------------------
module.exports = v1;