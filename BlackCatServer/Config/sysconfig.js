/**
 * Created by li on 2015/11/11.
 */
// 系统 配置项
// 极光推送

exports.jpushCofig={
    Student:{
        AppKey:"a9d3780a093c23df7e3e2402",
        MasterSecret:"5494f71312c9ffe366f7bb9f"
    },
    Coach:{
        AppKey:"02d3ec8bfbcdd85634f0c24d",
        MasterSecret:"acf73174a9fd1a8ba149882f"
    },
    is_push:true,  // 推送消息
    is_debug:false   //是否是测试状态
}

// 极光推送正式地址

//exports.jpushCofig={
//    Student:{
//        AppKey:"d9f9dc8db6bc3dd2c913ced0",
//        MasterSecret:"debb46435e738c43c2a200ef"
//    },
//    Coach:{
//        AppKey:"099332657d28a65d5308af2a",
//        MasterSecret:"a37f1a213d8972963f718ea8"
//    },
//    is_push:true,  // 推送消息
//    is_debug:false   //是否是测试状态
//}

// 测试环信im配置地址

exports.imConfig={
    client_id:"YXA6In9icIkvEeWcN8Xg9ZIE7w",
    client_secret:"YXA66Vo2yOfs5iupNCButKMuFmfnTdY",
    org_name:"black-cat",
    app_name:"yibuxuechetest"
}

//// 环信正式版
//exports.imConfig={
//    client_id:"YXA663xwEIkuEeW9qmOsf__X8A",
//    client_secret:"YXA6WC4NmA71-YQ49tAKYHHqS4sCRt4",
//    org_name:"black-cat",
//    app_name:"yibuxuecheprod"
//}


// redis 配置， 测试库
exports.redisConfig={
    redis_host: "101.200.204.240",
    redis_port: 6379,
    redis_db: 0
}