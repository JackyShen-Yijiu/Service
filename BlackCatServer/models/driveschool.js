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
// 椹炬牎淇℃伅
var DriveSchoolSchema=new Schema({
    name :{type:String,default:''},  //鍚嶇О
    latitude: {type:Number,default:0},  //鍧愭爣缁忕含搴�
    longitude: {type:Number,default:0},
    loc:{type:{type:String, default:'Point'}, coordinates:[Number]},
    pictures:[ImgInfo], //  椹炬牎鐨勫浼犲浘鐗囧湴鍧�
    logoimg:{     // 椹炬牎log
        originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}
    },
    passingrate:Number, // 閫氳繃鐜�
    hours:{type:String,default:""}, //钀ヤ笟鏃堕棿
    introduction :{type:String,default:""}, // 绠�浠�
    createtime:{type:Date,default:Date.now()}, // 娉ㄥ唽鏃堕棿
    registertime:{type:Date,default:Date.now()}, // 椹炬牎鎴愮珛鏃堕棿
    address: {type:String,default:''}, // 鍦板潃
    responsible:{type:String,default:''}, // 璐熻矗浜�
    phone:{type:String,default:''},  //鑱旂郴鐢佃瘽
    websit:{type:String,default:''},  // 缃戝潃
    schoollevel:String, //椹炬牎鏄熺骇
    carcount:Number, // 椹炬牎杞﹁締鏁�
    coachcount:Number,  // 椹炬牎鏁欑粌鏁�
    maxprice:Number,  // 鏈�楂樹环鏍�
    minprice:Number   // 鏈�浣庝环鏍�

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
