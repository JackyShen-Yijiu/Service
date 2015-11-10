//var apiHost = 'http://192.168.1.102:3600/';//"http://123.57.254.32:4000/";
//var apiHost = 'http://123.57.7.30:3600/';
//var apiHost = 'http://127.0.0.1:3600/';
var apiHost = 'http://192.168.7.101:3600/';
$.ajaxSetup({
  contentType: "application/json; charset=utf-8",
  crossDomain: true
});

var vipserver=[
    {
        id:0,
        name:"接送"
    },
    {
        id:1,
        name:"午餐"
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
];

var subjects=[
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

];

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}