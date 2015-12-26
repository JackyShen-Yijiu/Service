function action(resp){//传入返回的全部数据
 
	if(resp.type==1){
		window.location.href="index.html";	
	}
	else {window.location.href="login.html";}
}



function login(){
var user=document.getElementById('user').value;
var mima=document.getElementById('mima').value;
if(user=="" || user==null){document.getElementById('user_el').innerHTML="不能为空！";return false;}
if(mima=="" || user==null){document.getElementById('mima_el').innerHTML="不能为空！";return false;}
//var url="http://192.168.1.102/admin/doLogin";//指明请求的网址
//var date="userName="+user+"&password="+mima;

checkinfo(user,mima);
}


//验证用户名和密码

function checkinfo(user,pwd){
	var params="userName="+user+"&password="+pwd;
	$.ajax({
     type: "POST",
     url: "/admin/doLogin",
     data: params,
	 dataType : "json",
     success: function(data){
     if(data.type == 1){
		window.location.href="/admin/manage/schoollsit";
		}else if(data.type == 0){
			
		 $("#error_el").text("用户名或密码错误");
	   }
   }
})
	
}