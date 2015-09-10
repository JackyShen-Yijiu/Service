/**
 * Created by v-lyf on 2015/9/1.
 */
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var driverSchool=require('../../Server/driveschool_server');
exports.getNearbydriveSchool=function(req,res){
    var latitude = parseFloat(req.query.latitude);
    var longitude = parseFloat(req.query.longitude);
    var radius = req.query.radius ? parseInt(req.query.radius) : 1000;
    driverSchool.getNearDriverSchool(latitude,longitude,radius,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
};
exports.getNearbytrainingfield=function(req,res){
    var latitude = parseFloat(req.query.latitude);
    var longitude = parseFloat(req.query.longitude);
    var radius = req.query.radius ? parseInt(req.query.radius) : 1000;
    driverSchool.getNeartrainingfield(latitude,longitude,radius,function(err,data){
        if (err)
        {
            return res.json(new BaseReturnInfo(0,err,""));
        }else{
            return res.json(new BaseReturnInfo(1,"",data));
        }
    });
};
//获取可以报名的课程类型
exports.getSchoolClassType=function(req,res){
    var  schoolid=req.params.schoolid;
    if (schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    driverSchool.getClassTypeBySchoolId(schoolid,function(err,classtypedata){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",classtypedata));
    });
}

//获取驾校详情
exports.getSchoolInfo=function(req,res){
    var  schoolid=req.params.schoolid;
    if (schoolid===undefined){
        return res.json(new BaseReturnInfo(0,"获取参数错误",""));
    }
    driverSchool.getSchoolInfoserver(schoolid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,""));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    });
};
