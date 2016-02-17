/**
 * Created by li on 2015/11/28.
 */

// ��ҵ��Ѷ ��Ϣ


var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  IndustryNewsSchema = new Schema({
    createtime:{type:Date,default:Date.now()},//  ����ʱ��
    title:{type:String,default:""},   //����
    logimg:{type:String,default:""},  //
    description:{type:String,default:""},  // ������Ϣ
    contenturl:{type:String,default:""},   // ���ݵ���Ϣ
    content:{type:String,default:""}, // 文章内容
    newstype:{type:Number,default:0},  // 咨询类型  0 行业咨询 1 笑话
    viewcount:{type:Number,default:0},  // �������
    sharecount:{type:Number,default:0}  // �������
});

IndustryNewsSchema.plugin(seqlist.plugin, {
    model: 'industrynews',
    field: 'seqindex',
    start: 0,
    step: 1
});
IndustryNewsSchema.index({userid: 1});
module.exports = mongoose.model('industrynews', IndustryNewsSchema);