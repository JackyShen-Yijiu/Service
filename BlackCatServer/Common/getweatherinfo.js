/*
 * Created by li on 2015/11/30.
 */
// 根据   城市地址获取天气
// 使用百度天气api
// http://apistore.baidu.com/apiworks/servicedetail/515.html
var request = require('superagent');
var cache=require("./cache");
var  weatherconfig=require("../Config/sysconfig").weatherConfig;
exports.getWeather=function(cityname,callback) {
    var day = (new Date()).getDate();
    cache.get("weather"+day+cityname,function(err,data){
        //if(err){
        //    return callback(err);
        //}
        if (data){
            return callback(null ,data);
        }else{
            //"http://apis.baidu.com/showapi_open_bus/weather_showapi/address?area=%E5%8C%97%E4%BA%AC"
            request
                .get(weatherconfig.url+cityname)
                .set("apikey",weatherconfig.key)
                .end(function(err,res){
                    if(err){
                        return callback(err);
                    }
                    if (res.ok) {
                      var restinfo=JSON.parse(res.text);
                      if (restinfo.showapi_res_code==0){
                          var data=restinfo.showapi_res_body;
                          if(data.ret_code==0){
                          cache.set("weather"+day+cityname,data, 60*60, function(err,coachdata){});
                          return callback(null,data);
                          }else{
                              return callback(data.remark);
                          }
                      }else{
                          return callback(restinfo.showapi_res_error);
                      }
                    } else {
                    return   callback("查询天气出错")
                    }
                });
        }
    })

}

//test
// getWeather("北京",function(err,data){
//     console.log(err);
//     console.log(data);
// })