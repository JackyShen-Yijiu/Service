/**
 * Created by li on 2015/11/11.
 */
// 系统 配置项
//  app配置基本信息
exports.appconfiginfo={
    appname:"极致驾服",  // appname  一步学车  极致驾服
    companyname:"极致驾服" ,  // 公司名称  一步科技 极致驾服
    appport:8183,       //app  端口  一步 8181  极致 8183
}
exports.smsconfig={
    ext:"1"       //一步是空 极致2427511
}
// 支付宝配置信息
exports.AlipayConfig = {
    //↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    // 合作身份者ID，以2088开头由16位纯数字组成的字符串
    partner:"2088221033158753",

// 交易安全检验码，由数字和字母组成的32位字符串
    key:"xjz579z3wds1kd9244pfeu9r8ha913ta",
    // z支付宝公钥

    alipaypubkey:"-----BEGIN PUBLIC KEY-----"+ "\r\n" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnxj/9qwVfgoUh/y2W89L6BkR"+ "\r\n" +
    "AFljhNhgPdyPuBV64bfQNN1PjbCzkIM6qRdKBoLPXmKKMiFYnkd6rAoprih3/Pr"+ "\r\n" +
    "QEB/VsW8OoM8fxn67UDYuyBTqA23MML9q1+ilIZwBC2AQ2UBVOrFXfFl75p6/B5"+ "\r\n" +
    "KsiNG9zpgmLCUYuLkxpLQIDAQAB"+ "\r\n" +
    "-----END PUBLIC KEY-----",
    //alipaypubkey:"-----BEGIN PUBLIC KEY-----"+ "\r\n" +
    //"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDNb6OYvMg1/V8W1Ye4wQU+WuvA"+ "\r\n" +
    //"dyA0r/Up+wQf3lJjJ/7Gqq50pWZyU3Z1KK/WFLiMGVjWh21RXyM6KhT/Tc/ksZ7y"+ "\r\n" +
    //"q2cdNfisBpCZEFoMA9fWTA2e1vj5dqf3aUpjrF2uWlUPOP46GqY8wlNuucI6GXjY"+ "\r\n" +
    //"Bft05bvOarnFKjbUQQIDAQAB"+ "\r\n" +
    //"-----END PUBLIC KEY-----",

// 签约支付宝账号或卖家收款支付宝帐户
    seller_email:"jizhipay@joyincorp.com",

// 支付宝服务器通知的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
// 必须保证其地址能够在互联网中访问的到
    notify_url:"http://127.0.0.1:3000/paynotify",

// 当前页面跳转后的页面 要用 http://格式的完整路径，不允许加?id:123这类自定义参数
// 域名不能写成http://localhost/create_direct_pay_by_user_jsp_utf8/return_url.jsp ，否则会导致return_url执行无效
    return_url:"http://127.0.0.1:3000/payreturn",

//      支付宝通知验证地址

    ALIPAY_HOST: "mapi.alipay.com",
    HTTPS_VERIFY_PATH: "/gateway.do?service=notify_verify&",
    ALIPAY_PATH:"gateway.do?",

//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


// 调试用，创建TXT日志路径
    log_path:"~/alipay_log_.txt",

// 字符编码格式 目前支持 gbk 或 utf-8
    input_charset:"UTF-8",

// 签名方式 不需修改
    sign_type:"MD5"
}


// 极光推送正式地址

exports.jpushCofig={
    Student:{
        AppKey:"3ed0386d38153e3768ef0f26",
        MasterSecret:"e24deeb5486ff165336cbdda"
    },
    Coach:{
        AppKey:"d4d7ba64212dbad5a2be2c0e",
        MasterSecret:"81f49b8a8b124a8d0f173f3f"
    },
    HeadMaster:{
        AppKey:"735aae789d2c47772abdd395",
        MasterSecret:"b3f1e56e8848ba16f44a49cc"
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
    client_id:"YXA6ONqXQN1QEeWtegnP9oHYeg",
    client_secret:"YXA6XReGe02mbcsd828ddCL-9aYsa2E",
    org_name:"black-cat",
    app_name:"jizhijaifu"
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
    redis_host: "101.200.204.240",
    //redis_host: "127.0.0.1",
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
    applyurl:"http://api.yibuxueche.com/validation/applyvalidation?userid=",
    producturl:"http://api.yibuxueche.com/validation/ordervalidation?orderid=",
    prodcutdetail:"http://api.yibuxueche.com/validation/getpageproductdetial?productid=",
    orderfinishurl:"http://api.yibuxueche.com/validation/getpageorderfinish?orderid="
}
