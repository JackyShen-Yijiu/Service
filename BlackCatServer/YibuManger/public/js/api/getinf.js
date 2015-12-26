function get_act(resp){//传入返回的全部数据
	if(resp.type==1){
		var abc='';
		for(var i=0;i<resp.data.schoollist.length;i++){
		abc=abc+'<ul class="backcor">'+'<li class="wid135 leftcor">'+resp.data.schoollist[i].name+'</li>'+'<li class="wid135">'+resp.data.schoollist[i].address+'</li>'+'<li class="wid135">'+resp.data.schoollist[i].applyingstudentcount+'</li>'+'<li class="wid135">'+resp.data.schoollist[i].reservationcoursecount+'</li>'+'<li class="wid135">'+resp.data.schoollist[i].complaintcount+'</li>'+'<li class="wid135">'+resp.data.schoollist[i].createtime+'</li>'+'<li class="wid19 rightcor"><a href="#">删除</a>　　　<a href="#">编辑</a></li>'+'</ul>';	
		}
		document.getElementById('content').innerHTML=abc;
		//以下为分页代码
		var klm='<ul><li class="one"></li><li class="onepage hidd">上一页</li>';
		for(var i=1;i<=resp.data.pagecount;i++){
		klm=klm+'<li class="blue" onClick="getinf('+i+')">'+i+'</li>';
		}
		klm=klm+'<li class="none">....</li><li id="last">20</li><li class="onepage">下一页</li></ul>'
		document.getElementById('fengye').innerHTML=klm;
		//分页代码结束
	}
	else {window.location.href="login.html";}
}
function getinf(num){
if(num=='' || num==null){
var page=1;
}
else {var page=num;}
var url="http://192.168.1.102/admin/manage/getschoollist?index="+page;//指明请求的网址
var date="";
ajax_get('get_act',url,date);
}