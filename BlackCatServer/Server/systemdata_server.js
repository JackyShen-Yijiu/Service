/**
 * Created by metis on 2015-08-31.
 */

var mongodb = require('../models/mongodb.js');
var cache=require("../Common/cache");
var _ = require("underscore");
var feedbackModel=mongodb.FeedBackModel;
var headLineModel=mongodb.HeadLineNewsModel;
var courseWareModel=mongodb.CourseWareModel;
var mallProductModel=mongodb.MallProdcutsModel;
var cityInfoModel=mongodb.CityiInfoModel;

exports.saveFeedback=function(feedbackinfo,callback){
  var feedback=new feedbackModel();
    feedback.feedbackmessage=feedbackinfo.feedbackmessage;
    feedback.userid=feedbackinfo.userid;
        feedback.appversion=feedbackinfo.appversion;
        feedback.mobileversion=feedbackinfo.mobileversion;
        feedback.network=feedbackinfo.network;
        feedback.resolution=feedbackinfo.resolution;
    feedback.createtime=new Date();
    //console.log(feedback.createtime);
    feedback.save(function(err){
        if(err){
            return callback("保存反馈信息出错："+err);
        }
        return callback(null,"success");
    })
};
exports.getHeadLineNews=function(callback){
    headLineModel.find({"is_using":"true"})
        .limit(8)
        .sort({createtime: -1 })
        .exec(function(err,data){
            if(err){
                return callback("查询头条信息错误："+err);
            }
            return  callback (null ,data);
        })
};

exports.getCourseWare=function( queryinfo,callback){
    if (queryinfo.seqindex==0){
        queryinfo.seqindex=Number.MAX_VALUE;
    }
    //console.log(queryinfo)
    courseWareModel.find({"is_using":true,seqindex:{$lt:queryinfo.seqindex},"subject.subjectid":queryinfo.subjectid})
        .select("name pictures  videourl subject seqindex")
        .sort({"seqindex" : -1})
        .limit(queryinfo.count)
        .exec(function(err,data){
            if(err){
                return callback("查询课件出错："+err);
            }
            return callback(null,data)
        })
};

// 获取商城列表
exports.getMallProduct=function(callback){
    mallProductModel.find({"is_using":true})
        .sort({"productprice" : 1})
        .exec(function(err,productlist){
            if(err){
                return callback("查询商品出错："+err)
            };
            process.nextTick(function(){
                var toplist=[];
                var mainlist=[];
                productlist.forEach(function(r,index){
                    var oneproduct={
                        productid: r._id,
                        productname: r.productname,
                        productprice: r.productprice,
                        productimg: r.productimg,
                        productdesc: r.productdesc,
                        viewcount: r.viewcount,
                        buycount: r.buycount,
                        detailsimg: r.detailsimg,
                        is_scanconsumption: data.is_scanconsumption?data.is_scanconsumption:false
                    }

                    if (r.is_top){
                        toplist.push(oneproduct);
                    }else
                    {
                        mainlist.push(oneproduct);
                    }})
                return callback(null,{toplist:toplist,mainlist:mainlist})
            })
        })
}

// 获取商品详情
exports.getProductDetail=function(productid,callback){
    mallProductModel.findByIdAndUpdate(new mongodb.ObjectId(productid),{$inc:{"viewcount":1}},function(err,data){
        if(err){
            return callback("查询产品出错:"+err);
        }
        if(data){
            var oneproduct={
                productid: data._id,
                productname: data.productname,
                productprice: data.productprice,
                productimg: data.productimg,
                productdesc: data.productdesc,
                viewcount: data.viewcount,
                buycount: data.buycount,
                detailsimg: data.detailsimg,
                is_scanconsumption:data.is_scanconsumption?data.is_scanconsumption:false
            }
            return callback(null,oneproduct);
        }else
        {
            return callback("没有查到相应的产品");
        }
    })
}


exports.getOpenCitylist=function(callback){
   cache.get("opencitylist",function(err,data){
       if(err){
           return callback(err);
       }
       if (data) {
           return callback(null,data);
       }else{
           cityInfoModel.find({"is_open":true})
               .select("indexid name")
               .sort({index:1})
               .exec(function(err,data){
                   if(err){
                       return callback("查找出错："+err);
                   }
                   console.log(data);
                   list= _.map(data,function(item,i){
                       var one={
                           id:item.indexid,
                           name:item.name
                       }
                       return one;
                   });
                   cache.set("opencitylist",list,60*5,function(err){});
                   return callback(null,list);
               })
       }
   })

}

