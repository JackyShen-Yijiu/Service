/**
 * Created by li on 2015/11/3.
 */
// 用户序列表
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  SequenceSchema = new Schema({
    model: {
        type:    String,
        require: true
    },
    field: {
        type:    String,
        require: true
    },
    seq: {
        type:     Number,
        default:  1
    }
});


/*SequenceSchema.statics.getSequence=function(name){
    async.parallel([
        function(callback){
            this.collection.findAndModify({"name":name}, [['name','asc']],
                {$inc:{'id':1}},{new:true,upsert:true},function(err,data){
                    //console.log(data);
                    return callback(err,data.value);
                });
        }
    ], function(err, results) {
        log('1.2 err: ', err);
        log('1.2 results: ', results);
    });

}*/

SequenceSchema.index({ field: 1, model: 1 }, { unique: true, required: true, index: -1 });

module.exports = mongoose.model('systemsequence', SequenceSchema);