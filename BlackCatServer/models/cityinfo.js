/**
 * Created by v-yaf_000 on 2015/12/17.
 */
//保存城市列表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CityInfoSchema = new Schema({
    indexid: Number,
    name:String,
    ciytype:Number,
    fatherid:Number,
    is_open :{type:Boolean,default:false},
    is_hotcity:{type:Boolean,default:false}, // 是否热门城市
    showtype:{type:Number,default:0},  // 0 驾校， 1教练

});

CityInfoSchema.index({is_open: 1});
CityInfoSchema.index({fatherid: 1});
module.exports = mongoose.model('city_info', CityInfoSchema);
/**
 * Created by v-yaf_000 on 2015/12/17.
 */
