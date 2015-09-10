/**
 * Created by metis on 2015-09-01.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImgInfo= new Schema({
    id :Number,
    originalpic:{type:String,default:""},
    thumbnailpic:{type:String,default:""},
    width:{type:String,default:""},
    height:{type:String,default:""}

});
var DriveSchoolSchema=new Schema({
    name :{type:String,default:''},
    latitude: {type:Number,default:0},
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    pictures:[ImgInfo],
    logoimg:{
        originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}
    },
    passingrate:Number, // 通过率
    hours:{type:String,default:""}, //营业时间
    introduction :{type:String,default:""}, // 简介
    createtime:{type:Date,default:Date.now()}, //
    registertime:{type:Date,default:Date.now()},
    address: {type:String,default:''},
    responsible:{type:String,default:''}, // 负责人
    phone:{type:String,default:''},  //联系电话
    websit:{type:String,default:''}  // 网址

});

/**
 * Get restaurants near a given location/radius.
 * @param latitude
 * @param longitude
 * @param radius
 * @param limit
 * @param callback
 */
DriveSchoolSchema.statics.getNearDriverSchool = function(latitude, longitude, radius, callback) {
    // CAUTION: paramters (lat, lon, radius) in the query must be type of Number.
//    this.find({loc:{$geoWithin:{ $centerSphere:[[longitude, latitude], radius/6378100.0]}}}) //within cycle of radius

    this.find({loc:{$nearSphere:{$geometry:{type:'Point', coordinates:[longitude, latitude]}, $maxDistance: radius}}}) //from near to far
      //  .select('name branchName latitude longitude dpUrl logoUrl avgPrice popularity')
//        .sort({popularity: -1})
   //     .limit(limit?limit:10)
        .lean()
        .exec(callback);
};

DriveSchoolSchema.index({loc: '2dsphere'});
module.exports = mongoose.model('DriveSchool', DriveSchoolSchema);
