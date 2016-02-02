var chapter = 1;

function go(_chapter){
  chapter = _chapter;
  $("body").removeClass("loading");
  init()
}

function init() {
    console.log('init. user id is: ' + userID);
    //chapter = 1;//getUrlParam('chapter');
    previouslylist = [];
    switch(chapter){
      case 1:
        chapexamids = chap_4_1_examids;
        Allcount = chap_4_1_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
      case 2:
        chapexamids = chap_4_2_examids;
        Allcount = chap_4_2_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);        
        break;
      case 3:
        chapexamids = chap_4_3_examids;
        Allcount = chap_4_3_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
      case 4:
        chapexamids = chap_4_4_examids;
        Allcount = chap_4_4_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
      case 5:
        chapexamids = chap_4_5_examids;
        Allcount = chap_4_5_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
      case 6:
        chapexamids = chap_4_6_examids;
        Allcount = chap_4_6_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
      case 7:
        chapexamids = chap_4_7_examids;
        Allcount = chap_4_7_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
    }

    var arri = 0;

    var j = 0;

    for (var i = 0, len = chapexamids.length; i < len; i++) {
      for (var minm = chapexamids[i][0], maxm = chapexamids[i][1]; minm <= maxm; minm++) {
        myExamID[arri] = minm;
        arri++;
      }
    }

    for ( myExamOrderid = 0; myExamOrderid < Allcount; myExamOrderid++) {
      myExamOrder[myExamOrderid] = myExamOrderid + 1
    }

    nextQestion();
}

function nextQestion(){
  selectAns = 0;
  if(QIndex < Allcount){
    console.log("next");
    ++QIndex;
    //$("#number_title").text(++QIndex);
    getQuestionByID(myExamID[QIndex - 1], showQuestions, true);
    //getQuestionByID(1596, showQuestions, true);
  }
  $("#li_answer1").off();
  $("#li_answer2").off();
  $("#li_answer3").off();
  $("#li_answer4").off();
  $("#confirmBtn").css("background-color", "#efefef");
}
function preQestion(){
  selectAns = 0;
  if(QIndex > 1){
    console.log("next");
    --QIndex;
    //$("#number_title").text(--QIndex);
    getQuestionByID(myExamID[QIndex - 1], showQuestions, false);
  }
  $("#li_answer1").off();
  $("#li_answer2").off();
  $("#li_answer3").off();
  $("#li_answer4").off();
}

function getQuestionList(id, callback){
    selectAns = 0;
    console.log("get question list");
    $.get(apiHost + "question/questionlist/" + id,
        function(data){
          callback(data, "OK");
        }).fail(function(xHr, status, message){
        callback(message, "Fail");
    });
}


var QIndex = 0;
var currentQuestion;
var rightCount=0, wrongCount=0;
var answered=false;
var previouslylist= [];

function answerIsRight(){
  //$("#rightAnswer").show();
  //$("#wrongAnswer").hide();
  if(answered == false){
    answered = true;
    if(previouslylist.indexOf(ExaminIDs[QIndex - 1])==-1) {
      rightCount++;
      $("#rightCount").text(rightCount);
      $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)) + "%");
    }
  }
}
function answerIsWrong(){
  //$("#rightAnswer").hide();
  //$("#wrongAnswer").show();
  if(answered == false){
    answered = true;

    if(previouslylist.indexOf(ExaminIDs[QIndex - 1])==-1) {
      wrongCount++;
      $("#wrongCount").text(wrongCount);
      $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)) + "%");
      }

      if(kemusi_wronglist.indexOf(ExaminIDs[QIndex - 1])==-1) {
        kemusi_wronglist.push(myExamID[QIndex - 1]);
      }
  }
}

var selectAns = 0;

function tjanswer_m(li_, answer){
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
  $("#rightAnswer_txt").show();
  $("#why_label_txt").show();
}

