/**
 * Created by metis on 2015-08-31.
 */

var express   = require('express');
var appsystemController=require('../app/apiv1/appsystem');
var userController=require('../app/apiv1/users');

var v1 = express.Router();

//================================================ v1 api=================
//���Խӿ�
v1.get('/test',appsystemController.TestAPI);
// app�汾��Ϣ
v1.get('/appversion/:type', appsystemController.appVersion);

//��ȡ��Ŀ
v1.get('/info/subject', appsystemController.GetSubject);
// ��ȡ����
v1.get('/info/carmodel', appsystemController.GetCarModel);
//�û���¼
/*v1.post('/userinfo/userlogin', userroutes.UserLogin);*/
//------------------------�û���Ϣ----------------------------------
// ��ȡ��֤��
v1.get('/code/:mobile', userController.fetchCode);
v1.post('/userinfo/signup', userController.postSignUp);
//��ȡ�����ļ�У
v1.get('/driveschool/nearby', userController.postSignUp);


//=======================================================================

module.exports = v1;