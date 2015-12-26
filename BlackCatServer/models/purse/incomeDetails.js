/**
 * Created by v-yaf_000 on 2015/12/26.
 */
//收入详情表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incomeDetailsSchema=new Schema({
    userid:String, // 用户ID
    createtime:{type:Date,default:Date.now()}, //创建时间
    usertype:Number, //用户类型 1 用户 2教练
    income :{type:Number,default:0}, //收入
    type:Number,  //1 收入  2 提取
    state:{type:Number,default:1},    // 1  有限  0 无效
    failurereason:String
});

incomeDetailsSchema.index({userid: 1});
incomeDetailsSchema.index({createtime:-1});
module.exports = mongoose.model('incomedetails', incomeDetailsSchema);