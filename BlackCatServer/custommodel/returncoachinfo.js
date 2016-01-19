/**
 * Created by v-lyf on 2015/9/2.
 */
//返回教练基本信息
exports.resBaseCoachInfo=function(user){
    this.coachid=user._id;
    this.mobile=user.mobile;
    this.name=user.name;
    this.createtime=user.createtime;
    this.email=user.email;
    this.headportrait =user.headportrait;
    this.logintime=user.logintime;
    this.invitationcode=user.invitationcode;
    this.displaycoachid=user.displaycoachid;
    this.is_lock=user.is_lock;
    this.address=user.address;
    this.introduction=user.introduction;
    this.Gender=user.Gender;
    this.is_validation=user.is_validation;
    this.validationstate=user.validationstate;
    this.driveschoolinfo=user.driveschoolinfo;
    this.studentcoount=user.studentcount;
    this.commentcount=user.commentcount;
    this.Seniority=user.Seniority;
    this.passrate=user.passrate;
    this.starlevel=user.starlevel;
    this.subject=user.subject;
    this.carmodel=user.carmodel;
    this.trainfieldlinfo=user.trainfieldlinfo?user.trainfieldlinfo:undefined;
    this.is_shuttle=user.is_shuttle;
    this.coachnumber=user.coachnumber;
    this.platenumber=user.platenumber;
    this.drivinglicensenumber=user.drivinglicensenumber;
    this.shuttlemsg=user.shuttlemsg;
    this.introduction=user.introduction;
    this.worktimedesc=user.worktimedesc;
    this.workweek=user.workweek;
    this.worktimespace=user.worktimespace;
    this.serverclass=user.serverclasslist?user.serverclasslist.length:0;
    this.coachtype=user.coachtype?user.coachtype:0;
    this.leavebegintime=user.leavebegintime? new Date(user.leavebegintime)/1000:"";
    this.leaveendtime=user.leaveendtime? new Date(user.leaveendtime)/1000:"";

};
