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
    //this.token=user.token;
    this.headportrait =user.headportrait;

    this.logintime=user.logintime;
    this.invitationcode=user.invitationcode;
    this.displaycoachid=user.displaycoachid;
    this.is_lock=user.is_lock;
    this.address=user.address;
    this.introduction=user.introduction;
    this.Gender=user.Gender;
    this.is_validation=user.is_validation;
    this.driveschoolinfo=user.driveschoolinfo;
    this.studentcoount=user.studentcoount;
    this.commentcount=user.commentcount;
    this.Seniority=user.Seniority;
    this.passrate=user.passrate;
    this.starlevel=user.starlevel;
    this.subject=user.subject;
    this.carmodel=user.carmodel;
    this.trainfieldlinfo=user.trainfieldlinfo;
    this.is_shuttle=user.is_shuttle;
    this.coachnumber=user.coachnumber;
};
