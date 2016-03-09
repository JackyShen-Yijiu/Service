/**
 * Created by metis on 2015-08-18.
 */
exports.subject=[
    {
        subjectid:0,
        name:'准备报考'

    },
    {
        subjectid:1,
        name:'科目一'

    },
    {
        subjectid:2,
        name:'科目二'

    },
    {
        subjectid:3,
        name:'科目三'

    }
    ,
    {
        subjectid:4,
        name:'科目四'

    },
    {
        subjectid:5,
        name:'新手上路'
    },
    {
        subjectid:6,
        name:'我是老鸟'

    }

]
exports.carmodels=[
    {modelsid:1,
        name:'手动挡汽车',
        code:"C1",
        desc:"准驾车型：小型、微型客汽车以及轻型、微型载货汽车，轻、小、微型专项作业车。C1准驾C2车型."
    },
    {
        modelsid:2,
        name:'自动挡汽车',
        code:"C2",
        desc:"小型、微型自动挡载客汽车以及轻型、微型自动挡载货汽车。"
    },
    {
        modelsid:3,
        name:"其他车型",
        code:"O",
        desc:"目前仅提供C1、C2驾照类型的在线预约服务。关于其他驾照类型的预约服务，请在客服人员跟进时特别咨询。"
    }
]

exports.vipserver=[
    {
        id:0,
        name:"接送",
        color:"#FF0000"
    },
    {
        id:1,
        name:"午餐",
        color:"#FF0000"
    },
    {
        id:2,
        name:"室内练车"
    },
    {
        id:3,
        name:"1:1"
    },
    {
        id:4,
        name:"包过"
    }
]


exports.trainingcontent={
    subjecttwo:["起步","直角转弯","侧方停车","曲线行驶","坡道定点停车和起步","倒车入库","综合练习"],
    subjectthree:["上车准备","起步","直线行驶","变更车道","通过路口","靠边停车","会车","超车","掉头","夜间行驶","综合练习"]
}

exports.worktimes=[
    {
        timeid:1,
        timespace:"5:00 - 6:00",
        begintime:"5:00:00",
        endtime:"6:00:00"
    },
    {
        timeid:2,
        timespace:"6:00 - 7:00",
        begintime:"6:00:00",
        endtime:"7:00:00"
    },
    {
        timeid:3,
        timespace:"7:00 - 8:00",
        begintime:"7:00:00",
        endtime:"8:00:00"
    },
    {
        timeid:4,
        timespace:"8:00 - 9:00",
        begintime:"8:00:00",
        endtime:"9:00:00"
    },
    {
        timeid:5,
        timespace:"9:00 - 10:00",
        begintime:"9:00:00",
        endtime:"10:00:00"
    },
    {
        timeid:6,
        timespace:"10:00 - 11:00",
        begintime:"10:00:00",
        endtime:"11:00:00"
    },
    {
        timeid:7,
        timespace:"11:00 - 12:00",
        begintime:"11:00:00",
        endtime:"12:00:00"
    },
    {
        timeid:8,
        timespace:"12:00 - 13:00",
        begintime:"12:00:00",
        endtime:"13:00:00"
    },
    {
        timeid:9,
        timespace:":13:00 - 14:00",
        begintime:"13:00:00",
        endtime:"14:00:00"
    },
    {
        timeid:10,
        timespace:"14:00 - 15:00",
        begintime:"14:00:00",
        endtime:"15:00:00"
    },
    {
        timeid:11,
        timespace:"15:00 - 16:00",
        begintime:"15:00:00",
        endtime:"16:00:00"
    },
    {
        timeid:12,
        timespace:"16:00 - 17:00",
        begintime:"16:00:00",
        endtime:"17:00:00"
    },
    {
        timeid:13,
        timespace:"17:00 - 18:00",
        begintime:"17:00:00",
        endtime:"18:00:00"
    }
    ,
    {
        timeid:14,
        timespace:"18:00 - 19:00",
        begintime:"18:00:00",
        endtime:"19:00:00"
    },
    {
        timeid:15,
        timespace:"19:00 - 20:00",
        begintime:"19:00:00",
        endtime:"20:00:00"
    },
    {
        timeid:16,
        timespace:"20:00 - 21:00",
        begintime:"20:00:00",
        endtime:"21:00:00"
    },
    {
        timeid:17,
        timespace:"21:00 - 22:00",
        begintime:"21:00:00",
        endtime:"22:00:00"
    }
]
exports.examquestioninfo={
    subjectone:{questionlisturl:"http://www.yibuxueche.com/question",
        questiontesturl:"http://www.yibuxueche.com/questiontest",
        questionerrorurl:"http://www.yibuxueche.com/questionwronglist",
        kemuyichengjidanurl:"http://www.yibuxueche.com/myscore.html",
        kemusichengjidanurl:"http://www.yibuxueche.com/myscore.html",

    },

subjectfour:{questionlisturl:"http://www.yibuxueche.com/questionlist-kemusi.html",
    questiontesturl:"http://www.yibuxueche.com/questiontest-kemusi.html",
    questionerrorurl:"http://www.yibuxueche.com/questionwronglist-kemusi.html",
    kemusichengjidanurl:"http://www.yibuxueche.com/myscore.html",
}
}
exports.integralrule={
    selfregister:100,  //自己注册奖励
    // 被别人邀请注册奖励
    passiveregister:300,
    // 每级比例分成
    levelscale:0.5
}