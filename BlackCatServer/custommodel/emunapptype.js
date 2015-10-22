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
// 报名信息申请状态
exports.ApplyState={
    NotApply:0, // 未报名
    Applying:1, // 申请中
    Applyed:2 // 报名成功
}
// 报名信息处理状态

exports.ApplyHandelState={
    NotHandel:0,// 未处理
    Handeling :1,// 处理中
    Handeled: 2 // 处理成功
}

exports.ReservationState={
    //预约中
   applying:1,
    // 取消预约(自己取消)
   applycancel:2,
    // 已确认
    applyconfirm:3,
    //已拒绝(教练取消)
    applyrefuse:4,
    //已完成，待评价
    ucomments:5,
    // 已完成
    finish:6
}