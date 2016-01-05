/**
 * Created by com on 2016/1/5.
 */
$(document).ready(function(){
    //Ycode关闭遮罩
    $(".close-icon").click(function(){
        $("#mask").hide();
    });
    //Ycode点击报名单号
    $("#orderId").click(function(){
        $("#mask").show();

    })
});
