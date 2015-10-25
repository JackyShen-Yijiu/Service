
$.ajaxSetup({
  contentType: "application/json; charset=utf-8",
  crossDomain: true
});

//var apiHost = 'http://192.168.1.102:3600/';//"http://123.57.254.32:4000/";
//var apiHost = 'http://123.57.7.30:3600/';
var apiHost = 'http://192.168.1.102:3600/';
//var apiHost = 'http://192.168.7.100:3600/';
function AddSchool(sch_name, sch_address, sch_contact){
    
    if(sch_name.value == ''){
        //setNameErr(true);
    }else{
        
        var jiaxiao = {
            name: sch_name.value,
            address: sch_address.value,
            contact: sch_contact.value,
        };
        console.log(jiaxiao);
        $.post(apiHost + "driveSchool/register", 
            JSON.stringify(jiaxiao), 
            //res,
            function(data){
                $("#code_error").hide();
                console.log(data);
                if(data.code > 0){
                    
                }else if(data.code == -1){
                    
                }
            }).fail(function(a, b, c) {
                console.log('failed.');
            });
        }
}

function AddCoach(coa_name, coa_address, coa_phone, coa_email, coa_password, coa_seniority, coa_drivelicensenumber, coa_trainfield){

    console.log('add coach.');
    console.log('驾龄' + coa_seniority.value);
    
    if(coa_name.value == ''){
        //setNameErr(true);
    }else{
        
        var coach = {
            name: coa_name.value,
            address: coa_address.value,
            phone: coa_phone.value,
            email: coa_email.value,
            password: coa_password.value,
            seniority: coa_seniority.value,
            drivelicensenumber: coa_drivelicensenumber.value,
            trainfield: coa_trainfield.value
        };
        console.log(coach);
        $.post(apiHost + "coach/register", 
            JSON.stringify(coach), 
            //res,
            function(data){
                $("#code_error").hide();
                console.log(data);
                if(data.code > 0){
                    
                }else if(data.code == -1){
                    
                }
            }).fail(function(a, b, c) {
                console.log('failed.');
            });
        }
}

function resetSchool(){
    sch_name.value = '';
    sch_address.value = '';
    sch_contact.value = '';
}

function resetCoach(){
    sch_name.value = '';
    sch_address.value = '';
    sch_contact.value = '';
}

function verifyName(name){
    if(name.value == ''){ 
        setErr($("#name_error"), true)
        phone.focus();
        return false;
    }else{
        setErr($("#name_error"), false)
        return true;
    }
}

function verifyPhone(phone){
    if(!(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone.value))){ 
        setErr($("#phone_error"), true)
        phone.focus();
        return false;
    }else{
        setErr($("#phone_error"), false)
        return true;
    }
}

function verifyEmail(email){
    if(!( /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(email.value))){ 
        setErr($("#email_error"), true)
        email.focus();
        return false;
    }else{
        setErr($("#email_error"), false)
        return true;
    }
}

function verifyPassword(coa_password, coa_password_2){
    if(coa_password.value != coa_password_2.value){
        setErr($("#password_error"), true)
        email.focus();
        return false;
    }else{
        setErr($("#password_error"), false)
        return true;
    }
}

function setErr(err, hide){
    if(hide){
        err.show();
    }else{
        err.hide();
    }
}

function chooseImg(uploadimagei){
  $(uploadimagei).show().focus().click().hide();
}

    function show(uploadfile, thumbnail){
  console.log("show");
  console.log(uploadfile.files[0]);
  showThumbnail(uploadfile.files, thumbnail);
}

function showThumbnail(files, thumbnail){
  for(var i=0;i<files.length;i++){
    var file = files[i]
    var imageType = /image.*/
    if(!file.type.match(imageType)){
      console.log("Not an Image");
      continue;
    }

    var image = document.createElement("img");
    // image.classList.add("")
    
    image.file = file;
    $(thumbnail).append(image);

    var reader = new FileReader()
    reader.onload = (function(aImg){
      return function(e){
        aImg.src = e.target.result;
      };
    }(image))
    var ret = reader.readAsDataURL(file);
    var canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    image.onload= function(){
      ctx.drawImage(image,100,100)
    }
  }
}

$(function() {
    $("#coa_seniority")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
  });
