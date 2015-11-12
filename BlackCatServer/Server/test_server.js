var mongodb = require('../models/mongodb.js');
var schoolModel=mongodb.DriveSchoolModel;
var schoolclassModel=mongodb.ClassTypeModel;
var trainingfieldModel=mongodb.TrainingFieldModel;
var usercount=mongodb.UserCountModel;
var headlinenews=mongodb.HeadLineNewsModel;
var IM=require('../Common/mobIm');

exports.adddriveschool=function(callback){
    var school=new schoolModel();
     school.name="北京北方驾校";
     school.latitude= 40.096263;
     school.longitude=120.127921 ;
     school.loc.coordinates=[120.127921,40.096263];
    school.maxprice=5000;
    school.minprice=3000;
    school.logoimg.originalpic="http://7xnjg0.com1.z0.glb.clouddn.com/20151018/1619315611292a193184140355c49a.png";
    school.passingrate=100
    school.hours="8:00--18:00"
    school.introduction="北京北方驾校";
    school.registertime=Date.now();
    school.address="北京市";
    school.responsible="王先生";
    school.phone="123456788"
    school.coachcount=50
    school.carcount=50
    school.schoollevel="一级"
    school.websit="www.baidu.com"
    //school._id=new mongodb.ObjectId("56163c376816a9741248b7f9");
    school.save(function(err,newshchool){
    if (err)
    {
     //   console.log("err");
      return   callback(err);
    }else
    {
       // console.log(newshchool);
       return  callback(null,newshchool);
    }
    });
};
exports.inindatabase=function(callback){
    usercount.findOne(function(err,count){
        if(err){
          return  callback(err);
        }
        console.log(count);
        if (!count){
            var newcount=new usercount();
            newcount.save(function(err,data){
                if (err)
                {
                    return   callback(err);
                }else
                {
                    return  callback(null,data);
                }
            })
        }else{
            return callback(null, count);
        }
    })

}
exports.addheadlinenews=function(callback) {
    var headline=new    headlinenews();
    headline.newsname="科目一考试试题";
    headline.headportrait.originalpic="http://7xnjg0.com1.z0.glb.clouddn.com/u=2116917190,1673171654&fm=21&gp=0.jpg";
    headline.createtime=new Date();
    headline.newtype=1;
    headline.linkurl="http://123.57.7.30:3600/question";
    headline.is_using=true;
    headline.save();
    var headline=new    headlinenews();
    headline.newsname="教练信息";
    headline.headportrait.originalpic="http://7xnjg0.com1.z0.glb.clouddn.com/40f58723dae34a88a61df26ee98d4218.jpg";
    headline.createtime=new Date();
    headline.newtype=2;
    headline.linkurl="5616352721ec29041a9af889";
    headline.is_using=true;
    headline.save();

    var headline=new    headlinenews();
    headline.newsname="驾校信息";
    headline.headportrait.originalpic="http://7xnjg0.com1.z0.glb.clouddn.com/20140719222416-1080523700.jpg";
    headline.createtime=new Date();
    headline.newtype=3;
    headline.linkurl="561724502ab613ec10384e0c";
    headline.is_using=true;
    headline.save();

    return callback(null ,"success");

}
exports.addaddtrainingfield=function(callback){
    var field=new trainingfieldModel();
    field.fieldname="北方驾校练车场";
    field.latitude= 40.096263;
    field.longitude=116.127921 ;
    field.loc.coordinates=[field.longitude,field.latitude];
    field.address="北清路148号",
    field. responsible="李先生";
    field.phone="67899";
    field.capacity=5;
    field.fielddesc="北方驾校练车场";
    field.driveschool="562dcd0fe87706a478b2495b";
    field.save(function(err,newshchool){
        if (err)
        {
            //   console.log("err");
            return   callback(err);
        }else
        {
            // console.log(newshchool);
            return  callback(null,newshchool);
        }
    });
};

exports.adddschoolclass=function(callback){
    var schoolclass=new schoolclassModel();
    schoolclass.classname="金龙普通班快班";
    schoolclass.schoolid=new mongodb.ObjectId('562dcc3ccb90f25c3bde40da');
    schoolclass.begintime=new Date("2015-09-08 21:06:00");
    schoolclass.endtime=new Date("2015-12-08 21:06:00");
    schoolclass.is_using=true;
    schoolclass.is_vip=false;
    schoolclass.classdesc="特惠会！";
    schoolclass.price=4700;
    schoolclass.carmodel.modelsid=1;
    schoolclass.carmodel.name="小型汽车手动挡";
    schoolclass.carmodel.code="C1";
    schoolclass.save(function(err,newshchool){
        if (err)
        {
            //   console.log("err");
            return   callback(err);
        }else
        {
            // console.log(newshchool);
            return  callback(null,newshchool);
        }
    });
};

exports.gettok=function(callback){
    IM.gettoken(function(data){
        callback(data);
    })
};