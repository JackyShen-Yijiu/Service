(function(){
	// http://localhost:3600/question/getmysocre?userid=56c129e11bedd418084c043b

    //获取数据
    $.get('http://www.yibuxueche.com/question/getmysocre?userid=56c129e11bedd418084c043b', function(Mydata){
        console.log(Mydata.data);
        //console.log(Mydata.data.kemusi_score);//科四
        //console.log(Mydata.data.kemuyi_score);//科目一
        //console.log(Mydata.data.kemuyi_score[i].socre);
        var oScoreBlock=$('.score-block')[0];

        for (var i = 0; i < Mydata.data.kemuyi_score.length; i++) {
            var div=document.createElement('div');

            var spans="";
            //毫秒转换成本地时间
            /*date start*/
            var date_start=new Date(Mydata.data.kemuyi_score[i].begintime);
            var date_end=new Date(Mydata.data.kemuyi_score[i].endtime);

            var year_start=date_start.getFullYear();
            var year_end=date_end.getFullYear();

            var month_start=date_start.getMonth()+1;
            var month_end=date_end.getMonth()+1;

            var day_start=date_start.getDay()+1;
            var day_end=date_end.getDay()+1;

            var date_start=year_start+"/"+month_start+"/"+day_start;
            var date_end=year_end+"/"+month_end+"/"+day_end;
            /*date end*/

            spans+="<span class='cell-title'>"+"得分："+Mydata.data.kemuyi_score[i].socre+"</span>";
            spans+="<span class='cell-title'>"+"开始时间："+date_start+"</span>";
            spans+="<span class='cell-title'>"+"结束时间："+date_end+"</span>";

            if(Mydata.data.kemuyi_score[i].is_pass==1){
                spans+="<span class='cell-title'>"+"是否通过：是"+"</span>";
            }else{
                spans+="<span class='cell-title'>"+"是否通过：否"+"</span>";
            }


            div.innerHTML=spans;

            oScoreBlock.appendChild(div);

        };

        var oScoreBlock=$('.score-block')[1];

        for (var i = 0; i < Mydata.data.kemuyi_score.length; i++) {
            var div=document.createElement('div');

            var spans="";

            /*date start*/
            var date_start=new Date(Mydata.data.kemuyi_score[i].begintime);
            var date_end=new Date(Mydata.data.kemuyi_score[i].endtime);

            var year_start=date_start.getFullYear();
            var year_end=date_end.getFullYear();

            var month_start=date_start.getMonth()+1;
            var month_end=date_end.getMonth()+1;

            var day_start=date_start.getDay()+1;
            var day_end=date_end.getDay()+1;

            var date_start=year_start+"/"+month_start+"/"+day_start;
            var date_end=year_end+"/"+month_end+"/"+day_end;
            /*date end*/

            spans+="<span class='cell-title'>"+"得分："+Mydata.data.kemuyi_score[i].socre+"</span>";
            spans+="<span class='cell-title'>"+"开始时间："+date_start+"</span>";
            spans+="<span class='cell-title'>"+"结束时间："+date_end+"</span>";

            if(Mydata.data.kemuyi_score[i].is_pass==1){
                spans+="<span class='cell-title'>"+"是否通过：是"+"</span>";
            }else{
                spans+="<span class='cell-title'>"+"是否通过：否"+"</span>";
            }

            div.innerHTML=spans;

            oScoreBlock.appendChild(div);

        };





    });


})();