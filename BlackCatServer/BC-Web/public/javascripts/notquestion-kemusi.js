var userInfo;
var myExamID= new Array();//

//初始化
function init() {
    console.log('init.');

    getUserInfo(userID, nextQestion);

    QIndex = 0;
    currentQuestion;

    rightCount=0, wrongCount=0;//初始化正确的题数，错误的题数
    answered=false;


}
//
function getUserInfo(userID,callback){
    console.log("get user list: " + userID);
    initilizeQuestion();
    $.get(apiHost + "question/finishquesitonidlist/" + userID,
        function(data){
            userInfo = data;

            if(userInfo == null){
                $("body").addClass("loading");
            }else{
                notExamID = userInfo.finishquesitonidlist;
                //notExamID=[1,2,46,12,234];
                myExamID = _.difference(chap_all_ExamID, notExamID);

                //console.log("notExamID:"+ notExamID.length);
                //console.log("myExamID: " + myExamID.length);

                Allcount = myExamID.length;
                previouslylist = [];//清空上一份试题
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
var chap_all_ExamID = new Array(course_4_count);

var chap_1_ExamID = new Array(chap_4_1_count);
var chap_2_ExamID = new Array(chap_4_2_count);
var chap_3_ExamID = new Array(chap_4_3_count);
var chap_4_ExamID = new Array(chap_4_4_count);
var chap_5_ExamID = new Array(chap_4_5_count);
var chap_6_ExamID = new Array(chap_4_6_count);
var chap_7_ExamID = new Array(chap_4_7_count);


//每一章节
function initilizeQuestion(){
    var arri = 0;

    var j = 0;

    for (var i = 0, len = chap_4_1_examids.length; i < len; i++) {
        for (var minm = chap_4_1_examids[i][0], maxm = chap_4_1_examids[i][1]; minm <= maxm; minm++) {
            chap_1_ExamID[arri] = minm;
            arri++;
        }
    }

    //console.log( "chap_1_ExamID: "+ chap_1_ExamID)
    arri = 0;
    j = 0;

    for (var i = 0, len = chap_4_2_examids.length; i < len; i++) {
        for (var minm = chap_4_2_examids[i][0], maxm = chap_4_2_examids[i][1]; minm <= maxm; minm++) {
            chap_2_ExamID[arri] = minm;
            arri++;
        }
    }
    //console.log( "chap_2_ExamID"+ chap_2_ExamID )
    arri = 0;

    j = 0;

    for (var i = 0, len = chap_4_3_examids.length; i < len; i++) {
        for (var minm = chap_4_3_examids[i][0], maxm = chap_4_3_examids[i][1]; minm <= maxm; minm++) {
            chap_3_ExamID[arri] = minm;
            arri++;
        }
    }
    //console.log( "chap_3_ExamID"+ chap_3_ExamID)
    arri = 0;

    j = 0;

    for (var i = 0, len = chap_4_4_examids.length; i < len; i++) {
        for (var minm = chap_4_4_examids[i][0], maxm = chap_4_4_examids[i][1]; minm <= maxm; minm++) {
            chap_4_ExamID[arri] = minm;
            arri++;
        }
    }
    arri = 0;

    j = 0;

    for (var i = 0, len = chap_4_5_examids.length; i < len; i++) {
        for (var minm = chap_4_5_examids[i][0], maxm = chap_4_5_examids[i][1]; minm <= maxm; minm++) {
            chap_5_ExamID[arri] = minm;
            arri++;
        }
    }
    arri = 0;

    j = 0;

    for (var i = 0, len = chap_4_6_examids.length; i < len; i++) {
        for (var minm = chap_4_6_examids[i][0], maxm = chap_4_6_examids[i][1]; minm <= maxm; minm++) {
            chap_6_ExamID[arri] = minm;
            arri++;
        }
    }
    arri = 0;

    j = 0;

    for (var i = 0, len = chap_4_7_examids.length; i < len; i++) {
        for (var minm = chap_4_7_examids[i][0], maxm = chap_4_7_examids[i][1]; minm <= maxm; minm++) {
            chap_7_ExamID[arri] = minm;
            arri++;
        }
    }
    //console.log( "chap_4_ExamID"+ chap_4_ExamID);
    chap_all_ExamID=chap_1_ExamID.concat(chap_2_ExamID).concat(chap_3_ExamID).concat(chap_4_ExamID).concat(chap_5_ExamID).concat(chap_6_ExamID).concat(chap_7_ExamID);
    console.log( "chap_all_ExamID"+ chap_all_ExamID.length);
}


var Allcount;
var QIndex;//题号
var currentQuestion;
var rightCount, wrongCount;//设置正确的题数，错误的题数
var answered=false;
var previouslylist= [];//将做过的题id push到数组里，当返回上一道题时，判断ID，若数组里存在，wrongCount，rightCount都不加1

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

        if(previouslylist.indexOf(myExamID[QIndex - 1])==-1) {
            wrongCount++;
            $("#wrongCount").text(wrongCount);
            $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)) + "%");
            previouslylist.push(myExamID[QIndex - 1]);
        }

        if(kemusi_wronglist.indexOf(myExamID[QIndex - 1])==-1) {
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