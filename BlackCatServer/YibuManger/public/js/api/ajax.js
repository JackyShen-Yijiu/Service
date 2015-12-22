function ajax(func,url,date)
{	
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
	var resp=xmlhttp.responseText;
	var elfunc = func+"("+resp+");";//设定执行的函数
	eval(elfunc);//执行函数
    }
  }
xmlhttp.open("POST",url,true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send(date);
}
//if(get_post=="" || get_post==null){var get_post="POST";} //发送形式在外部指定
function ajax_get(func,url,date)
{	
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {	
	var resp=xmlhttp.responseText;
	var elfunc = func+"("+resp+");";//设定执行的函数
	eval(elfunc);//执行函数
    }
  }
xmlhttp.open("GET",url,true);
xmlhttp.send(date);
}