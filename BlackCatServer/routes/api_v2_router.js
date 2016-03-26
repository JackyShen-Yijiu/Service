/**
 * Created by li on 2015/10/24.
 */
var express   = require('express');
var ensureAuthorizedController=require('../app/apiv1/authenticate_controller');
var courseController=require("../app/apiv2/course_controller");
var v2 = express.Router();
v2.get('/test',function(req,res){
    return res.json("hello, jizhijiafu v2");
});
//===================================教练端==============
  // 教练获取某一天的按时段预约列表
v2.get("/courseinfo/daytimelysreservation",
      ensureAuthorizedController.ensureAuthorized, courseController.getCoachDayTimelysreservation);
// 预约列表中学员详情
v2.get("/courseinfo/studentdetialinfo",
    ensureAuthorizedController.ensureAuthorized, courseController.getstudentdetialinfo);

//  工时确认列表
v2.get("/courseinfo/getuconfirmcourse",
    ensureAuthorizedController.ensureAuthorized, courseController.getUConfirmCourse);
// 获取添加学员列表(没有预约学员列表)
v2.get("/courseinfo/getureservationuserlist",
    ensureAuthorizedController.ensureAuthorized, courseController.getUreservationUserList);

// 获取我的学员列表

v2.get("/courseinfo/getmystudentlist",
    ensureAuthorizedController.ensureAuthorized, courseController.getMyStudentList);


//========================================================


module.exports = v2;