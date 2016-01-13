/**
 * Created by v-yaf_000 on 2016/1/12.
 */
/**
 * Created by li on 2015/11/9.
 */
// �̳Ƕ�����


var mongoose = require('mongoose');
var seqlist=require("../idautoinc");
var Schema = mongoose.Schema;

var  UserCashOutSchema = new Schema({
    userid:String, //   用户id
    createtime:{type:Date,default:Date.now()},//  ����ʱ��
    finishtime:Date,
    usertype:Number, // 1学员  2 教练，
    money:Number,  // 取钱金额
    cashoutstate:{type:Number,default:1}, //  1 申请中 2 付款中 3 付款成功 4 付款失败  5 作废
    cardtype:Number, //卡类型  1微信  2 支付宝 3银联卡
    name:String,   // 绑定用户名称
    cardnumber:String,   // 卡号码
    cardbank:String,  //如果是银行卡是哪个类型的
});

UserCashOutSchema.plugin(seqlist.plugin, {
    model: 'usercashout',
    field: 'seqindex',
    start: 0,
    step: 1
});
UserCashOutSchema.index({userid: 1});
module.exports = mongoose.model('usercashout', UserCashOutSchema);
