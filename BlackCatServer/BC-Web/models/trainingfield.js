/**
 * Created by v-lyf on 2015/9/2.
 */
// 训练场信息
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var  TrainingFieldSchema=new Schema({
    fieldname:String,   // 训练场名称
    // 场地地点
    latitude: {type:Number,default:0},
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    address: {type:String,default:''},
    responsible:{type:String,default:''}, // 负责人
    phone:{type:String,default:''} , //联系电话
    capacity:Number, // 容量可容纳多少个辆车
    fielddesc:String,
});

/**
 * Get restaurants near a given location/radius.
 * @param latitude
 * @param longitude
 * @param radius
 * @param limit
 * @param callback
 */
TrainingFieldSchema.statics.getNearTrainingField = function(latitude, longitude, radius, callback) {
    // CAUTION: paramters (lat, lon, radius) in the query must be type of Number.
//    this.find({loc:{$geoWithin:{ $centerSphere:[[longitude, latitude], radius/6378100.0]}}}) //within cycle of radius

    this.find({loc:{$nearSphere:{$geometry:{type:'Point', coordinates:[longitude, latitude]}, $maxDistance: radius}}}) //from near to far
        //  .select('name branchName latitude longitude dpUrl logoUrl avgPrice popularity')
        .sort({capacity: -1})
        //     .limit(limit?limit:10)
        .lean()
        .exec(callback);
};

TrainingFieldSchema.index({loc: '2dsphere'});
module.exports = mongoose.model('trainingfield', TrainingFieldSchema);