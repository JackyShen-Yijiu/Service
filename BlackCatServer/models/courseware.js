/**
 * Created by li on 2015/11/6.
 */
// ��Ŀ�μ���Ϣ

var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  CourseWareSchema = new Schema({
   name:String,
    pictures:{type:String, default:''},
    videourl:String,
    subject:{subjectid:{type:Number,default:1},
        name:{type:String,default:"��Ŀһ"}}, // Ҫ��ʼ�� 0 ׼������   ��ǰ��Ŀ
    is_using:{type:Boolean,default:true},  // ����Ƶ�Ƿ�����ʹ��
});

CourseWareSchema.plugin(seqlist.plugin, {
    model: 'courseware',
    field: 'seqindex',
    start: 0,
    step: 1
});

//CourseWareSchema.index({name: 1});


module.exports = mongoose.model('courseware', CourseWareSchema);
