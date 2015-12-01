/**
 * Created by li on 2015/11/27.
 */
// 校长端所有api 路由

var express   = require('express');
var  router = express.Router();
var userCenterController=require('../app/apiHeadMaster/userCenter_controller');
var statisitcsController=require('../app/apiHeadMaster/infostatisitcs_controller');
var ensureAuthorizedController=require('../app/apiv1/authenticate_controller');


// 测试接口
router.get('/test',function(req,res){
    return res.json("hello, BlackCat HeadMaster");
});

//校长登录
router.post('/userinfo/userlogin', userCenterController.headMasterLogin);

// 获取更多数据
//router.get('/statistics/getmoredata', userCenterController.getmoredata);

//统计主页数据  / 天昨天 周
router.get("/statistics/getmainpagedata",ensureAuthorizedController.ensureAuthorized,statisitcsController.getMainPageData);

// 统计更多数据详情数据 日/昨天/周/月/年
router.get("/statistics/getmoredata",ensureAuthorizedController.ensureAuthorized,statisitcsController.getMoreData);




// 获取行业资讯
router.get('/info/getnews', userCenterController.getIndustryNews);
router.get("/info/getweather",userCenterController.getWeatherinfo);


module.exports = router;