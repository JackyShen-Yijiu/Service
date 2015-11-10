/**
 * Created by li on 2015/11/9.
 */
// 商城订单表


var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  MallOrderSchema = new Schema({
    userid:String, // 用户id
    createtime:{type:Date,default:Date.now()},//  订单时间
    finishtime:Date,
    usertype:Number, // 1 学员 2 教练
    productid:{type: Schema.Types.ObjectId, ref: 'mallproduct'}, //发放数量
    orderstate:{type:Number,default:1}, // 订单状态 1 申请中，
    receivername:String, // 收件人姓名
    mobile:String,  //手机号
    address:String  //收件地址
});

MallOrderSchema.plugin(seqlist.plugin, {
    model: 'mallorder',
    field: 'seqindex',
    start: 0,
    step: 1
});
MallOrderSchema.index({userid: 1});
module.exports = mongoose.model('mallorder', MallOrderSchema);
