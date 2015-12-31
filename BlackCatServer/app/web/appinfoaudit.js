/**
 * Created by v-yaf_000 on 2015/12/7.
 */
// web 相关页面 控制
var BaseReturnInfo = require('../../custommodel/basereturnmodel.js');
var auditserver=require('../../Server/webServer/applyInfoAudit_Server');
var sysstemserver=require('../../Server/systemdata_server');
var mobileVerify = /^1\d{10}$/;
var webtemplate='layout/validationtemplate';
exports.applyinfoAudit=function(req,res){
    var userid=req.query.userid;
    if(userid===undefined){
        var returinfo=new BaseReturnInfo(0,"用户错误",{});
        returinfo.layout=webtemplate;
        return   res.render("web/applyschoolaudit",returinfo);
    }
    auditserver.getUserapplySchool(userid,function(err,data){
        if(err){
            var returinfo=new BaseReturnInfo(0,err,{});
            returinfo.layout=webtemplate;
            return   res.render("web/applyschoolaudit",returinfo);
        }
        var returinfo=new BaseReturnInfo(1,"",data);
        returinfo.layout=webtemplate;

        return   res.render("web/applyschoolaudit",returinfo);
    })

}
exports.doapplyinfoAudit=function(req,res){
    var auditinfo={
        userid:req.body.userid,
        schoolid:req.body.schoolid,
        confirmnum:req.body.confirmnum,
        mobile:req.body.mobile
    }
    if(auditinfo.userid===undefined||auditinfo.userid===undefined||auditinfo.confirmnum===undefined
    ||auditinfo.mobile===undefined){
        return res.json(new BaseReturnInfo(0,"参数错误",""))
    }
    auditserver.doapplyinfoAudit(auditinfo,function(err,data){
        if (err) {
            return res.json(new BaseReturnInfo(0, err,"" ));
        }
        //console.log(data);
        return res.json(
            new BaseReturnInfo(1,"",data)
        );
    })

}

exports.getOrderScanInfo=function(req,res){
    var orderid =req.query.orderid;
    if(orderid===undefined){
        var returinfo=new BaseReturnInfo(0,"订单错误",{});
        returinfo.layout=webtemplate;
        return   res.render("web/userOrderInfoAudit",returinfo);
    }
    auditserver.getUserProductOrder(orderid,function(err,data){
        console.log(err);
        if(err){
            var returinfo=new BaseReturnInfo(0,err,{});
            returinfo.layout=webtemplate;
            return   res.render("web/userOrderInfoAudit",returinfo);
        }
        var returinfo=new BaseReturnInfo(1,"",data);
        returinfo.layout=webtemplate;
        console.log(returinfo);
        return   res.render("web/userOrderInfoAudit",returinfo);
    })
};
exports.getPageProductDetial=function(req,res){
    var  productid= req.query.productid;
    if (productid===undefined||productid==""){
        return   res.render("web/spxqy",new BaseReturnInfo(0,"参数错误",{}));
    }
    sysstemserver.getProductDetail(productid,function(err ,data){
        if(err){
            return   res.render("web/spxqy",new BaseReturnInfo(0,err,{}));
        }
        return   res.render("web/spxqy",new BaseReturnInfo(1,"",data));
    })
}

exports.doOrderScanAudit=function(req,res){
    var auditinfo={
        orderid:req.body.orderid,
        merchantid:req.body.merchantid,
        confirmnum:req.body.confirmnum,
         mobile:req.body.mobile
    }
    if(auditinfo.mobile===undefined||auditinfo.orderid===undefined||
        auditinfo.merchantid===undefined||auditinfo.confirmnum===undefined){
        return res.json(new BaseReturnInfo(0,"参数错误",""))
    }
    auditserver.doOrderScanAudit(auditinfo,function(err,data){
        if (err) {
            return res.json(new BaseReturnInfo(0, err,"" ));
        }
        //console.log(data);
        return res.json(
            new BaseReturnInfo(1,"",data)
        );
    })
}
// 发送商家验证码
exports.sendMerchant=function(req,res){
    var sendinfo={
        merchantid:req.query.merchantid,
        mobile:req.query.mobile
    };
    if (sendinfo.mobile === undefined||sendinfo.merchantid  === undefined) {
        return; res.json(
            new BaseReturnInfo(0,"参数错误",""));
    }
    var number = mobileVerify.exec(sendinfo.mobile);
    if (number != sendinfo.mobile) {
        return res.json(
            new BaseReturnInfo(0,"手机号错误","")
        );
    }
    auditserver.sendMerchantcode(sendinfo,function(err,data){

        if (err) {
            return res.json(new BaseReturnInfo(0, err,"" ));
        }
        //console.log(data);
        return res.json(
            new BaseReturnInfo(1,"",data)
        );
    })
}

// 发送驾校验证码
exports.sendSchoolCode=function(req,res){
    var sendinfo={
        schoolid:req.query.schoolid,
        mobile:req.query.mobile
    };
    if (sendinfo.mobile === undefined||sendinfo.schoolid  === undefined) {
        return; res.json(
            new BaseReturnInfo(0,"参数错误",""));
    }
    var number = mobileVerify.exec(sendinfo.mobile);
    if (number != sendinfo.mobile) {
        return res.json(
            new BaseReturnInfo(0,"手机号错误","")
        );
    }
    auditserver.sendSchoolcode(sendinfo,function(err,data){

                if (err) {
                return res.json(new BaseReturnInfo(0, err,"" ));
            }
            //console.log(data);
            return res.json(
                new BaseReturnInfo(1,"",data)
            );
        })

}
