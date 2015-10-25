/**
 * Created by li on 2015/10/24.
 */
var express   = require('express');
var v2 = express.Router();
v2.get('/test',function(req,res){
    return res.json("hello, BlackCat v2");
});

module.exports = v2;