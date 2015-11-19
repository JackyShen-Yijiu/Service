/**
 * Created by v-lyf on 2015/9/8.
 */
//返回驾校信息
exports.resBaseSchoolInfo=function(school){
    this.schoolid=school._id;
    this.name=school.name;
    this.latitude=school.latitude;
    this.longitude=school.longitude;
    this.pictures=school.pictures;
    this.logoimg=school.logoimg;
    this.passingrate =school.passingrate;
    this.hours=school.hours;
    this.introduction=school.introduction;
    this.registertime=school.registertime;
    this.address=school.address;
    this.responsible=school.responsible;
    this.phone=school.phone;
    this.websit=school.websit;
    this. maxprice=school.maxprice;
    this.minprice=school.minprice;
    this.applynotes=school.applynotes;
    this.pictures_path=school.pictures_path;
};