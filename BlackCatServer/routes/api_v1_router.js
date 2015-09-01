/**
 * Created by metis on 2015-08-31.
 */

var express   = require('express');
var appsystemController=require('../app/apiv1/appsystem');
var userController=require('../app/apiv1/users');

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
//用户登录
/*v1.post('/userinfo/userlogin', userroutes.UserLogin);*/
//------------------------用户信息----------------------------------
// 获取验证码
v1.get('/code/:mobile', userController.fetchCode);
v1.post('/userinfo/signup', userController.postSignUp);
//获取附近的驾校
v1.get('/driveschool/nearby', userController.postSignUp);


//=======================================================================

module.exports = v1;