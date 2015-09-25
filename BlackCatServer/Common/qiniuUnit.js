/**
 * Created by v-lyf on 2015/9/15.
 */
var qiniucinfig = require('../Config/qiniuconfig.js');
var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = qiniucinfig.ACCESS_KEY;
qiniu.conf.SECRET_KEY = qiniucinfig.SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(qiniucinfig.Bucket_Name);

exports.getQiniuUpToken=function(){
    return uptoken.token();
}
