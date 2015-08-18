/**
 * Created by metis on 2015-08-18.
 */
var mongoose=require('mongoose');
var Schema=mongoose.schema;

exports.ImgInfo=new Schema({
    originalpic:{type:String,default:""},
    thumbnailpic:{type:String,default:""},
        width:{type:String,default:""},
    height:{type:String,default:""}

});
