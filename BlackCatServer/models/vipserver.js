/**
 * Created by li on 2015/11/3.
 */
    // vip 服务列表
var mongoose = require('mongoose');
var seqlist=require("./idautoinc");
var Schema = mongoose.Schema;

var  VipServerSchema = new Schema({
    name:String,
    color:String
});

VipServerSchema.plugin(seqlist.plugin, {
    model: 'vipserver',
    field: 'id',
    start: 0,
    step: 1
});

VipServerSchema.statics.getVIPServicesList = function(callback) {
    this.find({})
        .lean()
        .exec(callback);
};

VipServerSchema.index({name: 1});


module.exports = mongoose.model('vipserver', VipServerSchema);
