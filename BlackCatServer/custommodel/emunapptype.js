/**
 * Created by v-lyf on 2015/8/16.
 */
exports.weeks=["周一","周二","周三","周四","周五","周六","周日"];
exports.LogType={
    log:1,
    err:2,
    info:3,
    warn:4,
    im:5,
    push:6,
    website:7
}
exports.ClientType = {
    AndroidUserClient:1,
    AndroidCoachClient: 2,
    IosUserClient: 3,
    IosCoachClient:4
};

exports.UserType={
    User:1,
    Coach:2
};
// j教练验证状态
exports.CoachValidationState={
    NotValidation:0, // 没有验证
    Validationing:1, //  严重中
    ValidationRefuse:2, //验证拒绝
    Validated:3 //  验证成功

};
// 服务端处理状态
exports.ApplyHandelState={
    NotHandel:0,// 没有处理
    Handeling:1,//处理中
    Handeled:2  //处理成功
     }

//学员报名状态
exports.ApplyState={
    NotApply:0, // 没有申请
    Applying:1, // 申请中
    Applyed:2, // 申请成功
    Applyvalidation:3// 申请验证
}
// 预约状态
exports.ReservationState={
   //预约中
   applying:1,
    // 学生取消
   applycancel:2,
    // 已确定
    applyconfirm:3,
    //教练（拒绝或者取消）
    applyrefuse:4,
    //  待确认完成  (v1.1 中没有该字段)
    unconfirmfinish:5,
    //待评论
    ucomments:6,
    // 订单完成
    finish:7,
    //系统取消
    systemcancel:8,
    //已签到
    signin:9,
    //未签到
    nosignin:10
}
// ����״̬��Ϣ
exports.ExamintionSatte={
    // δ����
    noapply:0,
    // ������
    applying:1,
    // ���뱻�ܾ�
    applyrefuse:2,
    // ����ȷ�ϵȴ�����
    applyconfirm:3,
    //   ����û��ͨ��,�������±���
    nopass:4,
    //  ����ͨ�� ��������
    pass :5
}
// 积分发放状态
exports.IntegralState={
    //未发送
    nopay:0,
    // 注册发放中
    registerpaying:1,
    // 注册发放成功
    registerpayed:2,
    // 报名发放中
    applypaying:3,
    // 报名发放成功
    applypayed:4
}
// j积分类型
exports.IntegralType={
    // 注册发放
    register:1,
    // 好友注册发放
    friendregister:2,
    // 购买商品
    buyproduct:3
}

// 用户订单的状态
exports.MallOrderState={
    // 已申请
    applying:1,
    // 已确定 接受
    applyconfirm:2,
    //拒绝或者取消）
    applyrefuse:3,
    //  已发送
    sended:4,
    // 已完成
    finished:5

}

//统计查询类型
exports.StatisitcsType={
    day:1,
    yesterday:2,
    week:3,
    month:4,
    year:5
}
