var userInfo;

function init() {
    console.log('init.');
   getUserInfo(userID, nextQestion);

}

function getUserInfo(userID,callback){
    console.log("get user list: " + userID);

    $.get(apiHost + "questionwronglist/userinfo/" + userID,
        function(data){
            userInfo = data;

            if(userInfo == null){
                $("body").addClass("loading");
            }else{
                myExamID = userInfo.kemuyi_wronglist;
                //console.log("userInfo.kemuyi_wronglist:"+ userInfo.kemuyi_wronglist);
                Allcount = myExamID.length;
                previouslylist = [];//清空上一份试题

                console.log("Allcount: " + Allcount);
                if(Allcount > 0){
                    $("body").removeClass("loading");
                    callback(data, "OK");
                }else{
                    $("body").addClass("loading");
                }
            }
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
var previouslylist= [];


function nextQestion(){
  if(QIndex < Allcount){
    console.log("next");
    $("#number_title").text(++QIndex);
    getWrongQuestionByID(myExamID[QIndex - 1], showQuestions);

      if(QIndex == 1){

          $("#btnNext").text("下一题");
      }
      if(QIndex == Allcount){
          console.log("结束");
          $("#btnNext").text("结束");
      }
  }
}
function preQestion(){
  if(QIndex > 1){
    console.log("next");
    $("#number_title").text(--QIndex);
    getWrongQuestionByID(myExamID[QIndex - 1], showQuestions);
  }
}
function answerIsRight() {
    //$("#rightAnswer").show();
    //$("#wrongAnswer").hide();
    if (answered == false) {
        answered = true;

        if (previouslylist.indexOf(myExamID[QIndex - 1]) == -1) {
            rightCount++;
            $("#rightCount").text(rightCount);
            $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)));
            previouslylist.push(myExamID[QIndex - 1]);

            //删除作对的题的id
            deleteWrongQuestion(myExamID[QIndex - 1]);
           // console.log("myExamID[QIndex - 1]:"+myExamID[QIndex - 1])

        }
    }
}

//在错题库中delete 做对的题
function deleteWrongQuestion(wrongid){
    console.log('delete wrong question.');
    var u = {
        id: userID,
        wrongid:wrongid
    }
    //console.log("wrongid_id:"+ JSON.stringify(u) );
    $.post(apiHost + "questionwronglist/deleteWrongQuestion",
        JSON.stringify(u),
        function(data){

            if(data.code > 0){
                return "1";
            }else if(data.code == -1){
                return "0";
            }

        }).fail(function(a, b, c) {
        console.log('failed.');
        return "0";
    });

}

function answerIsWrong(){
  //$("#rightAnswer").hide();
  //$("#wrongAnswer").show();
  if(answered == false){
      answered = true;
      if(previouslylist.indexOf(myExamID[QIndex - 1])==-1) {
          wrongCount++;
          $("#wrongCount").text(wrongCount);
          $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)));
          previouslylist.push(myExamID[QIndex - 1]);
      }
  }
}

function play(){
  console.log("play");
  $("#falsh_embed").attr("play","true");
}