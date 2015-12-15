

/**
 * Created by li on 2015/10/24.
 */
var express   = require('express');
var router = express.Router();
var auditController=require('../app/web/appinfoaudit');
// 获取驾校验证界面
router.get('/applyvalidation',auditController.applyinfoAudit);
// 获取驾校验证码
router.get('/sendschoolcode',auditController.sendSchoolCode);
//
router.post('/doapplyvalidation',auditController.doapplyinfoAudit);
// 获取商品验证页面
router.get("/ordervalidation",auditController.getOrderScanInfo);
router.get('/sendmerchantcode',auditController.sendMerchant);
router.post("/doordervalidation",auditController.doOrderScanAudit);
module.exports = router;