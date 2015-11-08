var mongodb = require('../models/mongodb');
var QuestionModel = mongodb.QuestionModel;

var mysql = require('mysql');
var connection = mysql.createConnection({
//	connectionLimit : 10,
//	host     : 'localhost',
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'jiaxiao'
});

connection.connect();

try{
    var query = connection.query('select * from kemuyi_2');
    query
        .on('error', function (err) {
            console.log(err);
        })
        .on('result', function (r) {
            //console.log('processing ' + r.q_ID);
            if (!r.jsontxt) {
                return;
            }
            var jsonText = JSON.parse(r.jsontxt);

            var q = new QuestionModel(jsonText);
            q.save(function (err, fluffy) {
    
              if (!err){

                  console.log("register school successful");

                } else {
                  console.log("register school failed: " + err);

                }

              });

            

        })
        .on('end', function () {
            //connection.release();
        });
}catch(err){
    console.log(err);
}
