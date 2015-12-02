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
    pictures:[ImgInfo], //  驾校的宣传图片地址
    pictures_path:[{type:String, default:''}],
    logoimg:{     // 驾校log
        originalpic:{type:String,default:""},
        thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
        height:{type:String,default:""}
    },
    passingrate:Number, // 通过率
    hours:{type:String,default:""}, //营业时间
    introduction :{type:String,default:""}, // 简介
    createtime:{type:Date,default:Date.now()}, // 注册时间
    registertime:{type:Date,default:Date.now()}, // 驾校成立时间
    province: {type:String,default:''}, // 省
    city: {type:String,default:''}, // 市
    address: {type:String,default:''}, // 地址
    responsible:{type:String,default:''}, // 负责人
    phone:{type:String,default:''},  //联系电话
    website:{type:String,default:''},  // 网址
    schoollevel:String, //驾校星级
    carcount:Number, // 驾校车辆数
    coachcount:Number,  // 驾校教练数
    studentcount:Number,  // 驾校学生数
    maxprice:Number,  // 最高价格
    minprice:Number,  // 最低价格
    email :{type:String,default:""}, // 电子邮箱
    businesslicensenumber :{type:String,default:""}, // 营业执照
    organizationcode :{type:String,default:""}, // 组织机构代码
    hotindex:Number,//关注度
    applynotes:String  // 报名须知
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

    this.find(
            //修改了苹果审核能拿到数据
        //loc:{$nearSphere:{$geometry:{type:'Point', coordinates:[longitude, latitude]}, $maxDistance: 100000}}}
        ) //from near to far
      //  .select('name branchName latitude longitude dpUrl logoUrl avgPrice popularity')
//        .sort({popularity: -1})
        .limit(30)
        .lean()
        .exec(callback);
};

DriveSchoolSchema.statics.getDriverSchoolList = function(callback) {
    this.find()
        .lean()
        .exec(callback);
};

DriveSchoolSchema.index({loc: '2dsphere'});
module.exports = mongoose.model('DriveSchool', DriveSchoolSchema);

