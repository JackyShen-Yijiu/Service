/**
 * Created by v-lyf on 2015/9/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//�����Ŀγ���Ϣ
var CourseSchema=new Schema({
    coachid:{type: Schema.Types.ObjectId, ref: 'coach'},  // ����
    coursedate:Date,  //  �γ�����
    createtime:{type:Date,default:Date.now()},
    coursetime:{timeid:Number,timespace:String,begintime:String,endtime:String},  // �γ�ʱ��
    coursestudentcount:{type:Number,default:1},// �γ̿���Ԥѡ����
    selectedstudentcount:{type:Number,default:0} , //��ѡ�γ�����
    courseuser:[{type: Schema.Types.ObjectId, ref: 'User'}], // ��ѡ�γ���Ա
    // ѡ��ÿγ̵Ķ���
    coursereservation:[{type: Schema.Types.ObjectId, ref: 'reservation'}]

});

CourseSchema.statics.findCourse = function(coachid, _date, callback){

   // console.log('find: ' + _mobile);

    this.find({ coachid:new mongoose.Types.ObjectId(coachid),
        coursedate: new Date(_date) }, function(err, result) {
      //  coursedate: { $gte: new Date(_date), $lte: new Date(_date) }}, function(err, result) {
      //  new Date('2015-10-12')

        //console.log(result);
        //if(result != null) console.log('found: ' + _mobile);
       return  callback(err, result);
    });

};
CourseSchema.index({coachid: 1});
CourseSchema.index({coursedate: 1});

module.exports = mongoose.model('course', CourseSchema);