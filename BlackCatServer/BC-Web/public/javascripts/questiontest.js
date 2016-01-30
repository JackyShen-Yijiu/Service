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
    previouslylist = [];
   //localStorage.clear()


}


//创建试题
function CreateExam(){

  initilizeQuestion();

  ExaminIDs = new Array();
  var i = 0;
  //
  while(ExaminIDs.length < 35){
    var qid = chap_1_ExamID[getQuestionID(chap_1_count)];//题id（章节）
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

  console.log(ExaminIDs);//每一份题里题id集合
  console.log(ExaminIDs.length);
}


//随机选题
function getQuestionID(per){
  var r = Math.floor(Math.random() * (per)) ;
  //console.log(r);
  return r;
}

var chap_1_ExamID = new Array(chap_1_count);
var chap_2_ExamID = new Array(chap_2_count);
var chap_3_ExamID = new Array(chap_3_count);
var chap_4_ExamID = new Array(chap_4_count);


//每一章节
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


var Allcount;
var QIndex;//题号
var currentQuestion;
var rightCount=0, wrongCount=0;//设置正确的题数，错误的题数
var answered=false;
var previouslylist= [];//将做过的题id push到数组里，当返回上一道题时，循环判断ID，若数组里存在，wrongCount，rightCount都不加1



//下一题
function nextQestion(){
  console.log(QIndex + ' ' + Allcount);

  if(QIndex < Allcount){
    console.log("next"); 
    $("#number_title").text(++QIndex);//下一题题号
    getQuestionByID(ExaminIDs[QIndex - 1], showQuestions);

    if(QIndex == 1){
      $("#btnNext").text("下一题");
      //获取做题开始时间
      sTime=new Date().getTime();
    }

    if(QIndex == 100){
      $("#btnNext").text("结束");
      //获取做题结束时间
      endTime=new Date().getTime();

    }
  }else{
    clearTimeout(t);
    $("body").addClass("loading");
    $("#test_result").text(rightCount + "分");//本次模拟分数

    //把成绩传到后台(insert功能)
    $.get(apiHost + "questiontest" ,{grade:rightCount,sTime:sTime,endTime:endTime})

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
  /*
  if ( previouslylist.indexOf(ExaminIDs[QIndex - 1])>-1){
    return;
  }*/
  if(answered == false){
    answered = true;

    if(previouslylist.indexOf(ExaminIDs[QIndex - 1])==-1){

        rightCount++;
        $("#rightCount").text(rightCount);
        $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)));
        previouslylist.push(ExaminIDs[QIndex - 1]);

    }


  }
}
//检验答案是否错误
function answerIsWrong(){
 /* if ( previouslylist.indexOf(ExaminIDs[QIndex - 1])>-1){
    return;
  }*/
    if(answered == false){
       answered = true;

        if(previouslylist.indexOf(ExaminIDs[QIndex - 1])==-1) {//检测数组是否有某个特定的值,不存在时计数，若存在不计数

          wrongCount++;
          $("#wrongCount").text(wrongCount);
          $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)));
          previouslylist.push(ExaminIDs[QIndex - 1]);

        }


      if ( kemuyi_wronglist.indexOf(ExaminIDs[QIndex - 1])==-1) {
        kemuyi_wronglist.push(ExaminIDs[QIndex - 1]);  //ExaminIDs[QIndex - 1]错题id
      }

  }
}




var min;//分
var sec;//秒
var t;
var sTime;//开始时间
var endTime;//结束时间



//答题倒计时
function startTime()
{
  console.log("start timer");
  sec--;
  if(sec < 0){
    sec = 60;
    min --;
  }

  if(min < 0){//倒计时小于0
    clearTimeout(t);
    $("body").addClass("loading");

    $("#test_result").text(rightCount + "分");//本次模拟分数

    //把成绩传到后台(insert功能) $.get(url,[data],[callback],[type])
    $.get(apiHost + "questiontest",{grade:rightCount,sTime:sTime,endTime:endTime})

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
