/**
 * Created by li on 2015/10/20.
 */
/// ͷ����Ϣ  ����ϵͳ�Ƽ�����Ϣ

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var HeadlineNewsSchema=new Schema({
    newsname:{type:String,default:""},
    headportrait: { originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}},
    createtime:{type:Date,default:Date.now()},
    newtype:Number,  // ͷ������ Ĭ��1 url  2���� 3 ��У��Ϣ
    linkurl:{type:String,default:""},
    is_using:{ type: Boolean, default: true}

});

HeadlineNewsSchema.index({is_using:1});
module.exports = mongoose.model('headlinenews', HeadlineNewsSchema);
