var ExaminIDs;

//初始化
function init() {
    console.log('init.');

    CreateExam();
    Allcount = course_4_count;
    QIndex = 0;
    currentQuestion;
    //console.log(Allcount)
    rightCount=0, wrongCount=0;//初始化正确的题数，错误的题数
    answered=false;

    nextQestion();
    previouslylist = [];

}


//创建试题
function CreateExam(){

    initilizeQuestion();

    ExaminIDs = new Array();
    var i = 0;

//创建一份试题
    while(ExaminIDs.length < course_4_count) {
        var qid = chap_all_ExamID [getQuestionID(course_4_count)];
        if (ExaminIDs.indexOf(qid) == -1) {
            ExaminIDs.push(qid);
            console.log(i + ':' + qid);
            i++;
        } else {

        }
    }
    console.log(ExaminIDs);//每一份题里题id集合
    console.log(ExaminIDs.length);
}


//随机生成题目id
function getQuestionID(per){
    var r = Math.floor(Math.random() * (per)) ;
    //console.log(r);
    return r;
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
var QIndex;
var currentQuestion;
var rightCount=0, wrongCount=0;
var answered=false;
var previouslylist= [];

function nextQestion(){
    if(QIndex < Allcount){
        console.log("next");
        $("#number_title").text(++QIndex);
        getQuestionByID(ExaminIDs[QIndex - 1], showQuestions);

        if(QIndex == 1){
            $("#btnNext").text("下一题");
        }
        if(QIndex == course_4_count){
            $("#btnNext").text("结束");
        }
    }else{

        $("body").addClass("loading");

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
    if(answered == false) {
        answered = true;
        if (previouslylist.indexOf(ExaminIDs[QIndex - 1]) == -1)
            rightCount++;
        $("#rightCount").text(rightCount);
        $("#rightRate").text(Math.ceil(rightCount * 100 / (rightCount + wrongCount)) + "%");
        previouslylist.push(ExaminIDs[QIndex - 1]);

    }
}

function answerIsWrong(){
    //$("#rightAnswer").hide();
    //$("#wrongAnswer").show();
    if(answered == false){
        answered = true;
        if(previouslylist.indexOf(ExaminIDs[QIndex - 1])==-1){
            wrongCount++;

            $("#wrongCount").text(wrongCount);
            $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)) + "%");
            previouslylist.push(ExaminIDs[QIndex - 1]);
        }

        if(kemusi_wronglist.indexOf(ExaminIDs[QIndex - 1])==-1){
            kemusi_wronglist.push(ExaminIDs[QIndex - 1]);
        }

    }
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
 }
 */


function tjanswer_m(li_, answer){
    console.log(hexc($(li_).css('backgroundColor')));
    if(hexc($(li_).css('backgroundColor')) == "#ffffff"){
        $(li_).css("background-color", "#efefef");
        selectAns++;
    }else {
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


