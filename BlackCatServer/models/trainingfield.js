/**
 * Created by v-lyf on 2015/9/2.
 */


// 训练场信息
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImgInfo= new Schema({
    id :Number,
    originalpic:{type:String,default:""},
    thumbnailpic:{type:String,default:""},
    width:{type:String,default:""},
    height:{type:String,default:""}

});

//驾校练车场信息
var  TrainingFieldSchema=new Schema({
    fieldname:String,   // 训练场名称
    // 场地地点
    latitude: {type:Number,default:0},
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    provice: {type:String,default:''}, // 省
    city: {type:String,default:''}, // 市
    address: {type:String,default:''}, // 练车场地址
    responsible:{type:String,default:''}, // 负责人
    phone:{type:String,default:''} , //联系电话
    capacity:Number, // 容量可容纳多少个辆车
    fielddesc:String,   // 练车场描述
    driveschool:{type: Schema.Types.ObjectId, ref: 'DriveSchool'} ,// 所在学校
    subject:[{subjectid:{type:Number,default:2},
        name:{type:String,default:"科目二"}}], //支持科目几的训练科目二
    pictures:[ImgInfo]   //练车场图片
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

TrainingFieldSchema.statics.getTrainingFieldList = function(school_id, callback) {
    this.find({driveschool:ObjectId.fromString(school_id)})
        .lean()
        .exec(callback);
    
};



TrainingFieldSchema.index({loc: '2dsphere'});
module.exports = mongoose.model('trainingfield', TrainingFieldSchema);