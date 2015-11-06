/**
 * Created by v-lyf on 2015/8/16.
 */

exports.LogType={
    log:1,
    err:2,
    info:3,
    warn:4
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
// ������˵�״̬
exports.CoachValidationState={
    NotValidation:0, // δ�ύ�������
    Validationing:1, //  �����
    ValidationRefuse:2, // ���δͨ��
    Validated:3 //  ���ͨ��

};
exports.ApplyHandelState={
    NotHandel:0,// δ����
    Handeling:1,//������
    Handeled:2  // �Ѵ���
}

// ������Ϣ����״̬
exports.ApplyState={
    NotApply:0, // δ����
    Applying:1, // ������
    Applyed:2 // �����ɹ�
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
    //  待确认完成
    unconfirmfinish:5,
    //待评论
    ucomments:6,
    // 订单完成
    finish:7,
    //系统取消
    systemcancel:8
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
IntegralType={
    // 注册发放
    register:1,
    // 好友注册发放
    friendregister:2
}
