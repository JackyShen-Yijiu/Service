/**
 * Created by v-lyf on 2015/9/2.
 */
//返回用户基本信息
exports.resBaseUserInfo=function(user){
    //console.log(user);
    this.userid;
    this.displaymobile;
    this.mobile=user.mobile;
    this.name=user.name;
    this.nickname=user.nickname;
    this.createtime=user.createtime;
    this.email=user.email;
    //this.token=user.token;
    this.headportrait =user.headportrait;
    this.carmodel=user.carmodel;
    this.subject=user.subject;
    this.logintime=user.logintime;
    this.invitationcode=user.invitationcode;
    this.applystate=user.applystate;
    this.applyschoolinfo=user.applyschoolinfo;
    this.displayuserid=user.displayuserid;
    this.is_lock=user.is_lock;
    this.telephone=user.telephone;
    this.applystate=user.applystate;
    this.applycoachinfo=this.applycoachinfo;
    this.applyclasstypeinfo=this.applyclasstypeinfo;
};
