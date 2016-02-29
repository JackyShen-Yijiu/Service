//顺序练习
var chapter = 1;

function go(_chapter){
  chapter = _chapter;
  $("body").removeClass("loading");
  init();
}
//选择章节
function init() {
    console.log('init. user id is: ' + userID);
   //chapter = 1;//getUrlParam('chapter');

    previouslylist= [];

    switch(chapter){
      case 1:
        chapexamids = chap_1_examids;
        Allcount = chap_1_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
      case 2:
        chapexamids = chap_2_examids;
        Allcount = chap_2_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);        
        break;
      case 3:
        chapexamids = chap_3_examids;
        Allcount = chap_3_count;
        myExamID = new Array(Allcount);
        myExamOrder = new Array(Allcount);
        break;
      case 4:
        chapexamids = chap_4_examids;
        Allcount = chap_4_count;
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
         // console.log("  myExamID[arri] :"+ myExamID[arri]);
      }
    }

    for ( myExamOrderid = 0; myExamOrderid < Allcount; myExamOrderid++) {
      myExamOrder[myExamOrderid] = myExamOrderid + 1
    }

    nextQestion();
}

function nextQestion(){
  if(QIndex < Allcount){
    console.log("next");
    $("#number_title").text(++QIndex);
    getQuestionByID(myExamID[QIndex - 1], showQuestions, true);
    //getQuestionByID(29, showQuestions, true);

  }


}
function preQestion(){
  if(QIndex > 1){
    console.log("next");
    $("#number_title").text(--QIndex);
    getQuestionByID(myExamID[QIndex - 1], showQuestions, false);
  }
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
      if(previouslylist.indexOf(myExamID[QIndex - 1])==-1) {
          rightCount++;
          $("#rightCount").text(rightCount);
          $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)) + "%");
          previouslylist.push(myExamID[QIndex - 1]);


      }

  }
}
function answerIsWrong(){
  //$("#rightAnswer").hide();
  //$("#wrongAnswer").show();
  if(answered == false){
    answered = true;

      if(previouslylist.indexOf(myExamID[QIndex - 1])==-1){
      wrongCount++;
      $("#wrongCount").text(wrongCount);
      $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)) + "%");
          previouslylist.push(myExamID[QIndex - 1]);
      }

      if(kemuyi_wronglist.indexOf(myExamID[QIndex - 1])==-1) {
          kemuyi_wronglist.push(myExamID[QIndex - 1]);
      }
  }
}

/*
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
}*/


//继续上一次的题
function continueQuestion(){
   console.log("Continue to the last of the last question");
    $.get(apiHost + "questionlist/userinfo/" + userID,
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