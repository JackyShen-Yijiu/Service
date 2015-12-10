function countDown(obj,second){
	var schoolid= $("#schoolid").val();
	var mobile=$("#mobile").val();
	if(schoolid===undefined||schoolid.length==0||mobile.length==0){
		layer.msg("参数不完整",{
			icon: 2,
			time: 2000
		});
		return;
	}
	time(obj);
	$.get("/validation/sendschoolcode?schoolid="+schoolid+"&mobile="+mobile, function(data,status){
		if(status=="success"){
			if(data.type==1){

			}
			else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}
		}else{
			layer.msg("审核失败",{
				icon: 2,
				time: 2000
			});
		}
	});

	//if(second>=0){
	//	if(typeof buttonDefaultValue === 'undefined' ){
	//		buttonDefaultValue =  obj.defaultValue;
	//	}
	//	obj.disabled = true;
	//	obj.value = buttonDefaultValue+'('+second+')';
	//	second--;
	//	setTimeout(function(){countDown(obj,second);},1000);
	//}else{
	//	obj.disabled = false;
	//	obj.value = buttonDefaultValue;
	//}


}

function sendMerchantcode(obj)
{
	var merchantid= $("#merchantid").val();
	var mobile=$("#mobile").val();
	if(merchantid===undefined||merchantid.length==0||mobile.length==0){
		layer.msg("参数不完整",{
			icon: 2,
			time: 2000
		});
		return;
	}
	time(obj);
	$.get("/validation/sendmerchantcode?merchantid="+merchantid+"&mobile="+mobile, function(data,status){
		if(status=="success"){
			if(data.type==1){

			}
			else{
				layer.msg(data.msg,{
					icon: 2,
					time: 2000
				});
			}
		}else{
			layer.msg("审核失败",{
				icon: 2,
				time: 2000
			});
		}
	});
}
var wait=60;
function time(o) {
	if (wait <= 0) {
		o.removeAttribute("disabled");
		o.value="获取验证码";
		wait = 60;
	} else {
		o.setAttribute("disabled", true);
		o.value="重新发送(" + wait + ")";
		wait--;
		setTimeout(function() {
					time(o)
				},
				1000)
	}
}