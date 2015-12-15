/**
 * Created by li on 2015/11/11.
 */
var express   = require('express');
var pushtest = express.Router();
var pushstudent=require("../Common/PushStudentMessage");
var pushcoach=require("../Common/PushCoachMessage");

var pushHeadMaster=require("../Common/PushHeadMasterMessage.js");

var BaseReturnInfo = require('../custommodel/basereturnmodel.js');

pushtest.get("/headmaster/pushNewVersion",function(req,res){
    var apptype=req.query.apptype;
    pushHeadMaster.pushNewVersion(apptype,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
pushtest.get("/headmaster/pushSystemMessage",function(req,res){
    var userid=req.query.userid;
    var title=req.query.title;
    var msg_content=req.query.msg_content;
    pushHeadMaster.pushSystemMessage(userid,title,msg_content,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/headmaster/pushStudentApply",function(req,res){
    var userid=req.query.userid;
    var studentid=req.query.studentid;
    pushHeadMaster.pushStudentApply(userid,studentid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
pushtest.get("/headmaster/pushComplaintToHeadMaster",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushHeadMaster.pushComplaintToHeadMaster(userid,reservationid  ,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/student/pushNewVersion",function(req,res){
    var apptype=req.query.apptype;
    pushstudent.pushNewVersion(apptype,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
pushtest.get("/student/walletupdate",function(req,res){
    var userid=req.query.userid;
    pushstudent.pushWalletUpdate(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});


pushtest.get("/student/pushCoachComment",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushstudent.pushCoachComment(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
pushtest.get("/student/pushApplySuccess",function(req,res){
    var userid=req.query.userid;

    pushstudent.pushApplySuccess(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/student/pushReservationSuccess",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushstudent.pushReservationSuccess(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/student/pushsystemmessage",function(req,res){
    var userid=req.query.userid;
    var title=req.query.title;
    var msg_content=req.query.msg_content;
    pushstudent.pushSystemMessage(userid,title,msg_content,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/student/pushReservationCancel",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushstudent.pushReservationCancel(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

//----------------------------------------------------------------------------------------------------------------
   // 教练端
//版本更新
pushtest.get("/coach/NewVersion",function(req,res){
    var apptype=req.query.apptype;
    pushcoach.pushNewVersion(apptype,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
// 钱包更新
pushtest.get("/coach/walletupdate",function(req,res){
    var userid=req.query.userid;
    pushcoach.pushWalletUpdate(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/coach/AuditSuccess",function(req,res){
    var userid=req.query.userid;
    pushcoach.pushAuditSuccess(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
pushtest.get("/coach/AuditFailed",function(req,res){
    var userid=req.query.userid;
    pushcoach.pushAuditFailed(userid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/coach/NewReservation",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushcoach.pushNewReservation(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/coach/ReservationCancel",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushcoach.pushReservationCancel(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});

pushtest.get("/coach/NewComment",function(req,res){
    var userid=req.query.userid;
    var reservationid=req.query.reservationid;
    pushcoach.pushStudentComment(userid,reservationid,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});
//
pushtest.get("/coach/pushsystemmessage",function(req,res){
    var userid=req.query.userid;
    var title=req.query.title;
    var msg_content=req.query.msg_content;
    pushcoach.pushCoachSystemMessage(userid,title,msg_content,function(err,data){
        if(err){
            return res.json(new BaseReturnInfo(0,err,{}));
        }
        return res.json(new BaseReturnInfo(1,"",data));
    })
});




module.exports = pushtest;