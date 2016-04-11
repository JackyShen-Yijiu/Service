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
var userconsultModel=mongodb.UserConsultModel;
var activityModel=mongodb.ActivityModel;
var systemmessageModel=mongodb.SystemMessageModel;
var industryNewsModel=mongodb.IndustryNewsModel;
var activityCouponModel= mongodb.ActivityCouponModel;
var prodcutdetail=require("../Config/sysconfig").validationurl.prodcutdetail;
require('date-utils');

exports.getUserConsult=function(index,callback){
    userconsultModel.find({})
        .select(" userid content  createtime replycontent replytime replyuser")
        .populate("userid","name headportrait")
        .sort({"createtime" : 1})
        .skip((index-1)*10)
        .limit(10)
        .exec(function(err,data){
            if(err){
                return callback("查询数据出错："+err);
            }
            var list=[];
            data.forEach(function(r,index){
                console.log(r);
                if(!r.userid){
                    r.userid=undefined;
                }
                list.push(r);
            })
            return callback(null,list);
        })
}
// 保存用户咨询信息
exports.saveUserConsult=function(userinfo,callback){
    var userconsult=new userconsultModel();
    userconsult.userid=userinfo.userid;
    userconsult.mobile=userinfo.mobile;
    userconsult.licensetype=userinfo.licensetype;
    userconsult.content=userinfo.content;
    userconsult.name=userinfo.name;
    userconsult.createtime=new Date();
    userconsult.save(function(err){
        if(err){
            return callback("保存反馈信息出错："+err);
        }
        return callback(null,"success");
    })
};
//  查询用户消息
exports.getmessagecount=function(searchinfo,callback){
    systemmessageModel.count({userid:searchinfo.coachid,seqindex:{"$gt":searchinfo.lastmessage}},
    function(err,systemmessagecount){
        if(err){
            return callback("查询系统消息数量出错："+err);
        }
        industryNewsModel.count({seqindex:{"$gt":searchinfo.lastnews}},function(err,newscount){
            if(err){
                return callback("查询行业信息："+err);
            }
            var info={
                //systemmessagecount:systemmessagecount,
                //newscount:newscount
                messageinfo:{
                    messagecount:systemmessagecount,
                    message:"您的积分有更新",
                    messagetime:(new Date).toFormat("YYYY-MM-DD")
                },
                Newsinfo:{
                    newscount:newscount,
                    news:"",
                    newstime:(new Date).toFormat("YYYY-MM-DD")
                }

            }
            return  callback(null,info);
        })
    })

    };
exports.consultinfo=function(consultinfo,callback){

}
exports.saveFeedback=function(feedbackinfo,callback){
  var feedback=new feedbackModel();
    feedback.feedbackmessage=feedbackinfo.feedbackmessage;
    feedback.userid=feedbackinfo.userid;
        feedback.appversion=feedbackinfo.appversion;
        feedback.mobileversion=feedbackinfo.mobileversion;
        feedback.network=feedbackinfo.network;
        feedback.resolution=feedbackinfo.resolution;
    feedback.createtime=new Date();
    feedback.feedbacktype=feedbackinfo.feedbacktype;  // 反馈类型  0 平台反馈 1 投诉教练 2  投诉驾校
    feedback.name=feedbackinfo.name ;
    feedback.feedbackusertype=feedbackinfo.feedbackusertype ;  //投诉类型  0 匿名投诉 1 实名投诉
    feedback.moblie=feedbackinfo.moblie; // 投诉人手机号
    feedback.becomplainedname=feedbackinfo.becomplainedname ;  //被投诉姓名
    feedback.piclist=feedbackinfo.piclist.split(',');   // 图片列表
    //console.log(feedback.createtime);
    feedback.save(function(err){
        if(err){
            return callback("保存反馈信息出错："+err);
        }
        return callback(null,"success");
    })
};
// 获取我的投诉列表
exports.getcomplaintlist=function(query,callback){
    feedbackModel.find({"userid":query.userid,"$or":[{"feedbacktype":1},{"feedbacktype":2}]})
        .select("_id feedbackmessage  userid  createtime feedbacktype name feedbackusertype becomplainedname piclist")
        .exec(function(err,data){
            if(err){
                return callback("查询我的投诉出错："+err);
            }
            return callback(null,data);
        })
}
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
  exports.getMallProduct=function(searchinfo,callback){
    mallProductModel.find({"is_using":true,"enddate":{$gte:new Date()},"is_scanconsumption":searchinfo.producttype})
        .populate("merchantid","",{"city":new RegExp(searchinfo.cityname)})
        .sort({"productprice" : 1})
        .skip((searchinfo.index-1)*10)
        .limit(searchinfo.count)
        .exec(function(err,productlist){
            if(err){
                return callback("查询商品出错："+err)
            };
            process.nextTick(function(){
                var toplist=[];
                var mainlist=[];
                productlist.forEach(function(r,index){
                    //console.log(r);
                    if(r.merchantid!=undefined)
                    {
                    var oneproduct={
                        productid: r._id,
                        productname: r.productname,
                        productprice: r.productprice,
                        productimg: r.productimg,
                        productdesc: r.productdesc,
                        viewcount: r.viewcount,
                        buycount: r.buycount,
                        productcount: r.productcount,
                        detailsimg: r.detailsimg,
                        detailurl: prodcutdetail+r._id,
                        is_scanconsumption: r.is_scanconsumption?Number(r.is_scanconsumption):0,
                        cityname: r.merchantid.city,
                        merchantid: r.merchantid._id,
                        address: r.merchantid.address,
                        enddate: r.enddate,
                        county:r.merchantid.county,
                        distinct:0
                    };
                        mainlist.push(oneproduct);}
                })
                return callback(null,{toplist:toplist,mainlist:mainlist})
            })
        })
}

