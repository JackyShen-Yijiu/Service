var chapexamids;
var myExamID;
var myExamOrder;
var Allcount;
var userID = getUrlParam('userid');
var kemuyi_wronglist = [];
var kemusi_wronglist = [];
var selectAns = 0;




//获取试题，唯一的id
function getQuestionByID(id, callback, enable){
    console.log("get question");
    $.get(apiHost + "question/questionbyid/" + id,
        function(data){
          callback(data, "OK", enable);
        }).fail(function(xHr, status, message){
        callback(message, "Fail", enable);
    });
}



//显示试题
function showQuestions(questoinBody, status, enable) {
  console.log("show questoin");
  answered = false;
  currentQuestion = questoinBody;

  //本地存储数据(科一)
  var questionId=currentQuestion.id;//题目id// var questionId=questoinBody.id;
  var question= questoinBody.question;//题目内容
   var questionImg=questoinBody.sinaimg;//题目图片
   var questionVedio=questoinBody.imageurl;//题目视频
  var questionAnswer=questoinBody.ta;//正确答案

   //定义一个实体对象，保存全部获取的值
     var setData=new Object ;
     setData.questionId=questionId;
     setData.question =question;
     setData.questionAnswer =questionAnswer;
     setData.questionImg =questionImg;
     setData.questionVedio =questionVedio;

     var strtxtData=JSON.stringify(setData);
  window.localStorage.setItem(questionId,strtxtData);

  //读取本地数据
  //for(var intI=0;intI<localStorage.length;intI++){
  //  //获取key值
  //  var strKey= window.localStorage.key(intI);
  //  var getData=JSON.parse(window.localStorage.getItem(strKey))
  //  $("#question_title").text(QIndex + "、" + getData.question);//形式：题号、题目内容
  //  $("#questionIndex").text(QIndex + "/" + Allcount);
  //  $(".questionDiv *").prop('disabled',false);
  //  $("#confirmBtn").css("background-color", "#efefef");
  //  $("#confirmBtn").prop('disabled',true);
  //  $("#li_answer2").css("border-bottom", "");
  //  selectAns = 0;
  //}

   if(enable){

   }else{

   }
    $("#question_title").text(QIndex + "、" + questoinBody.question);//形式：题号、题目内容
    $("#questionIndex").text(QIndex + "/" + Allcount);
    $(".questionDiv *").prop('disabled',false);
    $("#confirmBtn").css("background-color", "#efefef");
    $("#confirmBtn").prop('disabled',true);
    $("#li_answer2").css("border-bottom", "");
    selectAns = 0;

  $("#li_answer1").css("background-color", "#FFFFFF");
  $("#li_answer2").css("background-color", "#FFFFFF");
  $("#li_answer3").css("background-color", "#FFFFFF");
  $("#li_answer4").css("background-color", "#FFFFFF");

  $("#answer1_txt").css("color", "#666666");
  $("#answer2_txt").css("color", "#666666");
  $("#answer3_txt").css("color", "#666666");
  $("#answer4_txt").css("color", "#666666");

  $("#li_answer1").off();
  $("#li_answer2").off();
  $("#li_answer3").off();
  $("#li_answer4").off();

  /*
   //uncheck all options
   $("#answer1").prop("checked", false);
   $("#answer2").prop("checked", false);
   $("#answer3").prop("checked", false);
   $("#answer4").prop("checked", false);
   */
  //set icon to null
  $("#img_ans_1").prop("src","../images/default-a.png");
  $("#img_ans_2").prop("src","../images/default-b.png");
  $("#img_ans_3").prop("src","../images/default-c.png");
  $("#img_ans_4").prop("src","../images/default-d.png");


  //show question img
  if(setData.questionImg != ""){
    $("#question_img").show();
    $("#question_img").prop("src","../images/kemuyi/img-600/" + setData.questionImg);
  }else if(setData.questionVedio != ""){
    $("#question_vedio").show();
    $("#question_vedio").prop("src", "http://player.youku.com/embed/" + setData.questionVedio);
  }else{
    $("#question_img").hide();
    $("#question_vedio").hide();
  }

  if(questoinBody.Type == 2){//单选类型
    $("#confirmBtn").hide();
    //bind click event on li, and enable questionDiv
    $("#li_answer1").on("click", function(){tjanswer(this, 1);} );
    $("#li_answer2").on("click", function(){tjanswer(this, 2);} );
    $("#li_answer3").on("click", function(){tjanswer(this, 3);} );
    $("#li_answer4").on("click", function(){tjanswer(this, 4);} );
    // $("#answer1_txt").text("A：" + questoinBody.a);
    // $("#answer2_txt").text("B：" + questoinBody.b);
    // $("#answer3_txt").text("C：" + questoinBody.c);
    // $("#answer4_txt").text("D：" + questoinBody.d);
    $("#answer1_txt").text(questoinBody.a);
    $("#answer2_txt").text(questoinBody.b);
    $("#answer3_txt").text(questoinBody.c);
    $("#answer4_txt").text(questoinBody.d);

    $("#li_answer3").show();
    //$("#answer3_txt").show();
    $("#li_answer4").show();
    //$("#answer4_txt").show();
  }else if(questoinBody.Type == 1){//判断类型
    $("#confirmBtn").hide();
    $("#li_answer2").css("border-bottom", "1px solid #CCCCCC");
    //bind click event on li, and enable questionDiv
    $("#li_answer1").on("click", function(){tjanswer(this, 1);} );
    $("#li_answer2").on("click", function(){tjanswer(this, 2);} );
    // $("#li_answer3").on("click", function(){tjanswer(this, 3);} );
    // $("#li_answer4").on("click", function(){tjanswer(this, 4);} );
    $("#answer1_txt").text("正确");
    $("#answer2_txt").text("错误");

    $("#li_answer3").hide();
    //$("#answer3_txt").hide();

    $("#li_answer4").hide();
    //$("#answer4_txt").hide();
  }else if(questoinBody.Type == 3){//多选类型
    $("#confirmBtn").show();
    $("#question_title").text("[多选]" + QIndex + "、" + questoinBody.question);

    $("#li_answer1").on("click", function(){tjanswer_m(this, 1);} );
    $("#li_answer2").on("click", function(){tjanswer_m(this, 2);} );
    $("#li_answer3").on("click", function(){tjanswer_m(this, 3);} );
    $("#li_answer4").on("click", function(){tjanswer_m(this, 4);} );

    $("#answer1_txt").text(questoinBody.a);
    $("#answer2_txt").text(questoinBody.b);
    $("#answer3_txt").text(questoinBody.c);
    $("#answer4_txt").text(questoinBody.d);

    $("#li_answer3").show();
    //$("#answer3_txt").show();
    $("#li_answer4").show();
    //$("#answer4_txt").show();
  }

  $("#rightAnswer_txt").text(questoinBody.bestanswer);
  $("#rightAnswer_txt").hide();
  $("#why_label_txt").hide();

}

