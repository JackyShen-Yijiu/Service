/**
 * Created by v-yaf_000 on 2015/12/25.
 */

// 系统收益表 用户报名成功后显示收入表

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SystemIncomeSchema=new Schema({
    userid:String, // 用户ID
    is_referrer:{type:Boolean,default:false}, // 是否是受邀用户
    createtime:{type:Date,default:Date.now()}, //创建时间
    applyclasstype:{type: Schema.Types.ObjectId, ref: 'classtype'}, //报名课程
    classprice:{type:Number,default:0},  // 课程的价格
    dealprice:{type:Number,default:0},   //成交价格
    totalrevenue:{type:Number,default:0}, // 总收益
    systemretains:{type:Number,default:0},// 系统预留
    userdeserveincome:{type:Number,default:0},  // 用户应得
    useractualincome:{type:Number,default:0},  // 用户实得
    rewardmoney:{type:Number,default:0}, // 奖励金额
    systemsurplus:{type:Number,default:0},  // 系统剩余
    rewardsurplus:{type:Number,default:0}, //奖励剩余
    rewardlist:[String],// 发放列表
    settingrewardtime:{type:Date,default:Date.now()},// 设定的发放日期
    actualrewardtime:{type:Date}, //  实际发送日期
    rewardstate:{type:Number,default:0} //发送状态 0 未发送  1 发放中  2 发放成功 3 未发放作废  4 已发放退费
});

SystemIncomeSchema.index({userid: 1});
SystemIncomeSchema.index({settingrewardtime:-1});
module.exports = mongoose.model('systemincome', SystemIncomeSchema);
