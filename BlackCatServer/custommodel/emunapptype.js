/**
 * Created by v-lyf on 2015/8/16.
 */

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
// ������Ϣ����״̬
exports.ApplyState={
    NotApply:0, // δ����
    Applying:1, // ������
    Applyed:2 // �����ɹ�
}
// ������Ϣ����״̬

exports.ApplyHandelState={
    NotHandel:0,// δ����
    Handeling :1,// ������
    Handeled: 2 // ����ɹ�
}

exports.ReservationState={
    //ԤԼ��
   applying:1,
    // ȡ��ԤԼ(�Լ�ȡ��)
   applycancel:2,
    // ��ȷ��
    applyconfirm:3,
    //�Ѿܾ�(����ȡ��)
    applyrefuse:4,
    //����ɣ�������
    ucomments:5,
    // �����
    finish:6
}