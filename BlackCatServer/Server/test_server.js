var mongodb = require('../models/mongodb.js');
var schoolModel=mongodb.DriveSchoolModel;
var schoolclassModel=mongodb.ClassTypeModel;
var trainingfieldModel=mongodb.TrainingFieldModel;
var usercount=mongodb.UserCountModel;
var headlinenews=mongodb.HeadLineNewsModel;
var IM=require('../Common/IM/mobIm');

exports.adddriveschool=function(callback){
    var school=new schoolModel();
     school.name="北京海淀驾校";
     school.latitude= 40.096263;
     school.longitude=116.127921 ;
     school.loc.coordinates=[116.127921,40.096263];
    school.maxprice=5000;
    school.minprice=3000;
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
    headline.type=1;
    headline.linkurl="http://123.57.7.30:3600/question";
    headline.is_using=true;
    headline.save();
    var headline=new    headlinenews();
    headline.newsname="教练信息";
    headline.headportrait.originalpic="http://7xnjg0.com1.z0.glb.clouddn.com/40f58723dae34a88a61df26ee98d4218.jpg";
    headline.createtime=new Date();
    headline.type=2;
    headline.linkurl="5616352721ec29041a9af889";
    headline.is_using=true;
    headline.save();

    var headline=new    headlinenews();
    headline.newsname="驾校信息";
    headline.headportrait.originalpic="http://7xnjg0.com1.z0.glb.clouddn.com/20140719222416-1080523700.jpg";
    headline.createtime=new Date();
    headline.type=2;
    headline.linkurl="561724502ab613ec10384e0c";
    headline.is_using=true;
    headline.save();

    return callback(null ,"success");

}
exports.addaddtrainingfield=function(callback){
    var field=new trainingfieldModel();
    field.fieldname="海淀练场";
    field.latitude= 40.096263;
    field.longitude=116.127921 ;
    field.loc.coordinates=[field.longitude,field.latitude];
    field.address="北清路148号",
    field. responsible="掌声";
    field.phone="67899";
    field.capacity=5;

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
    schoolclass.classname="海淀暑假班";
    schoolclass.schoolid=new mongodb.ObjectId('56163c376816a9741248b7f9');
    schoolclass.begintime=new Date("2015-09-08 21:06:00");
    schoolclass.endtime=new Date("2015-12-08 21:06:00");
    schoolclass.is_using=true;
    schoolclass.is_vip=true;
    schoolclass.classdesc="特惠会！";
    schoolclass.price=4700;
    schoolclass.carmodel.modelsid=1;
    schoolclass.carmodel.name="小型汽车手动挡";
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