/**
 * Created by v-lyf on 2015/9/1.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserCountSchema= new Schema({
    _id:{type:String,default:1},
    displayid:{type:Number,default:100001},
    invitationcode:{type:Number,default:1001},
});

UserCountSchema.statics.getUserCountInfo=function( callback){
    // return this.collection.findAndModify(query, sort, doc, options, callback);
    //,'invitationcode':1
    this.collection.findAndModify({}, [],{$inc:{'displayid':1,"invitationcode":1}},{"new":true,select: {displayid: 1,
        invitationcode:1}},function(err,rst){
        if (err){
            return callback(err);
        }
      //  console.log(rst);
         return   callback(null,rst);

    });
};
module.exports = mongoose.model('UserCountInfo', UserCountSchema);
