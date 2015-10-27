/**
 * Created by v-lyf on 2015/9/2.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = mongoose.Schema({
	id: Number,
	question: String,
	a: String,
	b: String,
	c: String,
	d: String,
	ta: Number,
	imageurl: String,
	bestanswer: String,
	bestanswerid: String,
	Type: Number,
	sinaimg: String
});


QuestionSchema.statics.List = function(callback) {
    this.find()
        .limit(10)
        .lean()
        .exec(callback);
};
QuestionSchema.statics.FindByID = function(_id, callback) {
    this.findOne({id:_id}, function(err, result){
    	callback(err, result); 
    });
};

module.exports = mongoose.model('Questions', QuestionSchema);
