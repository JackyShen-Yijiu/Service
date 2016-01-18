/**
 * Created by li on 2015/11/11.
 */
// 系统 配置项
// 极光推送



// 极光推送正式地址

exports.jpushCofig={
    Student:{
        AppKey:"d9f9dc8db6bc3dd2c913ced0",
        MasterSecret:"debb46435e738c43c2a200ef"
    },
    Coach:{
        AppKey:"099332657d28a65d5308af2a",
        MasterSecret:"a37f1a213d8972963f718ea8"
    },
    HeadMaster:{
        AppKey:"ad6f3ad01c2fad2ead8f9b08",
        MasterSecret:"d1e2f9048d82ddb5383f3ff2"
    },
    is_push:true,  // 推送消息
    is_debug:false   //是否是测试状态
}

// 测试环信im配置地址

 //exports.imConfig={
 //    client_id:"YXA6In9icIkvEeWcN8Xg9ZIE7w",
 //    client_secret:"YXA66Vo2yOfs5iupNCButKMuFmfnTdY",
 //    org_name:"black-cat",
 //    app_name:"yibuxuechetest"
 //}

//// 环信正式版
exports.imConfig={
   client_id:"YXA663xwEIkuEeW9qmOsf__X8A",
   client_secret:"YXA6WC4NmA71-YQ49tAKYHHqS4sCRt4",
   org_name:"black-cat",
   app_name:"yibuxuecheprod"
}


// redis 配置， 测试库
// exports.redisConfig={
//     redis_host: "101.200.204.240",
//     redis_port: 6379,
//     redis_db: 0,
//     redis_password:"yibuxueche"
// }

// redis 正式

exports.redisConfig={
    redis_host: "127.0.0.1",
    redis_port: 6379,
    redis_db: 0,
    redis_password:"yibuxueche"
}
// 获取天气接口设置
exports.weatherConfig={
    url:"http://apis.baidu.com/showapi_open_bus/weather_showapi/address?area=",
    key:"d059452d2ba517351f77c848a51428c6"
}

// 验证地址 test
// exports.validationurl={
//     applyurl:"http://101.200.204.240:8181/validation/applyvalidation?userid=",
//     producturl:"http://101.200.204.240:8181/validation/ordervalidation?orderid="
//prodcutdetail:"http://123.57.63.15:8181/validation/getpageproductdetial?productid=",
// orderfinishurl:"http://123.57.63.15:8181/validation/getpageorderfinish?orderid="
// }

// 教练标签颜色
exports.coachtagcolor=["#ffb814","#f76f56","#fe945b","#20d1bc","#45cbfb","#139ef7","#d755f2","#ef56b9"]
// 验证地址 正式

exports.validationurl={
    applyurl:"http://123.57.63.15:8181/validation/applyvalidation?userid=",
    producturl:"http://123.57.63.15:8181/validation/ordervalidation?orderid=",
    prodcutdetail:"http://123.57.63.15:8181/validation/getpageproductdetial?productid=",
    orderfinishurl:"http://123.57.63.15:8181/validation/getpageorderfinish?orderid="
}
