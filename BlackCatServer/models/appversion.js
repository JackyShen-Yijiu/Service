/**
 * Created by v-lyf on 2015/8/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppversionSchema = new Schema({
    name: {type:String,default:''},
    apptype:Number,
    versionCode:String,
    innerversionCode:{type:Number,default:0},
    downloadUrl:{type:String,default:''},
    updateMessage :{type:String,default:''},
    updateTime:{type:Date,default:Date.now()},
    versionName:String //版本名称
});

AppversionSchema.statics.getVersionInfo = function (clienttype, callback) {
    //console.log('begin select getVersionInfo');

    this.findOne(
        {
            'apptype': clienttype
        }, function(err, doc) {
            if (err) {
                return callback(err);
            }

            if(!doc) {
                return callback('could not find the version data');
            }

            return callback(null, doc);
        }).limit(1).sort({updateTime:-1});
};

module.exports = mongoose.model('AppVersion', AppversionSchema);

