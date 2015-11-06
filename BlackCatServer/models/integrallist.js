/**
 * Created by li on 2015/11/6.
 */

// ���ַ�����ʷ��¼��
var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  IntegrallistSchema = new Schema({
    userid:String, // �û�id
    createtime:{type:Date,default:Date.now()},// ע��ʱ��
    usertype:Number, // 1 ѧԱ 2 ����
    amount :Number, //��������
    type:Number  // ��������
});

IntegrallistSchema.plugin(seqlist.plugin, {
    model: 'integrallist',
    field: 'seqindex',
    start: 0,
    step: 1
});
module.exports = mongoose.model('integrallist', IntegrallistSchema);