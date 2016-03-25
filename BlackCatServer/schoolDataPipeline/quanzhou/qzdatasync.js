/**
 * Created by v-yaf_000 on 2016/3/22.
 */

    ///获取泉州驾校的相关信息
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var builder = xml2js.Builder();
var select = require('xpath.js')
    , dom = require('xmldom').DOMParser;
var request = require('superagent');
var  util=require("util");

//查询泉州数据
var searchdata="<?xml version='1.0' encoding='" +
"utf-8'?><soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' " +
    "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
    "<soap:Body><DriverStudentTrack xmlns='http://tempuri.org/'><userid>%s</userid>" +
    "<mac>%s</mac><xybh /><xm /><sfzh>%s</sfzh>" +
    "<bmrq_qs>%s</bmrq_qs><bmrq_zz>%s</bmrq_zz><drivecode>%s</drivecode></DriverStudentTrack></soap:Body>" +
    "</soap:Envelope>";
// 学生学时查询格式
var searchcoursedata="<?xml version='1.0' encoding='utf-8'?><soap:Envelope " +
    "xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' " +
    "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
    "xmlns:xsd='http://www.w3.org/2001/XMLSchema'><soap:Body>" +
    "<DriverStudentStudyTrackX xmlns='http://tempuri.org/'><" +
    "userid>%s</userid><mac>%s</mac>" +
    "<id>%s</id><sscx>%s</sscx></DriverStudentStudyTrackX></soap:Body></soap:Envelope>"
// 查询学生信息
var getStudentInfo=function(searchinfo,callback){
    var parms= util.format(searchdata, searchinfo.userid,searchinfo.mac,searchinfo.sfzh,searchinfo.bmrq_qs,searchinfo.bmrq_zz,searchinfo.drivecode);
    //console.log(parms);
    console.log("开始查询学生信息:"+searchinfo.sfzh);
    request
        .post("http://218.85.65.43:28001/SchoolService/StudentStudyRecord.asmx")
        .set('Content-Type', 'text/xml; charset=utf-8')
        .set('SOAPAction', 'http://tempuri.org/DriverStudentTrack')
        .send(parms).end(function(err, res){
        console.log("查询学生信息完成:"+searchinfo.sfzh);
        if(!err) {
            console.log(res.text);
            var doc = new dom().parseFromString(res.text);
            var errndoes= select(doc, "//err[1]/text");
            //console.log("err");
            //console.log(errndoes);
            var nodes = select(doc, "//NewDataSet");
            parseString(nodes.toString(), {explicitArray: false, ignoreAttrs: true}, function (err, result) {

                if(result) {
                    //console.log(result.NewDataSet.Table1);
                    return callback(err,result.NewDataSet.Table1);
                }
                else{
                    return callback(err);
                }
            })
        }else
        {
            return callback(err)
        }
    })

};

// 获取学生的学时信息
var getStudentCourseInfo=function(searchinfo,callback){
    var parms= util.format(searchcoursedata, searchinfo.userid,searchinfo.mac,searchinfo.id,searchinfo.sscx);
    //console.log(parms);
    console.log("开始查询学生学时信息:"+searchinfo.id);
    request
        .post("http://218.85.65.43:28001/SchoolService/StudentStudyRecord.asmx")
        .set('Content-Type', 'text/xml; charset=utf-8')
        .set('SOAPAction', 'http://tempuri.org/DriverStudentStudyTrackX')
        .send(parms).end(function(err, res){
        if(!err) {
            console.log("查询学生学时信息完成:"+searchinfo.id);
            var doc = new dom().parseFromString(res.text);
            var nodes = select(doc, "//NewDataSet");
            parseString(nodes.toString(), {explicitArray: false, ignoreAttrs: true}, function (err, result) {

                if(result) {
                    //console.log(result.NewDataSet.Table1);
                    return callback(err,result.NewDataSet.Table1);
                }
                else{
                    return callback(err);
                }

            })
        }else
        {
            return callback(err)
        }
    })
};

var searchinfo={
    userid:"24161",
    "mac":"+RtXiB3uEBEat9rlGdh6VZy5Gs1BvX9TdKHB2BlWVp0=",
    "xybh":"",
    "xm":"",
    "sfzh":"350521198910187341",
    "bmrq_qs":"2013/3/22",
    "bmrq_zz":"2016/3/22",
    "drivecode":"35010020",

}




//根据身份证号查询学生信息
exports.getStudentInfo=getStudentInfo;
// 根据学生id 查询学生课时
exports.getStudentCourseInfo=getStudentCourseInfo;
exports.getStudentCourseBySFZH=function(searchinfo,callback){
    getStudentInfo(searchinfo,function(err,data){
        if(data)
        {
            var searchcourseinfo={
                userid:searchinfo.userid,
                mac:searchinfo.mac,
                id:data.ID,
                sscx:data.SQCX,

            }
            getStudentCourseInfo(searchcourseinfo,function(err,coursedata){
                return callback(err,coursedata);
            })
        }else {
            return callback(err,data);
        }
    })
}


//  返回数据格式
//{ ID: '1938506',
//    XM: '刘萍萍',
//    XB: '女',
//    SFZH: '350521198910187341',
//    SQCX: 'C1',
//    LXDH: '18759936713',
//    BMRQ: '2015-03-23T00:00:00+08:00' }
//返回课程信息数据
//    [ { XYBH: '1938506',
//    XYXM: '刘萍萍',
//    SSCX: 'C1',
//    KM: '1',
//    LL: '779',   //已学理论
//    LL_XY: '0',  //理论剩余
//    ML: '0',   //已学模拟
//    ML_XY: '0',  // 模拟剩余
//    SJ: '0',     // 实操
//    SJ_XY: '0',  // 实操剩余
//    ZXS: '779',  // 已学总 学时
//    ZXS_XY: '0', //总学时剩余
//    KH: '通过' },
//{ XYBH: '1938506',
//    XYXM: '刘萍萍',
//    SSCX: 'C1',
//    KM: '2',
//    LL: '212',
//    LL_XY: '0',
//    ML: '240',
//    ML_XY: '0',
//    SJ: '1261',
//    SJ_XY: '0',
//    ZXS: '1773',
//    ZXS_XY: '0',
//    KH: '通过' },
//{ XYBH: '1938506',
//    XYXM: '刘萍萍',
//    SSCX: 'C1',
//    KM: '3',
//    LL: '0',
//    LL_XY: '960',
//    ML: '369',
//    ML_XY: '0',
//    SJ: '1200',
//    SJ_XY: '0',
//    ZXS: '1569',
//    ZXS_XY: '831',
//    KH: '未考核' } ]

