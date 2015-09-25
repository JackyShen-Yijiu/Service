/**
 * Created by v-lyf on 2015/9/14.
 */

var baseIM=require("./easemob");


exports.gettoken=function(callback)
{
    baseIM.gettoken(function(data){
        callback(data);
    })
}