
$.ajaxSetup({
  contentType: "application/json; charset=utf-8",
  crossDomain: true
});

function AddSchool(sch_name, sch_address, sch_contact){
    
    if(sch_name.value == ''){
        //setNameErr(true);
    }else{
        var sch_workingtime  = sch_workingtime_from + "-" + sch_workingtime_from_end;
        var jiaxiao = {
            name: sch_name.value,
            province: sch_province.value,
            city: sch_city.value,
            address: sch_address.value,
            phone: sch_phone.value,
            responsible: sch_contact.value,
            hours: sch_workingtime.value,
            website: sch_website.value,
            email: sch_email.value,
            introduction: sch_abs.value,
            //contact: sch_class.value,
            coachcount: sch_countofcoach.value,
            carcount: sch_countofcar.value,
            schoollevel: sch_level.value,
            studentcount: sch_countofstudent.value,
            passingrate: sch_passrate.value,
            hotindex: sch_hotindex.value,
            //contact: sch_trainfield.value,
            registertime: sch_createtime.value,
            businesslicensenumber: sch_businesslicensenumber.value,
            organizationcode: sch_organizationcode.value,
            picPath: picPath
        };
        console.log(jiaxiao);
        $.post(apiHost + "driveSchool/register", 
            JSON.stringify(jiaxiao), 
            //res,
            function(data){
                $("#code_error").hide();
                console.log(data);
                if(data.code > 0){
                    alert("新增驾校成功！");
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
    console.log('性别' + $('input:radio[name="Sex"]:checked').val());
    var sch_workingtime  = sch_workingtime_from + "-" + sch_workingtime_from_end;
    
    if(coa_name.value == ''){
        //setNameErr(true);
    }else{
        
        var coach = {
            name: coa_name.value,
            Gender: $('input:radio[name="Sex"]:checked').val(),
            province: coa_province.value,
            city: coa_city.value,
            address: coa_address.value,
            phone: coa_phone.value,
            email: coa_email.value,
            password: coa_password.value,
            seniority: coa_seniority.value,
            idcardnumber: coa_idcardnumber.value,
            drivelicensenumber: coa_drivelicensenumber.value,
            coachnumber: coa_coachnumber.value,
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
                    alert("新增教练成功！");
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
    $("#sch_workingtime_from")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
    $("#sch_workingtime_from_end")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
    $("#coa_workingtime_from")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
    $("#coa_workingtime_from_end")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
    $("#coa_starlevel")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
  });

var picPath;
function uploadSchoolImage() {
    console.log("submit event");
    picPath = file_path.value;
    var fd = new FormData(document.getElementById("fileinfo"));
    fd.append("label", "WEBUPLOAD");
    $.ajax({
      url: "/driveSchool/upload",
      type: "POST",
      data: fd,
      enctype: 'multipart/form-data',
      processData: false,  // tell jQuery not to process the data
      contentType: false   // tell jQuery not to set contentType
    }).done(function( data ) {
        console.log( data.code );
        if(data.code > 0){
            alert("上传成功！");
        }else{
            alert("上传失败！");
        }
    });
    return false;
}
function uploadCoachImage() {
    console.log("submit event");
    console.log(coachImage_path.value);
    picPath = coachImage_path.value;
    var fd = new FormData(document.getElementById("coachImage"));
    fd.append("label", "WEBUPLOAD");
    $.ajax({
      url: "/coach/upload",
      type: "POST",
      data: fd,
      enctype: 'multipart/form-data',
      processData: false,  // tell jQuery not to process the data
      contentType: false   // tell jQuery not to set contentType
    }).done(function( data ) {
        console.log( data.code );
        if(data.code > 0){
            alert("上传成功！");
        }else{
            alert("上传失败！");
        }
    });
    return false;
}

function getDriveSchools(){

}