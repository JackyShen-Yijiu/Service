var ExaminIDs;

function init() {
    console.log('init.');

    CreateExam();

    Allcount = 100;
    QIndex = 0;
    currentQuestion;
    rightCount=0, wrongCount=0;
    answered=false;
    min = 45;
    sec = 0;

    startTime();
    nextQestion();
}

function CreateExam(){
  initilizeQuestion();

  ExaminIDs = new Array();
  var i = 0;
  while(ExaminIDs.length < 100){
    var qid = chap_all_ExamID[getQuestionID(1094)];
    if(ExaminIDs.indexOf(qid) == -1){
      ExaminIDs.push(qid);
      //console.log(i + ':' + qid);
      i++;
    }else{

    }
  }

  console.log(ExaminIDs);
  console.log(ExaminIDs.length);
}

function getQuestionID(per){
  var r = Math.floor(Math.random() * (per)) ;
  console.log(r);
  return r;
}

var chap_all_ExamID = new Array(1094);

function initilizeQuestion(){
  var arri = 0;

  var j = 0;

  for(var ind = 0; ind < 7; ind ++){
    for (var i = 0, len = chap_4_all[ind].length; i < len; i++) {
      for (var minm = chap_4_all[ind][i][0], maxm = chap_4_all[ind][i][1]; minm <= maxm; minm++) {
        chap_all_ExamID[arri] = minm;
        arri++;
      }
    }
  }
}





// chapexamids = [[1,365],[2541,2640],[10923,10925],[10930,10931],[10938,10962],[10964,10971],[10978,10978],[10987,10995],[10998,11009],[11015,11015],[11022,11034],[11046,11046],[11049,11054],[11057,11078]];
// myExamID = new Array(568);
// myExamOrder = new Array(568);
// var arri = 0;

// var j = 0;

// for (var i = 0, len = chapexamids.length; i < len; i++) {
//   for (var minm = chapexamids[i][0], maxm = chapexamids[i][1]; minm <= maxm; minm++) {
//     myExamID[arri] = minm;
//     arri++;
//   }
// }

// for ( myExamOrderid = 0; myExamOrderid < 568; myExamOrderid++) {
//   myExamOrder[myExamOrderid] = myExamOrderid + 1
// }

var Allcount;
var QIndex;
var currentQuestion;
var rightCount=0, wrongCount=0;
var answered=false;

function nextQestion(){
  if(QIndex < Allcount){
    console.log("next");
    $("#number_title").text(++QIndex);
    getQuestionByID(ExaminIDs[QIndex - 1], showQuestions);
    if(QIndex == 100){ 
      $("#btnNext").text("结束");
    }
  }else{ 
    clearTimeout(t);
    $("body").addClass("loading");
    $("#test_result").text(rightCount + "分");
  }
}
function preQestion(){
  $("#btnNext").text("下一题");
  if(QIndex > 1){
    console.log("next");
    $("#number_title").text(--QIndex);
    getQuestionByID(ExaminIDs[QIndex - 1], showQuestions);
  }
}
function answerIsRight(){
  //$("#rightAnswer").show();
  //$("#wrongAnswer").hide();
  if(answered == false){
    answered = true;
    rightCount++;
    $("#rightCount").text(rightCount);
    $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)) + "%");

  }
}
function answerIsWrong(){
  //$("#rightAnswer").hide();
  //$("#wrongAnswer").show();
  if(answered == false){
    answered = true;
    wrongCount++;
    $("#wrongCount").text(wrongCount);
    $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)) + "%");
    kemusi_wronglist.push(ExaminIDs[QIndex - 1]);
  }
}

var min;
var sec;
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
    $("body").addClass("loading");
    $("#test_result").text(rightCount + "分");
  }else{
    //document.getElementById('timer_txt').innerHTML=checkTime(min)+":"+checkTime(sec);
    $("#timer_txt").html(checkTime(min)+":"+checkTime(sec));
    t=setTimeout('startTime()',1000);
  }

  // add a zero in front of numbers<10
  //min=checkTime(min);
  //sec=checkTime(sec);

}

function checkTime(i)
{
  if (i<10) 
    {i="0" + i}
    return i
}

function closeInfoDia(){
  $("body").removeClass("loading");
}

function testAgain(){
  $("body").removeClass("loading");
  clear();
  init();
}

function clear(){
  rightCount=0, wrongCount=0;
  $("#rightCount").text(rightCount);
  $("#wrongCount").text(wrongCount);
  $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)));
}

function save(){
  console.log('save wrong question.');

  var u = {
    id: userID,
    kemuyi_wronglist: kemuyi_wronglist,
    kemusi_wronglist: kemusi_wronglist
  }

  console.log('kemuyi_wronglist: ' + kemuyi_wronglist);

  $.post(apiHost + "questionwronglist/addWrongQuestion", 
      JSON.stringify(u), 
      //res,
      function(data){
          
          console.log(data);
          if(data.code > 0){
              //alert("新增驾校成功！");
              return "1";
          }else if(data.code == -1){
              return "0";
          }
      }).fail(function(a, b, c) {
          console.log('failed.');
          return "0";
      });
}



function tjanswer_m(li_, answer){
  console.log(hexc($(li_).css('backgroundColor')));
  if(hexc($(li_).css('backgroundColor')) == "#ffffff"){
    $(li_).css("background-color", "#efefef");
    selectAns++;
  }else
  {
    $(li_).css("background-color", "#ffffff");
    selectAns--;
  }
  console.log(selectAns);
  if(selectAns > 1){
    $("#confirmBtn").css("background-color", "#FF6633");
    $("#confirmBtn").prop('disabled',false);
  }else{
    $("#confirmBtn").css("background-color", "#efefef");
    $("#confirmBtn").prop('disabled',true);
  }


}

function confirmQestion(){
  console.log("right answer: " + currentQuestion.ta);
  var ans = '';
  if(hexc($("#li_answer1").css('backgroundColor')) == "#efefef"){
    ans += '1';
    $("#img_ans_1").prop("src","../images/wrong.png");
  }
  if(hexc($("#li_answer2").css('backgroundColor')) == "#efefef"){
    ans += '2';
    $("#img_ans_2").prop("src","../images/wrong.png");
  }
  if(hexc($("#li_answer3").css('backgroundColor')) == "#efefef"){
    ans += '3';
    $("#img_ans_3").prop("src","../images/wrong.png");
  }
  if(hexc($("#li_answer4").css('backgroundColor')) == "#efefef"){
    ans += '4';
    $("#img_ans_4").prop("src","../images/wrong.png");
  }
  var rAns = '' + currentQuestion.ta;
  var rArr = rAns.split('');
  rArr.forEach(function(e){
    $("#img_ans_" + e).prop("src","../images/right.png");
  })



  console.log("user answer: " + ans + (ans == currentQuestion.ta));
  if(ans == currentQuestion.ta){
    answerIsRight();
  }else{
    answerIsWrong();
  }

  $("#confirmBtn").hide();


  $("#li_answer1").off();
  $("#li_answer2").off();
  $("#li_answer3").off();
  $("#li_answer4").off();
  $(".questionDiv *").prop('disabled',true);
  //$("#rightAnswer_txt").show();
  //$("#why_label_txt").show();
}
