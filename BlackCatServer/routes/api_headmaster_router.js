/**
 * Created by li on 2015/11/27.
 */
// 校长端所有api 路由

var express   = require('express');
var  router = express.Router();
var userCenterController=require('../app/apiHeadMaster/userCenter_controller');
router.get('/test',function(req,res){
    return res.json("hello, BlackCat HeadMaster");
});

//校长登录
router.post('/userinfo/userlogin', userCenterController.headMasterLogin);

// 获取更多数据
//router.get('/statistics/getmoredata', userCenterController.getmoredata);

// 获取行业资讯
router.get('/info/getnews', userCenterController.getIndustryNews);


module.exports = router;