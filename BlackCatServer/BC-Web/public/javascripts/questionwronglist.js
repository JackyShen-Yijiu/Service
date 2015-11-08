
var userInfo;
function init() {
    console.log('init.');

    getUserInfo(userID, nextQestion);
}

function getUserInfo(id, callback){
    console.log("get user list: " + userID);
    $.get(apiHost + "questionwronglist/userinfo/" + userID,
        function(data){
          userInfo = data;
          myExamID = userInfo.kemuyi_wronglist;
          Allcount = myExamID.length;
          console.log("userinfo: " + userInfo);
          callback(data, "OK");
        }).fail(function(xHr, status, message){
        callback(message, "Fail");
    });
}

function getWrongQuestionByID(id, callback){
    console.log("get wrong question by id.");
    $.get(apiHost + "questionwronglist/questionbyid/" + id,
        function(data){
          callback(data, "OK");
        }).fail(function(xHr, status, message){
        callback(message, "Fail");
    });
}

//var chapexamids = [[1,365],[2541,2640],[10923,10925],[10930,10931],[10938,10962],[10964,10971],[10978,10978],[10987,10995],[10998,11009],[11015,11015],[11022,11034],[11046,11046],[11049,11054],[11057,11078]];
var myExamID;
//var myExamOrder;
//var arri = 0;

var j = 0;

/*for (var i = 0, len = chapexamids.length; i < len; i++) {
  for (var minm = chapexamids[i][0], maxm = chapexamids[i][1]; minm <= maxm; minm++) {
    myExamID[arri] = minm;
    arri++;
  }
}

for ( myExamOrderid = 0; myExamOrderid < 568; myExamOrderid++) {
  myExamOrder[myExamOrderid] = myExamOrderid + 1
}*/

var Allcount = 0;
var QIndex = 0;
var currentQuestion;
var rightCount=0, wrongCount=0;
var answered=false;

function nextQestion(){
  if(QIndex < Allcount){
    console.log("next");
    $("#number_title").text(++QIndex);
    getWrongQuestionByID(myExamID[QIndex - 1], showQuestions);
  }
}
function preQestion(){
  if(QIndex > 1){
    console.log("next");
    $("#number_title").text(--QIndex);
    getWrongQuestionByID(myExamID[QIndex - 1], showQuestions);
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

function play(){
  console.log("play");
  $("#falsh_embed").attr("play","true");
}