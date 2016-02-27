/**
 * Created by fei on 2015-10-23.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserInfoSchema= new Schema({
	id:{type: Schema.Types.ObjectId, default:null, ref: 'user'},
	kemuyi_wronglist:[{type: Number, default:null, ref: 'questions'}],
	kemusi_wronglist:[{type: Number, default:null, ref: 'questions'}],
	kemuyi_score:[{socre:Nubmer,begintime:Nubmer,endtime:number,is_pass:{type: Number, default:0}}], // 科目一成績單
	kemusi_score:[{socre:Nubmer,begintime:Nubmer,endtime:number,is_pass:{type: Number, default:0}}], // 科目一成績單
});

UserInfoSchema.statics.FindByID = function(_id, callback) {
    this.findOne({id:_id}, function(err, result){
    	console.log(result);
    	callback(err, result); 
    });
};

//UserInfoSchema.statics.Add

module.exports = mongoose.model('UserInfo', UserInfoSchema);