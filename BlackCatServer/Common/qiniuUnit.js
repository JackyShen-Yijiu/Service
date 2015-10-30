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

exports.uploadFile = function(localFile, callback) {
	console.log('uploading file to qiniu');
	var fileName = localFile.substring(localFile.lastIndexOf("/") + 1);
	var key = Math.random() + '-' + fileName;
	var extra = new qiniu.io.PutExtra();
	//extra.params = params;
	//extra.mimeType = mimeType;
	//extra.crc32 = crc32;
	//extra.checkCrc = checkCrc;

	qiniu.io.putFile(uptoken.token(), key, localFile, extra, function(err, ret) {
		if(!err) {
		  // 上传成功， 处理返回值
		  console.log(ret.key, ret.hash);
		  // ret.key & ret.hash
		} else {
		  // 上传失败， 处理返回代码
		  console.log(err);
		  // http://developer.qiniu.com/docs/v6/api/reference/codes.html
		}
		callback(err, qiniucinfig.Domain + ret.key);
	});
}
