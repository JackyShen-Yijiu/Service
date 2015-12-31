/**
 * Created by li on 2015/11/9.
 */
// �̳Ƕ�����


var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  MallOrderSchema = new Schema({
    userid:String, // �û�id
    createtime:{type:Date,default:Date.now()},//  ����ʱ��
    finishtime:Date,
    usertype:Number, // 1 ѧԱ 2 ����
    productid:{type: Schema.Types.ObjectId, ref: 'mallproduct'}, //��������
    orderstate:{type:Number,default:1}, // ����״̬ 1 �����У�
    receivername:String, // �ռ�������
    mobile:String,  //�ֻ���
    address:String,  //�ռ���ַ
    orderscanaduiturl:String, // 订单扫码确认url
    couponid:String, // 如果是优惠券报名此字段有值
    is_confirmbyscan:{ type: Boolean, default: false}  // 是否进行扫描消费
});

MallOrderSchema.plugin(seqlist.plugin, {
    model: 'mallorder',
    field: 'seqindex',
    start: 0,
    step: 1
});
MallOrderSchema.index({userid: 1});
module.exports = mongoose.model('mallorder', MallOrderSchema);
