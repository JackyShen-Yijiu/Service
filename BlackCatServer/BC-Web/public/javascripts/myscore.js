(function(){
	// http://localhost:3600/question/getmysocre?userid=56c129e11bedd418084c043b
    $.get('http://localhost:3600/question/getmysocre?userid=56c129e11bedd418084c043b', function(Mydata){
        console.log(Mydata.data);
        console.log(Mydata.data.kemusi_score);//科四
        console.log(Mydata.data.kemuyi_score);//

    });

	
})();