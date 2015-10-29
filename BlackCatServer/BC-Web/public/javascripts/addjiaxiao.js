
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
    console.log('school: ' + coa_driveschool.value);
    console.log('train field:' + $("#coa_trainfield option:selected").text());
    var coa_workingtime  = coa_workingtime_from + "-" + coa_workingtime_from_end;
    
    if(coa_name.value == ''){
        //setNameErr(true);
    }else{
        var subject = new Array();
        $("[name='coa_subject']:checked").each(function(index, element) {
                        var s = subjects[$(this).val()];
                        console.log("subject" + s.subjectid + s.name);
                        subject.push(s);
                        // strSel += $(this).val() + ",";
                     });

        var coach = {
            name: coa_name.value,
            validationstate: $('input:radio[name="coa_validationstate"]:checked').val(),
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
            driveschool: coa_driveschool.value,
            abs: coa_abs.value,
            studentcount: coa_studentcount.value,
            passrate: coa_passrate.value,
            starlevel: coa_starlevel.value,
            workingtime: coa_workingtime.value,
            subject: subject,
            //subject: [{subjectid:coa_subject.value, name:$("#coa_subject option:selected").text()}],
            carmodel: {modelsid:$("#coa_carmodel option:selected").index() + 1,name:$("#coa_carmodel option:selected").text(),code:coa_carmodel.value},
            //carmodel_name: coa_carmodel_name.value,
            //carmodel_code: coa_carmodel_code.value,
            trainfield: coa_trainfield.value,
            trainfieldName: $("#coa_trainfield option:selected").text(),
            platenumber: coa_platenumber.value,
            serverclasslist: coa_serverclasslist.value
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

function AddField(){
    console.log('add field.');

    
    if(field_fieldname.value == ''){
        //setNameErr(true);
    }else{
        
        var field = {
            fieldname: field_fieldname.value,
            driveschool: field_driveschool.value,
            province: coa_province.value,
            city: coa_city.value,
            address: coa_address.value,
            responsible: field_responsible.value,
            phone: field_phone.value,
            capacity: field_capacity.value,
            fielddesc: field_fielddesc.value,
            subject: field_subject.value
        };
        console.log(field);
        $.post(apiHost + "trainingfield/register", 
            JSON.stringify(field), 
            //res,
            function(data){
                $("#code_error").hide();
                console.log(data);
                if(data.code > 0){
                    alert("新增训练场成功！");
                }else if(data.code == -1){
                    
                }
            }).fail(function(a, b, c) {
                console.log('failed.');
            });
        }
}

function AddClassType(){
    console.log('add field.');

    
    if(ct_classname.value == ''){
        //setNameErr(true);
    }else{
        
        var ct = {
            classname: ct_classname.value,
            schoolid: ct_schoolid.value,
            begindate: ct_begindate.value,
            enddate: ct_enddate.value,
            is_using: coa_address.value,
            is_vip: field_responsible.value,
            carmodel: {modelsid:$("#ct_carmodel option:selected").index() + 1,name:$("#ct_carmodel option:selected").text(),code:ct_carmodel.value},
            //carmodel_name: ct_carmodel_name.value,
            //carmodel_code: ct_carmodel_code.value,
            cartype: ct_cartype.value,
            applycount: ct_applycount.value,
            classdesc: ct_classdesc.value,
            vipserverlist_name: ct_vipserverlist_name.value,
            price: ct_price.value,
            onsaleprice: ct_onsaleprice.value
        };
        console.log(ct);
        $.post(apiHost + "classtype/register", 
            JSON.stringify(ct), 
            //res,
            function(data){
                $("#code_error").hide();
                console.log(data);
                if(data.code > 0){
                    alert("新增课程成功！");
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
    /*if(name.value == ''){ 
        setErr($("#name_error"), true)
        coa_phone.focus();
        return false;
    }else{
        setErr($("#name_error"), false)
        return true;
    }*/
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
    /*$("#coa_driveschool")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );

    $("#coa_trainfield")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );*/
    $("#field_driveschool")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
    $("#ct_schoolid")
        .selectmenu()
        .selectmenu( "menuWidget" )
        .addClass( "overflow" );
  });

var picPath;
function uploadSchoolImage() {
    console.log("submit event");
    //picPath = file_path.value;
    picPath = file_path.value.substring(file_path.value.lastIndexOf("\\") + 1);
    console.log(picPath);
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
var coach_Image;
function uploadCoachImage() {
    console.log("submit event");
    
    //picPath = coachImage_path.value;
    coach_Image = coachImage_path.value.substring(coachImage_path.value.lastIndexOf("\\") + 1);
    console.log(coach_Image);
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
var field_Image;
function uploadFieldImage() {
    console.log("submit event");
    
    //picPath = coachImage_path.value;
    coach_Image = fieldImage_path.value.substring(fieldImage_path.value.lastIndexOf("\\") + 1);
    console.log(coach_Image);
    var fd = new FormData(document.getElementById("fieldImage"));
    fd.append("label", "WEBUPLOAD");
    $.ajax({
      url: "/trainingfield/upload",
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

function showAddCoach(){
    console.log('show add coach');

    for (s in subjects) {
        console.log(s);
        $('#coa_subject').append('<option value="' + subjects[s].subjectid + '">' + subjects[s].name + '</option>');
    }

    $.get(apiHost + "driveSchool/driveSchoollist",
        function(data){
          //callback(data, "OK");
          console.log(data);
          for (s in data) {
                console.log(s);
                $('#coa_driveschool').append('<option value="' + data[s]._id + '">' + data[s].name + '</option>');
            }
            coa_driveschool_changed();
        }).fail(function(xHr, status, message){
        //callback(message, "Fail");
            console.log(message);
        });

}

function coa_driveschool_changed(){
    console.log('change');
    $.get(apiHost + "trainingfield/trainingFieldlist/"+coa_driveschool.value,
        function(data){
          //callback(data, "OK");
          console.log(data);
          $('#coa_trainfield').find('option').remove();
          for (s in data) {
                console.log(s);
                $('#coa_trainfield').append('<option value="' + data[s]._id + '">' + data[s].fieldname + '</option>');
            }

        }).fail(function(xHr, status, message){
        //callback(message, "Fail");
            console.log(message);
        });
    $.get(apiHost + "classtype/classTypelist/"+coa_driveschool.value,
        function(data){
          //callback(data, "OK");
          console.log(data);
          $('#coa_serverclasslist').find('option').remove();
          for (s in data) {
                console.log(s);
                $('#coa_serverclasslist').append('<option value="' + data[s]._id + '">' + data[s].classname + '</option>');
            }

        }).fail(function(xHr, status, message){
        //callback(message, "Fail");
            console.log(message);
        });
}

function showAddTrainField(){
    console.log('show add coach');

    $.get(apiHost + "driveSchool/driveSchoollist",
        function(data){
          //callback(data, "OK");
          console.log(data);
          for (s in data) {
                console.log(s);
                $('#field_driveschool').append('<option value="' + data[s]._id + '">' + data[s].name + '</option>');
            }

        }).fail(function(xHr, status, message){
        //callback(message, "Fail");
            console.log(message);
        });
}

function showAddClassType(){
    console.log('show add coach');

    $.get(apiHost + "driveSchool/driveSchoollist",
        function(data){
          //callback(data, "OK");
          console.log(data);
          for (s in data) {
                console.log(s);
                $('#ct_schoolid').append('<option value="' + data[s]._id + '">' + data[s].name + '</option>');
            }

        }).fail(function(xHr, status, message){
        //callback(message, "Fail");
            console.log(message);
        });
}

function getDriveSchools(){

}

var subjects=[
{
    subjectid:0,
    name:'准备报考'

},
{
    subjectid:1,
    name:'科目一'

},
{
    subjectid:2,
    name:'科目二'

},
{
    subjectid:3,
    name:'科目三'

}
,
{
    subjectid:4,
    name:'科目四'

},
{
    subjectid:5,
    name:'新手上路'
},
{
    subjectid:6,
    name:'我是老鸟'

}

];