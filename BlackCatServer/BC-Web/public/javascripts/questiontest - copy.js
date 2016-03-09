var ExaminIDs;
//初始化
function init() {
    console.log('init.');

    CreateExam();

    Allcount = 100;
    QIndex = 0;
    currentQuestion;
    rightCount=0, wrongCount=0;//初始化正确的题数，错误的题数
    answered=false;
    min = 45;
    sec = 0;

    startTime();
    nextQestion();

    
}

//创建试题
function CreateExam(){
  initilizeQuestion();

  ExaminIDs = new Array();
  var i = 0;
  while(ExaminIDs.length < 35){
    var qid = chap_1_ExamID[getQuestionID(chap_1_count)];
    if(ExaminIDs.indexOf(qid) == -1){
      ExaminIDs.push(qid);
      console.log(i + ':' + qid);
      i++;
    }else{

    }
  }

  while(ExaminIDs.length < 70){
    var qid = chap_1_ExamID[getQuestionID(chap_1_count)];
    if(ExaminIDs.indexOf(qid) == -1){
      ExaminIDs.push(qid);
      console.log(i + ':' + qid);
      i++;
    }else{

    }
  }

  while(ExaminIDs.length < 90){
    var qid = chap_1_ExamID[getQuestionID(chap_1_count)];
    if(ExaminIDs.indexOf(qid) == -1){
      ExaminIDs.push(qid);
      console.log(i + ':' + qid);
      i++;
    }else{

    }
  }

  while(ExaminIDs.length < 100){
    var qid = chap_1_ExamID[getQuestionID(chap_1_count)];
    if(ExaminIDs.indexOf(qid) == -1){
      ExaminIDs.push(qid);
      console.log(i + ':' + qid);
      i++;
    }else{

    }
  }

  console.log(ExaminIDs);
  console.log(ExaminIDs.length);
}

function getQuestionID(per){
  var r = Math.floor(Math.random() * (per)) ;
  //console.log(r);
  return r;
}

var chap_1_ExamID = new Array(chap_1_count);
var chap_2_ExamID = new Array(chap_2_count);
var chap_3_ExamID = new Array(chap_3_count);
var chap_4_ExamID = new Array(chap_4_count);

function initilizeQuestion(){
  var arri = 0;

  var j = 0;

  for (var i = 0, len = chap_1_examids.length; i < len; i++) {
    for (var minm = chap_1_examids[i][0], maxm = chap_1_examids[i][1]; minm <= maxm; minm++) {
      chap_1_ExamID[arri] = minm;
      arri++;
    }
  }

  arri = 0;

  j = 0;

  for (var i = 0, len = chap_2_examids.length; i < len; i++) {
    for (var minm = chap_2_examids[i][0], maxm = chap_2_examids[i][1]; minm <= maxm; minm++) {
      chap_2_ExamID[arri] = minm;
      arri++;
    }
  }

  arri = 0;

  j = 0;

  for (var i = 0, len = chap_3_examids.length; i < len; i++) {
    for (var minm = chap_3_examids[i][0], maxm = chap_3_examids[i][1]; minm <= maxm; minm++) {
      chap_3_ExamID[arri] = minm;
      arri++;
    }
  }

  arri = 0;

  j = 0;

  for (var i = 0, len = chap_4_examids.length; i < len; i++) {
    for (var minm = chap_4_examids[i][0], maxm = chap_4_examids[i][1]; minm <= maxm; minm++) {
      chap_4_ExamID[arri] = minm;
      arri++;
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
var QIndex;//题号
var currentQuestion;
var rightCount=0, wrongCount=0;//设置正确的题数，错误的题数
var answered=false;

  

//下一题
function nextQestion(){
  console.log(QIndex + ' ' + Allcount);
  if(QIndex < Allcount){
    console.log("next"); 
    $("#number_title").text(++QIndex);//当前题号
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

//上一题
function preQestion(){
  $("#btnNext").text("下一题");
  if(QIndex > 1){
    console.log("next");
    $("#number_title").text(--QIndex);
    getQuestionByID(ExaminIDs[QIndex - 1], showQuestions);
    
  }
  
  
}

//检验答案是否正确
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

//检验答案是否错误
function answerIsWrong(){
  //$("#rightAnswer").hide();
  //$("#wrongAnswer").show();
    if(answered == false){
      answered = true;
      wrongCount++;
      $("#wrongCount").text(wrongCount);
      $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)));
      kemuyi_wronglist.push(ExaminIDs[QIndex - 1]);
  }
}

var min;
var sec;
var t;


//答题倒计时
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


//我知道了
function closeInfoDia(){
  $("body").removeClass("loading");
}

//再试一次
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

/*
function save(){
  console.log('save wrong question.');

  var u = {
    id: userID,
    kemuyi_wronglist: kemuyi_wronglist
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
}*/