/**
 * Created by v-yaf_000 on 2016/3/25.
 */

var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var courseserverv2=require('../../Server/course_serverv2');

// 教练获取某一天 按时段的上课信息
exports.getCoachDayTimelysreservation=function(req,res){
    var  coachid=req.query.coachid;
    var  date=req.query.date;
    if (coachid===undefined|| date===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    if(coachid!=req.userId){
        return res.json(
            new BaseReturnInfo(0,"无法确认请求用户",[]));
    };
    courseserverv2.getCoachDayTimelysreservation(coachid,date,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,[]));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });

};

// 教练预约列表中的学员详情
exports.getstudentdetialinfo=function(req,res){
    var  userid=req.query.userid;
    if (userid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",[]));
    }
    courseserverv2.getstudentdetialinfo(coachid,function(err,data){
        if (err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
}