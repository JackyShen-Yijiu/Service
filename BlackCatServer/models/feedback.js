/**
 * Created by v-lyf on 2015/10/8.
 */

/**
 * Created by v-lyf on 2015/8/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    feedbackmessage: {type:String,default:''},
    userid:{type: Schema.Types.ObjectId, ref: 'classtype'},
    appversion:String,
    mobileversion:{type:String,default:''},
    network :{type:String,default:''},
    resolution:{type:String,default:''},
    createtime:{type:Date,default:new Date().getTime()/1000}
});


module.exports = mongoose.model('feedback', FeedbackSchema);


