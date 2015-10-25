$.ajaxSetup({
  contentType: "application/json; charset=utf-8",
  crossDomain: true
});
//var apiHost = 'http://192.168.1.102:3600/';//"http://123.57.254.32:4000/";
//var apiHost = 'http://123.57.7.30:3600/';
var apiHost = 'http://192.168.1.102:3600/';
//var apiHost = 'http://192.168.7.100:3600/';

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
var userID = getUrlParam('userid'); 
var userInfo;
console.log(getUrlParam('userid'));

function init() {
    console.log('init.');
    startTime();
    nextQestion();
}

function getQuestionList(id, callback){
    console.log("get question list");
    $.get(apiHost + "question/questionlist/" + id,
        function(data){
          callback(data, "OK");
        }).fail(function(xHr, status, message){
        callback(message, "Fail");
    });
}

function getQuestionByID(id, callback){
    console.log("get question list");
    $.get(apiHost + "question/questionbyid/" + id,
        function(data){
          callback(data, "OK");
        }).fail(function(xHr, status, message){
        callback(message, "Fail");
    });
}

function showQuestions(questoinBody) {
  console.log("show questoin");
  answered = false;
  currentQuestion = questoinBody;
  $("#question_title").text(questoinBody.question);
  $("#rightAnswer").hide();
  $("#wrongAnswer").hide();
  $("#rightAnswer_txt").hide();
  $("#answer1").prop("checked", false);
  $("#answer2").prop("checked", false);
  $("#answer3").prop("checked", false);
  $("#answer4").prop("checked", false);

  $("#img_ans_1").attr("src","../images/null-check-marks.png");
  $("#img_ans_2").attr("src","../images/null-check-marks.png");
  $("#img_ans_3").attr("src","../images/null-check-marks.png");
  $("#img_ans_4").attr("src","../images/null-check-marks.png");
  if(questoinBody.sinaimg != ""){
    $("#question_img").show();
    $("#question_img").attr("src","../images/kemuyi/img-600/" + questoinBody.sinaimg);
  }else{
    $("#question_img").hide();
  }

  if(questoinBody.Type == 2){
    $("#answer1_txt").text("A：" + questoinBody.a);
    $("#answer2_txt").text("B：" + questoinBody.b);
    $("#answer3_txt").text("C：" + questoinBody.c);
    $("#answer4_txt").text("D：" + questoinBody.d);

    $("#answer3").show();
    $("#answer3_txt").show();
    $("#answer4").show();
    $("#answer4_txt").show();
  }else if(questoinBody.Type == 1){
    $("#answer1_txt").text("正确");
    $("#answer2_txt").text("错误");
    $("#answer3").hide();
    $("#answer3_txt").hide();
    $("#answer4").hide();
    $("#answer4_txt").hide();
  }

  $("#rightAnswer_txt").text(questoinBody.bestanswer);
}

var chapexamids = [[1,365],[2541,2640],[10923,10925],[10930,10931],[10938,10962],[10964,10971],[10978,10978],[10987,10995],[10998,11009],[11015,11015],[11022,11034],[11046,11046],[11049,11054],[11057,11078]];
var myExamID = new Array(568);
var myExamOrder = new Array(568);
var arri = 0;

var j = 0;

for (var i = 0, len = chapexamids.length; i < len; i++) {
  for (var minm = chapexamids[i][0], maxm = chapexamids[i][1]; minm <= maxm; minm++) {
    myExamID[arri] = minm;
    arri++;
  }
}

for ( myExamOrderid = 0; myExamOrderid < 568; myExamOrderid++) {
  myExamOrder[myExamOrderid] = myExamOrderid + 1
}

var Allcount = 100;
var QIndex = 0;
var currentQuestion;
var rightCount=0, wrongCount=0;
var answered=false;

function nextQestion(){
  if(QIndex < Allcount){
    console.log("next");
    $("#number_title").text(++QIndex);
    getQuestionByID(myExamID[QIndex - 1], showQuestions);
  }
}
function preQestion(){
  if(QIndex > 1){
    console.log("next");
    $("#number_title").text(--QIndex);
    getQuestionByID(myExamID[QIndex - 1], showQuestions);
  }
}
function answerIsRight(){
  //$("#rightAnswer").show();
  //$("#wrongAnswer").hide();
  if(answered == false){
    answered = true;
    rightCount++;
    $("#rightCount").text(rightCount);
    $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)));
  }
}
function answerIsWrong(){
  //$("#rightAnswer").hide();
  //$("#wrongAnswer").show();
    if(answered == false){
      answered = true;
      wrongCount++;
      $("#wrongCount").text(wrongCount);
      $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)));
  }
}
function tjanswer_delete(answer){
  console.log("tjanswer" + answer + " " + currentQuestion.ta);
  $("#rightAnswer_txt").show();

  if($("#answer1").is(':visible') == true){
    $("#img_ans_1").attr("src","../images/wrong-check-marks.png");
  }
  if($("#answer2").is(':visible') == true){
    $("#img_ans_2").attr("src","../images/wrong-check-marks.png");
  }
  if($("#answer3").is(':visible') == true){
    $("#img_ans_3").attr("src","../images/wrong-check-marks.png");
  }
  if($("#answer4").is(':visible') == true){
    $("#img_ans_4").attr("src","../images/wrong-check-marks.png");
  }

  switch(currentQuestion.ta){
    case 1:
      $("#img_ans_1").attr("src","../images/right-check-marks.png");
      break;
    case 2:
      $("#img_ans_2").attr("src","../images/right-check-marks.png");
      break;
    case 3:
      $("#img_ans_3").attr("src","../images/right-check-marks.png");
      break;
    case 4:
      $("#img_ans_4").attr("src","../images/right-check-marks.png");
      break;
  }

  switch(answer){
    case "A":
      if(currentQuestion.ta == 1){
        answerIsRight();
      }else{
        console.log("A wrong");
        answerIsWrong();
      }
      break;
    case "B":
      if(currentQuestion.ta == "2"){
        $("#img_ans_2").attr("src","../images/right-check-marks.png");
        answerIsRight();
      }else{
        console.log("B wrong");
        answerIsWrong();
      }
      break;
    case "C":
      if(currentQuestion.ta == 3){
        $("#img_ans_3").attr("src","../images/right-check-marks.png");
        answerIsRight();
      }else{
        console.log("C wrong");
        answerIsWrong();
      }
      break;
    case "D":
      if(currentQuestion.ta == 4){
        $("#img_ans_4").attr("src","../images/right-check-marks.png");
        answerIsRight();
      }else{
        console.log("D wrong");
        answerIsWrong();
      }
      break;
  }
}

var min = 45;
var sec = 0;
var t;

function startTime()
{
  console.log("start timer");

  sec--;
  if(sec < 0){
    sec = 60;
    min --;
  }

  if(min < 0){
    clearTimeout(t);
  }

  // add a zero in front of numbers<10
  min=checkTime(min);
  sec=checkTime(sec);
  document.getElementById('txt').innerHTML=min+":"+sec;
  t=setTimeout('startTime()',1000);
}

function checkTime(i)
{
  if (i<10) 
    {i="0" + i}
    return i
}