// 获取商品详情
exports.getProductDetail=function(productid,callback){
    mallProductModel.findByIdAndUpdate(new mongodb.ObjectId(productid),{$inc:{"viewcount":1}})
        .populate("merchantid","")
        .exec(function(err,data){
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
                productcount: data.productcount,
                enddate:data.enddate?data.enddate.toFormat("YYYY-MM-DD"):new Date().addMonths(1).toFormat("YYYY-MM-DD"),
                detailsimg: data.detailsimg,
                is_scanconsumption: data.is_scanconsumption?Number(data.is_scanconsumption):0,
                cityname: data.merchantid.city,
                merchantid: data.merchantid._id,
                merchantname: data.merchantid.name,
                merchantmobile: data.merchantid.mobile,
                merchantname: data.merchantid.name,
                address: data.merchantid.address,
                county:data.merchantid.county,
                distinct:0
            };
            return callback(null,oneproduct);
        }else
        {
            return callback("没有查到相应的产品");
        }
    })
}


exports.getActivity=function(cityname,callback){
    var datenow=new Date();
 activityModel.find({"is_using":true,
     "city":new RegExp(cityname),"enddate":{$gte:new Date()}})
     .sort({"createtime":-1})
     .exec(function(err,data){
         if(err){
             return callback("查询活动出错"+err);
         }
         list= _.map(data,function(item,i){
             var activitystate=1; // 0 未开始 1 正在进行  2  已过期
             if( datenow<new Date(item.begindate)){
                 activitystate=0;
             }
             else if(datenow>new Date(item.enddate)){
                 activitystate=2;
             }
             var one={
                 id:item._id,
                 name:item.name,
                 titleimg:item.titleimg,
                 begindate:item.begindate,
                 contenturl:item.contenturl,
                 enddate:item.enddate,
                 address:item.address,
                 activitystate:activitystate
             }
             return one;
         });
         return callback(null,list);
     })
}
// 获取地图的展示方式
exports.locationShowType=function(cityname,callback){
    cityInfoModel.findOne({"is_open":true,"name":new RegExp(cityname)})
        .select("indexid name showtype")
        .sort({index:1})
        .exec(function(err,data){
            if(err){
                return callback("查找出错："+err);
            }
            if(!data){
                return callback("该地区没有开通");
            }
            var showtype={
                name:data.name,
                showtype:data.show?data.showtype:0
            }
            return callback(null,showtype);});
}
exports.getOpenCitylist=function(searchtype,callback){
   cache.get("opencitylist"+searchtype,function(err,data){
       if(err){
           return callback(err);
       }
       if (data) {
           return callback(null,data);
       }else{
           var search={
               "is_open":true
           }
           if((searchtype+0)==1){
               search.is_hotcity=true
           }
           cityInfoModel.find(search)
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
                   cache.set("opencitylist"+searchtype,list,60*5,function(err){});
                   return callback(null,list);
               })
       }
   })

};
exports.getChildOpenCitylist=function(cityid,callback){
    cache.get("getChildOpenCitylist"+cityid,function(err,data){
        if(err){
            return callback(err);
        }
        if (data) {
            return callback(null,data);
        }else{
            var search={
                "is_open":true,
                "fatherid":cityid
            }

            cityInfoModel.find(search)
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
                    cache.set("getChildOpenCitylist"+cityid,list,60*5,function(err){});
                    return callback(null,list);
                })
        }
    })

};

// 获取活动的优惠吗
exports.getverifyactivitycoupon=function(mobile,couponcode,callback){
    activityCouponModel.findOne({"mobile":mobile,"couponcode":couponcode,"state":1,
            "endtime":{$gt: (new Date())}})
        .exec(function(err,data){
            if (err){
               return callback("查询优惠卷出错:"+err);
            }
            if (!data){
                return callback("没有查询到优惠卷");
            }
            return callback(null,data);
        })
}

