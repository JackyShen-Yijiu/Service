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
// 教练审核的状态
exports.CoachValidationState={
    NotValidation:0, // 未提交审核申请
    Validationing:1, //  审核中
    ValidationRefuse:2, // 审核未通过
    Validated:3 //  审核通过

};
// 报名信息申请状态
exports.ApplyState={
    NotApply:0, // 未报名
    Applying:1, // 申请中
    Applyed:2 // 报名成功
}
// 报名信息处理状态S
exports.ReservationState={
    //课程申请中待确认
   applying:1,
    // 取消预约(自己取消)
   applycancel:2,
    // 已确认
    applyconfirm:3,
    //已拒绝(教练取消)
    applyrefuse:4,
    //  （课程结束）待确认完成课程
    unconfirmfinish:5,
    //已确认完成，待评价
    ucomments:6,
    // 已完成 课程结束
    finish:7
}
// 考试状态信息
exports.ExamintionSatte={
    // 未申请
    noapply:0,
    // 申请中
    applying:1,
    // 申请被拒绝
    applyrefuse:2,
    // 申请确认等待考试
    applyconfirm:3,
    //   考试没有通过,可以重新报考
    nopass:4,
    //  考试通过 报考结束
    pass :5
}