/**
 * Created by v-lyf on 2015/9/2.
 */
//�����û�������Ϣ
exports.resBaseUserInfo=function(user){
    //console.log(user);
    this.userid;
    this.displaymobile;
    this.mobile=user.mobile;
    this.name=user.name;
    this.nickname=user.nickname;
    this.createtime=user.createtime;
    this.email=user.email;
    this.headportrait =user.headportrait;
    this.carmodel=user.carmodel;
    this.subject={
        "subjectid": user.subject.subjectid,
        "name": user.subject.name
    };
    this.logintime=user.logintime;
    this.invitationcode=user.invitationcode||"";
    this.applystate=user.applystate;
    this.applyschoolinfo=user.applyschoolinfo;
    this.displayuserid=user.displayuserid;
    this.is_lock=user.is_lock;
    this.telephone=user.telephone;
    this.applycoachinfo=user.applycoachinfo;
    this.applyclasstypeinfo=user.applyclasstypeinfo;
    this.gender=user.gender;
    this.signature=user.signature;
    this.addresslist=user.addresslist;
    this.address=user.address;
    this.subjecttwo=user.subjecttwo;
    this.subjectthree=user.subjectthree;
    this.vipserverlist=user.vipserverlist;
};
