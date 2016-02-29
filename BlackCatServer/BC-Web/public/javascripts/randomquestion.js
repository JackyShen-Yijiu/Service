var ExaminIDs;

//初始化
function init() {
    console.log('init.');

    CreateExam();
    Allcount = course_1_count;
    QIndex = 0;
    currentQuestion;

    rightCount=0, wrongCount=0;
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
    while(ExaminIDs.length < course_1_count) {
        var qid = chap_all_ExamID [getQuestionID(course_1_count)];
        if (ExaminIDs.indexOf(qid) == -1) {
            ExaminIDs.push(qid);
            console.log(i + ':' + qid);
            i++;
        } else {

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
var chap_all_ExamID = new Array(course_1_count);

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

    //console.log( "chap_1_ExamID: "+ chap_1_ExamID)
    arri = 0;
    j = 0;

    for (var i = 0, len = chap_2_examids.length; i < len; i++) {
        for (var minm = chap_2_examids[i][0], maxm = chap_2_examids[i][1]; minm <= maxm; minm++) {
            chap_2_ExamID[arri] = minm;
            arri++;
        }
    }
    //console.log( "chap_2_ExamID"+ chap_2_ExamID )
    arri = 0;

    j = 0;

    for (var i = 0, len = chap_3_examids.length; i < len; i++) {
        for (var minm = chap_3_examids[i][0], maxm = chap_3_examids[i][1]; minm <= maxm; minm++) {
            chap_3_ExamID[arri] = minm;
            arri++;
        }
    }
    //console.log( "chap_3_ExamID"+ chap_3_ExamID)
    arri = 0;

    j = 0;

    for (var i = 0, len = chap_4_examids.length; i < len; i++) {
        for (var minm = chap_4_examids[i][0], maxm = chap_4_examids[i][1]; minm <= maxm; minm++) {
            chap_4_ExamID[arri] = minm;
            arri++;
        }
    }
    //console.log( "chap_4_ExamID"+ chap_4_ExamID);
    chap_all_ExamID=chap_1_ExamID.concat(chap_2_ExamID).concat(chap_3_ExamID).concat(chap_4_ExamID);
    console.log( "chap_all_ExamID"+ chap_all_ExamID.length);
}


var Allcount;
var QIndex;//题号
var currentQuestion;
var rightCount, wrongCount;//设置正确的题数，错误的题数
var answered=false;
var previouslylist= [];//将做过的题id push到数组里，当返回上一道题时，判断ID，若数组里存在，wrongCount，rightCount都不加1



//下一题
function nextQestion(){
    console.log(QIndex + ' ' + Allcount);

    if(QIndex < Allcount){
        console.log("next");
        $("#number_title").text(++QIndex);//下一题题号

        getQuestionByID(ExaminIDs[QIndex - 1], showQuestions);//参数
        console.log(ExaminIDs[QIndex - 1]);
        if(QIndex == 1){
            $("#btnNext").text("下一题");
        }
       if(QIndex ==  1229){
            $("#btnNext").text("结束");
        }
    }else{

        $("body").addClass("loading");
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

    if(answered == false){
        answered = true;
        if(previouslylist.indexOf(ExaminIDs[QIndex - 1])==-1){
            rightCount++;
            $("#rightCount").text(rightCount);
            $("#rightRate").text(Math.ceil(rightCount*100/(rightCount+wrongCount)));
            console.log(" previouslylist :"+ previouslylist.length)
        }
    }
}
//检验答案是否错误
function answerIsWrong(){

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
            console.log("kemuyi_wronglist : "+ kemuyi_wronglist);
        }

    }
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