//提交答案
function tjanswer(li_, answer){
  $("#rightAnswer_txt").show();
  $("#why_label_txt").show();//答案详解
  $(li_).css("color", "#FF6633");

/*
  if($("#answer1_txt").is(':visible') == true){
    $("#img_ans_1").prop("src","../images/wrong-a.png");
  }
  if($("#answer2_txt").is(':visible') == true){
    $("#img_ans_2").prop("src","../images/wrong-b.png");
  }
  if($("#answer3_txt").is(':visible') == true){
    $("#img_ans_3").prop("src","../images/wrong-c.png");
  }
  if($("#answer4_txt").is(':visible') == true){
    $("#img_ans_4").prop("src","../images/wrong-d.png");
  }
*/

  switch(answer){
    case 1:
      $("#img_ans_1").prop("src","../images/wrong.png");
      $("#answer1_txt").css("color", "#FF6633");
      
      // $("#img_ans_2").prop("src","../images/wrong-b.png");
      // $("#img_ans_3").prop("src","../images/wrong-c.png");
      // $("#img_ans_4").prop("src","../images/wrong-d.png");
      break;
    case 2:
      // $("#img_ans_1").prop("src","../images/wrong-a.png");
       $("#img_ans_2").prop("src","../images/wrong.png");
       $("#answer2_txt").css("color", "#FF6633");
      // $("#img_ans_3").prop("src","../images/wrong-c.png");
      // $("#img_ans_4").prop("src","../images/wrong-d.png");
      break;
    case 3:
      if($("#answer3_txt").is(':visible') == true){
        // $("#img_ans_1").prop("src","../images/wrong-a.png");
        // $("#img_ans_2").prop("src","../images/wrong-b.png");
         $("#img_ans_3").prop("src","../images/wrong.png");
         $("#answer3_txt").css("color", "#FF6633");
        // $("#img_ans_4").prop("src","../images/wrong-d.png");
      }
      break;
    case 4:
      if($("#answer4_txt").is(':visible') == true){
        // $("#img_ans_1").prop("src","../images/wrong-a.png");
        // $("#img_ans_2").prop("src","../images/wrong-b.png");
        // $("#img_ans_3").prop("src","../images/wrong-c.png");
        $("#img_ans_4").prop("src","../images/wrong.png");
        $("#answer4_txt").css("color", "#FF6633");
      }
      break;
  }
  switch(currentQuestion.ta){
    case 1:
      $("#img_ans_1").prop("src","../images/right.png");
      $("#answer1_txt").css("color", "#39B54A");
      // $("#img_ans_2").prop("src","../images/wrong-b.png");
      // $("#img_ans_3").prop("src","../images/wrong-c.png");
      // $("#img_ans_4").prop("src","../images/wrong-d.png");
      break;
    case 2:
      // $("#img_ans_1").prop("src","../images/wrong-a.png");
       $("#img_ans_2").prop("src","../images/right.png");
       $("#answer2_txt").css("color", "#39B54A");
      // $("#img_ans_3").prop("src","../images/wrong-c.png");
      // $("#img_ans_4").prop("src","../images/wrong-d.png");
      break;
    case 3:
      if($("#answer3_txt").is(':visible') == true){
        // $("#img_ans_1").prop("src","../images/wrong-a.png");
        // $("#img_ans_2").prop("src","../images/wrong-b.png");
         $("#img_ans_3").prop("src","../images/right.png");
         $("#answer3_txt").css("color", "#39B54A");
        // $("#img_ans_4").prop("src","../images/wrong-d.png");
      }
      break;
    case 4:
      if($("#answer4_txt").is(':visible') == true){
        // $("#img_ans_1").prop("src","../images/wrong-a.png");
        // $("#img_ans_2").prop("src","../images/wrong-b.png");
        // $("#img_ans_3").prop("src","../images/wrong-c.png");
        $("#img_ans_4").prop("src","../images/right.png");
        $("#answer4_txt").css("color", "#39B54A");
      }
      break;
  }

  //提交答案时检查答案的正确性
  if(answer == currentQuestion.ta){

    $(li_).css("background-color", "#E9F3DE");
    answerIsRight();
  }else{

    $(li_).css("background-color", "#FDEDE4");
    answerIsWrong();
  }


  $("#li_answer1").off();
  $("#li_answer2").off();
  $("#li_answer3").off();
  $("#li_answer4").off();
  $(".questionDiv *").prop('disabled',true);

}

