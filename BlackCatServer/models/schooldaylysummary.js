/**
 * Created by li on 2015/11/30.
 */

//

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolDaylySummarySchema = new Schema({
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// ����ѧУ
    applystudentcount:{type:Number,default:0}, //��������ѧ������
    applyingstudentcount:{type:Number,default:0}, // ����״̬��ѧ��������
    goodcommentcount:{type:Number,default:0}, // ��������
    badcommentcount:{type:Number,default:0},  // ��������
    generalcomment:{type:Number,default:0},   //��������
    complaintcount:{type:Number,default:0},   // Ͷ������
    totalcoursecount:{type:Number,default:0},   // �ܹ��γ�����
    reservationcoursecount:{type:Number,default:0},  // ԤԼ�γ�����
    coachcoursecount:[{
        coachid:{type: Schema.Types.ObjectId, ref: 'coach'} , //����id
        coursecount:{type:Number,default:0}  // �����Ͽ�
    }],
    summarytime:{type:Date, required:true}            // ͳ��ʱ��
});




SchoolDaylySummarySchema.index({driveschool: 1});
SchoolDaylySummarySchema.index({summarytime: 1});

module.exports = mongoose.model('schooldaylysunmmary', SchoolDaylySummarySchema);
