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
// ������Ϣ����״̬S
exports.ReservationState={
    //�γ������д�ȷ��
   applying:1,
    // ȡ��ԤԼ(�Լ�ȡ��)
   applycancel:2,
    // ��ȷ��
    applyconfirm:3,
    //�Ѿܾ�(����ȡ��)
    applyrefuse:4,
    //  ���γ̽�������ȷ����ɿγ�
    unconfirmfinish:5,
    //��ȷ����ɣ�������
    ucomments:6,
    // ����� �γ̽���
    finish:7
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