//保存错误的题目
function save(){
  console.log('save wrong question.');

  var u = {
    id: userID,
    kemuyi_wronglist: kemuyi_wronglist,
    kemusi_wronglist: kemusi_wronglist
  }

  console.log('kemuyi_wronglist: ' + kemuyi_wronglist);
  //$.post(url,[data],[callback],[type])
  $.post(apiHost + "questionwronglist/addWrongQuestion", 
      JSON.stringify(u), 
      //res,
      function(data){
          
          console.log(data);
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

//科目一章节题
var chap_1_examids = [[1,365],[2541,2640],[10923,10925],[10930,10931],[10938,10962],[10964,10971],[10978,10978],[10987,10995],[10998,11009],[11015,11015],[11022,11034],[11046,11046],[11049,11054],[11057,11078]];
var chap_1_count = 568;//第一章的题目数目
var chap_2_examids = [[366,677]];
var chap_2_count = 312;//第二章的题目数目
var chap_3_examids = [[678,864],[10926,10929],[10932,10937],[10963,10963],[10972,10977],[10979,10986],[10996,10997],[11010,11014],[11016,11021],[11035,11045],[11047,11048],[11055,11056]];
var chap_3_count = 240;//第三章的题目数目
var chap_4_examids = [[865,973]];
var chap_4_count = 109;//第四章的题目数目

//科目四章节题
var chap_4_1_examids = [[1537,1573],[11157,11157],[11262,11262]];
var chap_4_1_count = 39;
var chap_4_2_examids = [[1574,1765],[2641,2716],[11085,11085],[11108,11113],[11148,11148],[11150,11152],[11158,11164],[11177,11182],[11189,11202],[11228,11233],[11241,11241],[11263,11272]];
var chap_4_2_count = 323;
var chap_4_3_examids = [[1766,1980]];
var chap_4_3_count = 215;
var chap_4_4_examids = [[1981,2042],[2717,2727],[11086,11101],[11107,11107],[11114,11121],[11123,11128],[11138,11141],[11149,11149],[11153,11156],[11165,11172],[11183,11188],[11203,11218],[11227,11227],[11234,11240],[11242,11258]];
var chap_4_4_count = 168;
var chap_4_5_examids = [[2043,2207],[2728,2740],[11079,11082],[11084,11084],[11122,11122],[11129,11137],[11142,11147],[11259,11261]];
var chap_4_5_count = 202;
var chap_4_6_examids = [[2208,2301],[11083,11083],[11102,11103],[11173,11175],[11219,11224]];
var chap_4_6_count = 106;
var chap_4_7_examids = [[2302,2336],[11104,11106],[11176,11176],[11225,11226]];
var chap_4_7_count = 41;

var chap_4_all =[chap_4_1_examids, chap_4_2_examids, chap_4_3_examids, chap_4_4_examids, chap_4_5_examids, chap_4_6_examids, chap_4_7_examids];

//
function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}
