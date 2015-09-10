var mongodb = require('../models/mongodb.js');
var schoolModel=mongodb.DriveSchoolModel;
var schoolclassModel=mongodb.ClassTypeModel;
var trainingfieldModel=mongodb.TrainingFieldModel;

exports.adddriveschool=function(callback){
    var school=new schoolModel();
     school.name="北京海淀驾校";
     school.latitude= 40.096263;
     school.longitude=116.127921 ;
     school.loc.coordinates=[116.127921,40.096263];
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
    schoolclass.schoolid=new mongodb.ObjectId('55e678f59a3e52d435783a18');
    schoolclass.begintime=new Date("2015-09-08 21:06:00");
    schoolclass.endtime=new Date("2015-09-08 21:06:00");
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